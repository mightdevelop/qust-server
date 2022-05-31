import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { LoggedActionToResponse } from '../types/logged-actions-to-response.class'
import { loggedActionsToResponse } from '../utils/logged-actions-to-response.func'

export interface Response {
    actions: LoggedActionToResponse[]
}

@Injectable()
export class LoggedActionModelInterceptor<T> implements NestInterceptor<T, Response> {
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<Response>> {
        return next.handle().pipe(map(data => ({ actions: loggedActionsToResponse(data) })))
    }
}