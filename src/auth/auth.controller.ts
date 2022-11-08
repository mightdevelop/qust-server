import { Body, Controller, Post, UnauthorizedException, UseGuards } from '@nestjs/common'
import { UserFromRequest } from './types/request-response'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { AuthService } from './auth.service'
import { ValidateUserDto } from './dto/validate-user.dto'
import { UsersService } from 'src/users/users.service'
import { JwtRefreshGuard } from './guards/jwt-refresh.guard'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { User } from 'src/users/models/users.model'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { TokensDto } from './dto/tokens.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('auth')
@Controller('/auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) {}

    @Post('/registration')
    async registration(
        @Body() dto: CreateUserDto,
    ): Promise<TokensDto> {
        const tokens: TokensDto = await this.authService.registration(dto)
        return tokens
    }

    @Post('/login')
    async login(
        @Body() dto: ValidateUserDto,
    ): Promise<TokensDto> {
        const tokens: TokensDto = await this.authService.login(dto)
        return tokens
    }

    @Post('/refresh')
    @UseGuards(JwtRefreshGuard)
    async refresh(
        @Body() { refreshToken }: RefreshTokenDto,
        @CurrentUser() { id }: UserFromRequest
    ): Promise<TokensDto> {
        const user: User = await this.usersService.getUserById(id)
        const isRefreshTokenMatches: boolean = await this.authService.isRefreshTokenMatches(refreshToken, id)
        if (!isRefreshTokenMatches)
            throw new UnauthorizedException({ message: 'Wrong refresh token' })
        const tokens: TokensDto = await this.authService.generateTokens(user)
        if (!tokens)
            throw new UnauthorizedException({ message: 'Refresh server error' })
        return tokens
    }

    // @Post('/logout')
    // @ApiBearerAuth('jwt')
    // @UseGuards(JwtAuthGuard)
    // async logout(
    //     @CurrentUser() { id },
    //     @Res() res: Response
    // ): Promise<Response> {
    //     await this.authService.logout(id, res)
    //     return res.status(200)
    // }

}
