import { ChatUser } from '../models/chat-user.model'

export const isUserChatParticipant = async (
    userId: number,
    chatId: number
): Promise<boolean> => {
    const isChatParticipant = !!await ChatUser.findOne({ where: {
        userId,
        chatId
    } })
    return isChatParticipant
}