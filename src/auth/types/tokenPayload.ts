export type TokenPayload = {
    id: number
    username: string
    isAdmin: boolean
    iat?: number
    exp?: number
}