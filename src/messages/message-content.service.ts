import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CreateMessageContentDto } from './dto/send-chat-message.dto copy'
import { MessageContent } from './models/message-content.model'


@Injectable()
export class MessageContentService {

    constructor(
        @InjectModel(MessageContent) private messageContentRepository: typeof MessageContent
    ) {}

    async createMessageContent(dto: CreateMessageContentDto): Promise<MessageContent> {
        const content: MessageContent = await this.messageContentRepository.create(dto)
        return content
    }

}