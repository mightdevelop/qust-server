import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Chat } from 'src/chats/models/chats.model'
import { Message } from './messages.model'

@Table({ tableName: 'chat-message' })
export class ChatMessage extends Model<ChatMessage> {

    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
        id: number

    @Column({ type: DataType.INTEGER, allowNull: false })
    @ForeignKey(() => Message)
        messageId: number

    @Column({ type: DataType.INTEGER, allowNull: false })
    @ForeignKey(() => Chat)
        chatId: number

}

