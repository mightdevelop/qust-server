import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { Includeable } from 'sequelize/types'
import { TextChannelsService } from 'src/text-channels/text-channels.service'
import { MessageIdAndTextChannelIdDto } from './dto/message-id-and-text-channel-id.dto'
import { SendTextChannelMessageDto } from './dto/send-text-channel-message.dto'
import { InternalTextChannelsMessageSentEvent } from './events/internal-text-channels.message-sent.event'
import { MessagesService } from './messages.service'
import { Message } from './models/messages.model'
import { TextChannelMessage } from './models/text-channel-message.model'


@Injectable()
export class TextChannelMessageService {

    constructor(
        @Inject(forwardRef(() => MessagesService)) private messageService: MessagesService,
        private eventEmitter: EventEmitter2,
        private textChannelsService: TextChannelsService,
        @InjectModel(TextChannelMessage) private textChannelMessageRepository: typeof TextChannelMessage,
    ) {}

    async getTextChannelMessageRow(messageId: string): Promise<TextChannelMessage> {
        const row: TextChannelMessage =
            await this.textChannelMessageRepository.findOne({ where: { messageId } })
        return row
    }

    async getMessagesFromTextChannel(
        channelId: string,
        include?: Includeable | Includeable[],
        limit?: number,
        offset?: number,
    ): Promise<Message[]> {
        const messagesIds: string[] =
            (await this.textChannelMessageRepository.findAll({ where: { channelId } }))
                .map(row => row.messageId)
        const messages: Message[] =
            await this.messageService.getMessagesByIds(messagesIds, include, limit, offset)
        return messages
    }

    async getNextMessageInTextChannel(dto: MessageIdAndTextChannelIdDto): Promise<Message> {
        const channelMessageRow: TextChannelMessage =
            await this.textChannelMessageRepository.findOne({ where: { ...dto } })
        const nextChannelMessageRow: TextChannelMessage =
            await this.textChannelMessageRepository.findOne({ where: {
                channelId: channelMessageRow.channelId,
                createdAt: { [Op.gt]: channelMessageRow.createdAt }
            } })
        return await this.messageService.getMessageById(nextChannelMessageRow.messageId)
    }

    async sendMessageToTextChannel(dto: SendTextChannelMessageDto): Promise<Message> {
        const message: Message = await this.messageService.createMessage({ ...dto, location: {
            textChannelId: dto.channelId,
            groupId: await this.textChannelsService.getGroupIdByTextChannelId(dto.channelId)
        } })
        await this.textChannelMessageRepository.create({ messageId: message.id, channelId: dto.channelId })
        this.eventEmitter.emit(
            'internal-text-channels.message-sent',
            new InternalTextChannelsMessageSentEvent({
                message,
                channelId: dto.channelId,
            })
        )
        return message
    }

}