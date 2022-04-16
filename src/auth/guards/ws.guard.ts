import { CanActivate, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs'
import { UsersService } from 'src/users/users.service'
import { TokenPayload } from '../types/tokenPayload'


@Injectable()
export class WsJwtAuthGuard implements CanActivate {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    canActivate(
        context: any,
    ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
        const access_token = context.args[0].handshake.headers.authorization.split(' ')[1]
        try {
            const decoded: TokenPayload = this.jwtService.verify(access_token)
            return async (resolve, reject) => {
                const user = await this.usersService.getUserByUsername(decoded.username)
                if (user) {
                    resolve(user)
                } else {
                    reject(false)
                }
            }
        } catch (error) {
            throw new UnauthorizedException({ message: 'Unauthorized' })
        }
    }
}