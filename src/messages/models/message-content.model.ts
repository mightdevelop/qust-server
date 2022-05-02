import { Column, DataType, HasOne, Model, Table } from 'sequelize-typescript'
import { Message } from './messages.model'

@Table({ tableName: 'message-content' })
export class MessageContent extends Model<MessageContent> {

    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
        id: number

    @Column({ type: DataType.STRING, allowNull: true })
        text: string

    @HasOne(() => Message)
        message: Message

}

