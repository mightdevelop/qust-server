import { ForbiddenException } from '@nestjs/common'
import { ChatUser } from '../models/chat-user.model'

export const isUserChatParticipantValidate = async (
    userId: number,
    chatId: number
): Promise<void> => {
    const isChatParticipant = !!await ChatUser.findOne({ where: {
        userId,
        chatId
    } })
    if (!isChatParticipant)
        throw new ForbiddenException({ message: 'You are not a chat participant' })
}