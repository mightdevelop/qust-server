import { Request as ExpressRequest, Response as ExpressResponse } from 'express'

export interface Request extends ExpressRequest {
    user: UserFromRequest
}

export interface Response extends ExpressResponse {
    user: UserFromRequest
}

export type UserFromRequest = {
    id: string
    email: string
    username: string
    isAdmin: boolean
}