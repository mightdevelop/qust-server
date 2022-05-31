import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { isArray } from 'class-validator'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { GroupToResponse } from '../types/group-to-response.class'
import { groupsToResponse } from '../utils/groups-to-response.func'

export interface Response {
    group?: GroupToResponse
    groups?: GroupToResponse[]
}

@Injectable()
export class GroupModelInterceptor<T> implements NestInterceptor<T, Response> {
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<Response>> {
        return next.handle().pipe(map(data => {
            if (isArray(data)) {
                const groups = groupsToResponse(data)
                return { groups }
            }
            const group = groupsToResponse([ data ])[0]
            return { group }
        }))
    }
}