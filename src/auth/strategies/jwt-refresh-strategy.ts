import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { BadRequestException, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { UsersService } from 'src/users/users.service'
import { TokenPayload } from 'src/auth/types/tokenPayload'
import { refreshConfig } from 'src/jwt-config'
import { RequestResponseUser } from 'src/auth/types/request-response'
import { User } from 'src/users/models/users.model'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh-token'
) {
    constructor(
        private usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
            secretOrKey: refreshConfig.secret,
            passReqToCallback: true,
        })
    }

    async validate(req: Request, payload: TokenPayload): Promise<RequestResponseUser> {
        const refreshToken = req.body.refresh_token
        if (!refreshToken) {
            throw new BadRequestException({ message: 'Refresh token required' })
        }
        const user: User = await this.usersService.getUserById(payload.id)
        const { id, email, isAdmin, username }: RequestResponseUser = user
        return { id, email, isAdmin, username }
    }
}