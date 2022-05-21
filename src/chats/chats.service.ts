import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CreateChatDto } from './dto/create-chat.dto'
import { CreateDialogueDto } from './dto/create-dialogue.dto'
import { AddUsersToChatDto, } from './dto/add-users-to-chat.dto'
import { UpdateChatDto } from './dto/update-chat.dto'
import { ChatUser } from './models/chat-user.model'
import { Chat } from './models/chats.model'
import { ChatType } from './types/chat-type'
import { Message } from 'src/messages/models/messages.model'
import { Op } from 'sequelize'
import { LeaveFromChatDto } from './dto/leave-from-chat.dto'


@Injectable()
export class ChatsService {

    constructor(
        @InjectModel(Chat) private chatRepository: typeof Chat,
        @InjectModel(ChatUser) private chatUserRepository: typeof ChatUser,
    ) {}

    async getChatById(chatId: string): Promise<Chat> {
        const chat: Chat = await this.chatRepository.findByPk(chatId)
        return chat
    }

    async getMessagesFromChat(chatId: string): Promise<Message[]> {
        const chat: Chat = await this.chatRepository.findByPk(chatId, { include: Message })
        return chat.messages
    }

    async getChatsByUserId(userId: string): Promise<Chat[]> {
        const chatsIds: { id: string }[] = (await this.getChatsIdsByUserId(userId)).map(id => ({ id }))
        const chats: Chat[] = await this.chatRepository.findAll({ where: { [Op.or]: chatsIds } })
        return chats
    }

    async getChatsIdsByUserId(userId: string): Promise<string[]> {
        const chatUserRows: ChatUser[] = await this.chatUserRepository.findAll({ where: { userId } })
        const chatsIds: string[] = chatUserRows.map(row => row.chatId)
        return chatsIds
    }

    async isUserChatParticipant (
        userId: string,
        chatId: string
    ): Promise<boolean> {
        const isChatParticipant = !!await this.chatUserRepository.findOne({ where: {
            userId,
            chatId
        } })
        return isChatParticipant
    }

    async createChat(dto: CreateChatDto): Promise<Chat> {
        const chat: Chat = await this.chatRepository.create({
            name: dto.name, chatType: ChatType.chat
        })
        const arrayToCreateChatUserRows: {
            chatId: string,
            userId: string
        }[] = dto.chattersIds.map(chatterId => ({
            chatId: chat.id,
            userId: chatterId
        }))
        await this.chatUserRepository.bulkCreate(arrayToCreateChatUserRows, { validate: true })
        return chat
    }

    async updateChat(dto: UpdateChatDto): Promise<Chat> {
        const chat: Chat = await this.chatRepository.findOne({
            where: { id: dto.chatId, chatType: ChatType.chat }
        })
        if (!chat)
            throw new NotFoundException({ message: 'Chat not found' })
        await chat.update(dto)
        return chat
    }

    async deleteChat(chat: Chat): Promise<Chat> {
        chat.destroy()
        return chat
    }

    async createDialogue({ firstChatterId, secondChatterId }: CreateDialogueDto): Promise<Chat> {
        const chat: Chat = await this.chatRepository.create({
            name: `${firstChatterId} AND ${secondChatterId} DIALOGUE`, chatType: ChatType.dialogue
        })
        await this.chatUserRepository.create([
            { chatId: chat.id, userId: firstChatterId },
            { chatId: chat.id, userId: secondChatterId }
        ])
        return chat
    }

    async addUsersToChat(dto: AddUsersToChatDto): Promise<Chat> {
        const chat: Chat = await this.chatRepository.findOne({
            where: { id: dto.chatId, chatType: ChatType.chat }
        })
        if (!chat)
            throw new NotFoundException({ message: 'Chat not found' })
        const arrayToCreateChatUserRows: {
            chatId: string,
            userId: string
        }[] = dto.chattersIds.map(chatterId => ({
            chatId: chat.id,
            userId: chatterId
        }))
        await this.chatUserRepository.bulkCreate(arrayToCreateChatUserRows, { validate: true })
        return chat
    }

    async leaveFromChat({ userId, chatId }: LeaveFromChatDto): Promise<Chat> {
        const chat: Chat = await this.chatRepository.findOne({
            where: { id: chatId, chatType: ChatType.chat }
        })
        if (!chat)
            throw new NotFoundException({ message: 'Chat not found' })
        await this.chatUserRepository.destroy({ where: { userId } })
        return chat
    }

}