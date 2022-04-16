import { createParamDecorator } from '@nestjs/common'
import { RequestResponseUser } from 'src/auth/types/request-response'

export const CurrentUser = createParamDecorator(
    (data, req): RequestResponseUser => req.user,
)