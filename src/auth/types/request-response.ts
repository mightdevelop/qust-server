import { Request as ExpressRequest, Response as ExpressResponse } from 'express'

export interface Request extends ExpressRequest {
    user: RequestResponseUser
}

export interface Response extends ExpressResponse {
    user: RequestResponseUser
}

export type RequestResponseUser = {
    id: string
    email: string
    username: string
    isAdmin: boolean
}