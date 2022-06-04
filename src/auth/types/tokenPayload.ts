export type TokenPayload = {
    id: string
    username: string
    isAdmin: boolean
    iat?: number
    exp?: number
}