import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CreateMessageContentDto } from './dto/create-message-content.dto'
import { DeleteMessageContentDto } from './dto/delete-message-content.dto'
import { UpdateMessageContentDto } from './dto/update-message-content.dto'
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

    async updateMessageContent(dto: UpdateMessageContentDto): Promise<MessageContent> {
        const content: MessageContent = await this.messageContentRepository.findByPk(dto.messageContentId)
        await content.update({ text: dto.text })
        return content
    }

    async deleteMessageContent(dto: DeleteMessageContentDto): Promise<MessageContent> {
        const content: MessageContent = await this.messageContentRepository.findByPk(dto.messageContentId)
        await content.destroy()
        return content
    }

}