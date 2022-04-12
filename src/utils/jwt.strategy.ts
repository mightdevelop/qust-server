import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { TokenPayload } from 'src/auth/types/tokenPayload'
import { jwtSecret } from './const'


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        })
    }
    async validate({ id, username, email, isAdmin }: TokenPayload) {
        return { id, username, email, isAdmin }
    }
}