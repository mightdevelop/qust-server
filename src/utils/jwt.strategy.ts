import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { accessConfig } from '../jwt-config'
import { RequestResponseUser } from 'src/auth/types/request-response'
import { TokenPayload } from 'src/auth/types/tokenPayload'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: accessConfig.secret,
        })
    }
    async validate(payload: TokenPayload): Promise<RequestResponseUser> {
        const { id, username, email, isAdmin }: RequestResponseUser =
            await this.usersService.getUserById(payload.id)
        return { id, username, email, isAdmin }
    }
}