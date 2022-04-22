import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
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
        context: ExecutionContext,
    ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
        const accessToken: string = context.switchToHttp().getRequest().headers.authorization.split(' ')[1]
        try {
            const payload: TokenPayload = this.jwtService.verify(accessToken)
            return async (resolve, reject) => {
                const user = await this.usersService.getUserByUsername(payload.username)
                if (user) {
                    resolve(user)
                } else {
                    reject(false)
                }
            }
        } catch {
            throw new UnauthorizedException({ message: 'Unauthorized' })
        }
    }
}