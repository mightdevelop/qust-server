import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript'
import { ChatMessage } from 'src/messages/models/chat-message'
import { Message } from 'src/messages/models/messages.model'
import { User } from 'src/users/models/users.model'
import { ChatType } from '../types/chat-type'
import { ChatUser } from './chat-user.model'

@Table({ tableName: 'chats' })
export class Chat extends Model<Chat> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: number

    @Column({ type: DataType.STRING, allowNull: false })
        name: string

    @Column({ type: DataType.STRING, allowNull: false })
        chatType: ChatType

    @BelongsToMany(() => Message, () => ChatMessage)
        messages: Message[]

    @BelongsToMany(() => User, () => ChatUser)
        chatters: User[]

}

