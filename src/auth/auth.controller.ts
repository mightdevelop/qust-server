import { Body, Controller, Post, Res, UnauthorizedException, UseGuards } from '@nestjs/common'
import { UserFromRequest, Response } from './types/request-response'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { AuthService } from './auth.service'
import { ValidateUserDto } from './dto/validate-user.dto'
import { UsersService } from 'src/users/users.service'
import { JwtRefreshGuard } from './guards/jwt-refresh.guard'
import { Tokens } from './types/tokens'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { User } from 'src/users/models/users.model'


@Controller('/auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) {}

    @Post('/registration')
    async registration(
        @Body() dto: CreateUserDto,
        @Res() res: Response
    ): Promise<Response> {
        const tokens: Tokens = await this.authService.registration(dto)
        return res.send(tokens).status(200)
    }

    @Post('/login')
    async login(
        @Body() dto: ValidateUserDto,
        @Res() res: Response
    ): Promise<Response> {
        const tokens: Tokens = await this.authService.login(dto)
        return res.send(tokens).status(200)
    }

    @Post('/refresh')
    @UseGuards(JwtRefreshGuard)
    async refresh(
        @Body('refresh_token') refreshToken: string,
        @CurrentUser() { id }: UserFromRequest
    ): Promise<Tokens> {
        const user: User = await this.usersService.getUserById(id)
        const isRefreshTokenMatches: boolean = await this.authService.isRefreshTokenMatches(refreshToken, id)
        if (!isRefreshTokenMatches)
            throw new UnauthorizedException({ message: 'Wrong refresh token' })
        const tokens: Tokens = await this.authService.generateTokens(user)
        if (!tokens)
            throw new UnauthorizedException({ message: 'Refresh server error' })
        return tokens
    }

    // @Post('/logout')
    // async logout(
    //     @CurrentUser() { id },
    //     @Res() res: Response
    // ): Promise<Response> {
    //     await this.authService.logout(id, res)
    //     return res.status(200)
    // }

}
