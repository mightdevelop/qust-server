import { ForbiddenException, NotFoundException } from '@nestjs/common'

export const messageAuthorValidate = (messageAuthorId: number, userId: number) => {
    if (!messageAuthorId)
        throw new NotFoundException({ message: 'Message not found' })
    if (messageAuthorId !== userId)
        throw new ForbiddenException({ message: 'You have no access' })
}