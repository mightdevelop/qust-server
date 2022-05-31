import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { isArray } from 'class-validator'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { UserToResponse } from '../types/user-to-response.class'
import { usersToResponse } from '../utils/users-to-response'

export interface Response {
    user?: UserToResponse
    users?: UserToResponse[]
}

@Injectable()
export class UserModelInterceptor<T> implements NestInterceptor<T, Response> {
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<Response>> {
        return next.handle().pipe(map(data => {
            if (isArray(data)) {
                const users = usersToResponse(data)
                return { users }
            }
            const user = usersToResponse([ data ])[0]
            return { user }
        }))
    }
}