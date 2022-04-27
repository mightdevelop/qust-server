import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { SendMessageDto } from './dto/send-message.dto'
import { Message } from './models/messages.model'


@Injectable()
export class MessagesService {

    constructor(
        @InjectModel(Message) private messageRepository: typeof Message,
    ) {}

    async sendMessage(dto: SendMessageDto): Promise<Message> {
        const message: Message = await this.messageRepository.create({
            ...dto,
            timestamp: Math.ceil(Date.now() / 1000),
        })
        return message
    }

}