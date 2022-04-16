export const accessConfig = {
    secret: 'secret',
    signOptions: {
        expiresIn: 60,
    }
}
export const refreshConfig = {
    secret: 'secret',
    signOptions: {
        expiresIn: 2592000, // 30 days
    }
}