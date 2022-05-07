import { BadRequestException, CACHE_MANAGER, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compareSync, hashSync } from 'bcrypt'
import { UsersService } from 'src/users/users.service'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { User } from 'src/users/models/users.model'
import { ValidateUserDto } from './dto/validate-user.dto'
import { Tokens } from './types/tokens'
import { TokenPayload } from './types/tokenPayload'
import { accessConfig, refreshConfig } from 'src/jwt-config'
import { Cache } from 'cache-manager'


@Injectable()
export class AuthService {

    constructor(
        @Inject(CACHE_MANAGER) private cache: Cache,
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async registration(dto: CreateUserDto): Promise<Tokens> {
        const candidate: User = await this.usersService.getUserByEmail(dto.email)
        if (candidate) {
            throw new BadRequestException({ message: 'This email is already used' })
        }
        const hashPassword = hashSync(dto.password, 7)
        const user: User = await this.usersService.createUser({ ...dto, password: hashPassword })
        if (user) {
            const tokens: Tokens = await this.generateTokens(user)
            return tokens
        }
        throw new InternalServerErrorException({ message: 'Internal registration server error' })
    }

    async login(dto: ValidateUserDto): Promise<Tokens> {
        const user: User = await this.validateUser(dto)
        if (user) {
            const tokens: Tokens = await this.generateTokens(user)
            return tokens
        }
        throw new InternalServerErrorException({ message: 'Internal login server error' })
    }

    async generateTokens(user: User): Promise<Tokens> {
        const { id, username, isAdmin }: TokenPayload = user
        const iat: number = Math.ceil(Date.now() / 1000)
        const tokens: Tokens = {
            accessToken: this.jwtService.sign({
                id,
                username,
                isAdmin,
                iat,
                exp: iat + accessConfig.signOptions.expiresIn
            }, { secret: accessConfig.secret }),
            refreshToken: this.jwtService.sign({
                id,
                username,
                isAdmin,
                iat,
                exp: iat + refreshConfig.signOptions.expiresIn
            }, { secret: refreshConfig.secret }),
        }
        if (tokens) {
            await this.cache.set(`${user.id}`, tokens.refreshToken)
            return tokens
        }
        throw new InternalServerErrorException({ message: 'Internal generate tokens server error' })
    }

    async validateUser(dto: ValidateUserDto): Promise<User> {
        const user: User = await this.usersService.getUserByEmail(dto.email)
        if (!user)
            throw new UnauthorizedException({ message: 'Wrong email' })
        const passwordIsValid: boolean = compareSync(dto.password, user.password)
        if (user && passwordIsValid)
            return user
        throw new UnauthorizedException({ message: 'Wrong password' })
    }

    async isRefreshTokenMatches(
        refreshTokenFromRequest: string,
        userId: string
    ): Promise<boolean> {
        const refreshTokenFromStore = await this.cache.get(`${userId}`)
        return refreshTokenFromRequest === refreshTokenFromStore
    }

}