import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript'
import { ChatMessage } from 'src/messages/models/chat-message.model'
import { Message } from 'src/messages/models/messages.model'
import { User } from 'src/users/models/users.model'
import { enumToArrayOfIndexes } from 'src/utils/enum-to-array-of-indexes'
import { ChatType } from '../types/chat-type'
import { ChatUser } from './chat-user.model'

@Table({ tableName: 'chats' })
export class Chat extends Model<Chat> {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: false })
        name: string

    @ApiProperty({ enum: enumToArrayOfIndexes(ChatType) })
    @Column({ type: DataType.SMALLINT, allowNull: false })
        chatType: ChatType

    @ApiPropertyOptional({ type: [ Message ] })
    @BelongsToMany(() => Message, () => ChatMessage)
        messages: Message[]

    @ApiPropertyOptional({ type: [ User ] })
    @BelongsToMany(() => User, () => ChatUser)
        chatters: User[]

}

