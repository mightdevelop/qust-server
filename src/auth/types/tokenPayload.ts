export type TokenPayload = {
    id: string
    username: string
    isAdmin: boolean
    isInvis?: boolean
    iat?: number
    exp?: number
}