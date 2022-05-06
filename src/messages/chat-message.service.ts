import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { SendChatMessageDto } from './dto/send-chat-message.dto'
import { MessagesService } from './messages.service'
import { ChatMessage } from './models/chat-message'
import { Message } from './models/messages.model'


@Injectable()
export class ChatMessageService {

    constructor(
        private messageService: MessagesService,
        @InjectModel(ChatMessage) private chatMessageRepository: typeof ChatMessage,
    ) {}

    async getChatMessageColumn(messageId: number): Promise<ChatMessage> {
        const column: ChatMessage = await this.chatMessageRepository.findOne({ where: { messageId } })
        return column
    }

    async sendMessageToChat(dto: SendChatMessageDto): Promise<Message> {
        const message: Message = await this.messageService.createMessage({ ...dto })
        await this.chatMessageRepository.create({ messageId: message.id, chatId: dto.chatId })
        return message
    }

}