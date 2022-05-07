import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Message } from './messages.model'

@Table({ tableName: 'message-content' })
export class MessageContent extends Model<MessageContent> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @Column({ type: DataType.STRING, allowNull: true })
        text: string

    @BelongsTo(() => Message, { onDelete: 'cascade' })
        message: Message

    @Column({ type: DataType.UUID, unique: true, allowNull: false })
    @ForeignKey(() => Message)
        messageId: string

}

