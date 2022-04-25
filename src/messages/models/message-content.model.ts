import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Message } from './messages.model'

@Table({ tableName: 'message-content' })
export class MessageContent extends Model {

    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
        id: number

    @Column({ type: DataType.STRING, allowNull: false })
        text: string

    @Column({ type: DataType.INTEGER, unique: true, allowNull: false })
    @ForeignKey(() => Message)
        messageId: string

}

