import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare, hash } from 'bcrypt'
import { UsersService } from 'src/users/users.service'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { User } from 'src/users/models/users.model'
import { ValidateUserDto } from './dto/validate-user.dto'
import { Token } from './types/token'
import { TokenPayload } from './types/tokenPayload'


@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async registration(dto: CreateUserDto): Promise<Token> {
        const candidate: User = await this.usersService.getUserByEmail(dto.email)
        if (candidate) {
            throw new BadRequestException({ message: 'This email is already used' })
        }
        const hashPassword = await hash(dto.password, 7)
        const user: User = await this.usersService.createUser({ ...dto, password: hashPassword })
        if (user) {
            return await this.generateToken(user)
        }
        throw new InternalServerErrorException({ message: 'Internal registration server error' })
    }

    async login(dto: ValidateUserDto): Promise<Token> {
        const user: User = await this.validateUser(dto)
        if (user) {
            const token: Token = await this.generateToken(user)
            return token
        }
        throw new InternalServerErrorException({ message: 'Internal login server error' })
    }

    // async getUserFromToken(token: Token): Promise<User> {
    //     const { id }: TokenPayload = this.jwtService.verify(token.access_token)
    //     const user: User = await this.usersService.getUserById(id)
    //     return user
    // }

    async generateToken(user: User): Promise<Token> {
        const payload: TokenPayload = user
        const token: Token = {
            access_token: this.jwtService.sign(payload),
        }
        if (token)
            return token
        throw new InternalServerErrorException({ message: 'Internal generate token server error' })
    }

    async validateUser(dto: ValidateUserDto): Promise<User> {
        const user: User = await this.usersService.getUserByEmail(dto.email)
        if (!user)
            throw new UnauthorizedException({ message: 'Wrong email' })
        const passwordIsValid = await compare(dto.password, user.password)
        if (user && passwordIsValid)
            return user
        throw new UnauthorizedException({ message: 'Wrong password' })
    }

}