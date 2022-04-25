import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Message } from './models/messages.model'


@Injectable()
export class MessagesService {

    constructor(
        @InjectModel(Message) private messageRepository: typeof Message,
    ) {}



}