import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { SendTextChannelMessageDto } from './dto/send-text-channel-message.dto'
import { MessagesService } from './messages.service'
import { Message } from './models/messages.model'
import { TextChannelMessage } from './models/text-channel-message.model'


@Injectable()
export class TextChannelMessageService {

    constructor(
        private messageService: MessagesService,
        @InjectModel(TextChannelMessage) private textChannelMessageRepository: typeof TextChannelMessage,
    ) {}

    async getTextChannelMessageRow(messageId: string): Promise<TextChannelMessage> {
        const row: TextChannelMessage =
            await this.textChannelMessageRepository.findOne({ where: { messageId } })
        return row
    }

    async sendMessageToTextChannel(dto: SendTextChannelMessageDto): Promise<Message> {
        const message: Message = await this.messageService.createMessage({ ...dto })
        await this.textChannelMessageRepository.create({ messageId: message.id, channelId: dto.channelId })
        return message
    }

}