import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { MessagesService } from './messages.service'
import { MessageContent } from './models/message-content.model'
import { Message } from './models/messages.model'


@Module({
    imports: [
        SequelizeModule.forFeature([ Message, MessageContent ]),
    ],
    exports: [ MessagesService ],
    providers: [ MessagesService ],
})
export class MessagesModule {}
