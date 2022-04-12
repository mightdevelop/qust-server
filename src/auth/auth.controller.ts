import { Body, Controller, Post } from '@nestjs/common'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { AuthService } from './auth.service'
import { ValidateUserDto } from './dto/validate-user.dto'
import { Token } from './types/token'


@Controller()
export class AuthController {

    constructor(
        private authService: AuthService
    ) {}

    @Post()
    async registration(
        @Body() dto: CreateUserDto
    ): Promise<Token> {
        const token: Token = await this.authService.registration(dto)
        return token
    }

    @Post()
    async login(
        @Body() dto: ValidateUserDto
    ): Promise<Token> {
        const token: Token = await this.authService.login(dto)
        return token
    }
}

