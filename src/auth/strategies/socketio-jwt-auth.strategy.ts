import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserFromRequest } from 'src/auth/types/request-response'
import { TokenPayload } from 'src/auth/types/tokenPayload'
import { UsersService } from 'src/users/users.service'
import 'dotenv/config'

@Injectable()
export class SocketIoJwtAuthStrategy extends PassportStrategy(Strategy, 'socket.io-jwt') {
    constructor(
        private usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromUrlQueryParameter('access_token'),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
        })
    }
    async validate(payload: TokenPayload): Promise<UserFromRequest> {
        const user: UserFromRequest =
            await this.usersService.getUserById(payload.id)
        return user
    }
}