import { Body, Controller, Post, Res } from '@nestjs/common'
import { Response } from './types/request-response'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { AuthService } from './auth.service'
import { ValidateUserDto } from './dto/validate-user.dto'
import { Token } from './types/token'
import { UsersService } from 'src/users/users.service'


@Controller('/auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) {}

    @Post('/reg')
    async registration(
        @Body() dto: CreateUserDto,
        @Res() res: Response
    ): Promise<Response> {
        const token: Token = await this.authService.registration(dto)
        return res.send(token.accessToken).status(200)
    }

    @Post('/login')
    async login(
        @Body() dto: ValidateUserDto,
        @Res() res: Response
    ): Promise<Response> {
        const token: Token = await this.authService.login(dto)
        return res.send(token.accessToken).status(200)
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
