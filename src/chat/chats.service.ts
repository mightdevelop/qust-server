import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { AuthService } from '../auth/auth.service'
import { CreateChatDto } from './dto/create-chat.dto'
import { CreateDialogueDto } from './dto/create-dialogue.dto'
import { UpdateChatDto } from './dto/update-chat.dto'
import { ChatUser } from './models/chat-user.model'
import { Chat } from './models/chats.model'
import { ChatType } from './types/chat-type'
// import { Socket } from 'socket.io'
// import { WsException } from '@nestjs/websockets'


@Injectable()
export class ChatsService {

    constructor(
        private authService: AuthService,
        @InjectModel(Chat) private chatRepository: typeof Chat,
        @InjectModel(ChatUser) private chatUserRepository: typeof ChatUser,
    ) {}

    async createChat(dto: CreateChatDto): Promise<Chat> {
        const chat: Chat = await this.chatRepository.create({
            name: dto.name, chatType: ChatType.chat
        })
        for (const chatterId in dto.chattersIds) {
            await this.chatUserRepository.create({
                chatId: chat.id,
                userId: chatterId
            })
        }
        return chat
    }

    async updateChat(dto: UpdateChatDto): Promise<Chat> {
        const chat: Chat = await this.chatRepository.findByPk(dto.id)
        if (!chat)
            throw new NotFoundException({ message: 'Chat not found' })
        await chat.update(dto)
        return chat
    }

    async deleteChat(chatId: number): Promise<Chat> {
        const chat: Chat = await this.chatRepository.findByPk(chatId)
        if (!chat)
            throw new NotFoundException({ message: 'Chat not found' })
        const chatUserColumns: ChatUser[] = await this.chatUserRepository.findAll({ where: { chatId } })
        for (const column of chatUserColumns) {
            await this.chatUserRepository.destroy({ where: { chatId: column.chatId } })
        }
        return chat
    }

    async createDialogue({ firstChatterId, secondChatterId }: CreateDialogueDto): Promise<Chat> {
        const chat: Chat = await this.chatRepository.create({
            name: `${firstChatterId} AND ${secondChatterId} DIALOGUE`, chatType: ChatType.dialogue
        })
        await this.chatUserRepository.create({
            chatId: chat.id,
            userId: firstChatterId
        })
        await this.chatUserRepository.create({
            chatId: chat.id,
            userId: secondChatterId
        })
        return chat
    }

    // async getUserFromSocket(socket: Socket) {
    //     const cookie = socket.handshake.headers.cookie
    //     const { Authentication: token } = parse(cookie)
    //     const user = await this.authService.getUserFromToken(token)
    //     if (!user)
    //         throw new WsException('Invalid credentials')
    //     return user
    // }

}