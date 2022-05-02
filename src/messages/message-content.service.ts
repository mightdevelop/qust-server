import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { CreateMessageContentDto } from './dto/create-message-content.dto'
import { DeleteMessageContentDto } from './dto/delete-message-content.dto'
import { UpdateMessageContentDto } from './dto/update-message-content.dto'
import { MessageContent } from './models/message-content.model'


@Injectable()
export class MessageContentService {

    constructor(
        @InjectModel(MessageContent) private messageContentRepository: typeof MessageContent
    ) {}

    async getContentById(contentId: number): Promise<MessageContent> {
        const content: MessageContent = await this.messageContentRepository.findByPk(contentId)
        return content
    }

    async getContentsByIds(contentsIds: { id: number }[]): Promise<MessageContent[]> {
        const contents: MessageContent[] = await this.messageContentRepository.findAll({
            where: { [Op.or]: contentsIds }
        })
        return contents
    }

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