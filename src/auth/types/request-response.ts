import { Request as ExpressRequest, Response as ExpressResponse } from 'express'

export interface Request extends ExpressRequest {
    user: RequestResponseUser
}

export interface Response extends ExpressResponse {
    user: RequestResponseUser
}

export interface RequestResponseUser {
    id: number
    email: string
    username: string
    isAdmin: boolean
}