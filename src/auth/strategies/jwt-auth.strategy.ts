import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { accessConfig } from 'src/jwt-config'
import { UserFromRequest } from 'src/auth/types/request-response'
import { TokenPayload } from 'src/auth/types/tokenPayload'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromUrlQueryParameter('access_token'),
            ignoreExpiration: false,
            secretOrKey: accessConfig.secret,
        })
    }
    async validate(payload: TokenPayload): Promise<UserFromRequest> {
        const user: UserFromRequest =
            await this.usersService.getUserById(payload.id)
        return user
    }
}