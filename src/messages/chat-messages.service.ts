import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { SendChatMessageDto } from './dto/send-chat-message.dto'
import { MessageContentService } from './message-content.service'
// import { ChannelMessage } from './models/channel-message'
import { ChatMessage } from './models/chat-message'
import { MessageContent } from './models/message-content.model'
import { Message } from './models/messages.model'


@Injectable()
export class ChatMessagesService {

    constructor(
        private messageContentService: MessageContentService,
        @InjectModel(Message) private messageRepository: typeof Message,
        @InjectModel(ChatMessage) private chatMessageRepository: typeof ChatMessage,
        // @InjectModel(ChannelMessage) private channelMessageRepository: typeof ChannelMessage,
    ) {}

    async sendMessageToChat(dto: SendChatMessageDto): Promise<Message> {
        const content: MessageContent = await this.messageContentService.createMessageContent(dto.content)
        const message: Message = await this.messageRepository.create({
            ...dto,
            contentId: content.id,
            timestamp: Math.ceil(Date.now() / 1000),
        })
        await this.chatMessageRepository.create({
            messageId: message.id,
            chatId: dto.chatId
        })
        return message
    }

}