import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CreateChatDto } from './dto/create-chat.dto'
import { CreateDialogueDto } from './dto/create-dialogue.dto'
import { AddUsersToChatDto, } from './dto/add-users-to-chat.dto'
import { UpdateChatDto } from './dto/update-chat.dto'
import { ChatUser } from './models/chat-user.model'
import { Chat } from './models/chats.model'
import { ChatType } from './types/chat-type'
import { Op } from 'sequelize'
import { LeaveFromChatDto } from './dto/leave-from-chat.dto'
import { User } from 'src/users/models/users.model'
import { UsersService } from 'src/users/users.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InternalChatsCudEvent } from './events/internal-chats.CUD.event'
import { InternalChatUsersCudEvent } from './events/internal-text-channel-users.CUD.event'


@Injectable()
export class ChatsService {

    constructor(
        private usersService: UsersService,
        private eventEmitter: EventEmitter2,
        @InjectModel(Chat) private chatRepository: typeof Chat,
        @InjectModel(ChatUser) private chatUserRepository: typeof ChatUser,
    ) {}

    async getChatById(chatId: string): Promise<Chat> {
        const chat: Chat = await this.chatRepository.findByPk(chatId)
        return chat
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
        await this.chatUserRepository.bulkCreate(dto.chattersIds.map(chatterId => ({
            chatId: chat.id,
            userId: chatterId
        })), { validate: true })
        const chatters: User[] = await this.usersService.getChattersByChatId(chat.id)
        chat.chatters = chatters
        this.eventEmitter.emit(
            'internal-chats.created',
            new InternalChatsCudEvent({ chat, action: 'create' })
        )
        return chat
    }

    async updateChat({ chat, name }: UpdateChatDto): Promise<Chat> {
        chat.name = name
        await chat.save()
        this.eventEmitter.emit(
            'internal-chats.updated',
            new InternalChatsCudEvent({ chat, action: 'update' })
        )
        return chat
    }

    async deleteChat(chat: Chat): Promise<Chat> {
        await chat.destroy()
        this.eventEmitter.emit(
            'internal-chats.deleted',
            new InternalChatsCudEvent({ chat, action: 'delete' })
        )
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
        await this.chatUserRepository.bulkCreate(dto.chattersIds.map(chatterId => ({
            chatId: chat.id,
            userId: chatterId
        })), { validate: true })
        this.eventEmitter.emit(
            'internal-chat-users.created',
            new InternalChatUsersCudEvent({
                chatId: dto.chatId,
                usersIds: dto.chattersIds,
                action: 'create'
            })
        )
        return chat
    }

    async leaveFromChat({ userId, chatId }: LeaveFromChatDto): Promise<Chat> {
        const chat: Chat = await this.chatRepository.findOne({
            where: { id: chatId, chatType: ChatType.chat }
        })
        if (!chat)
            throw new NotFoundException({ message: 'Chat not found' })
        await this.chatUserRepository.destroy({ where: { userId } })
        this.eventEmitter.emit(
            'internal-chat-users.deleted',
            new InternalChatUsersCudEvent({
                chatId,
                usersIds: [ userId ],
                action: 'delete'
            })
        )
        return chat
    }

}