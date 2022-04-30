import { Column, DataType, Model, Table } from 'sequelize-typescript'
import { ChatType } from '../types/chat-type'

@Table({ tableName: 'chats' })
export class Chat extends Model<Chat> {

    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
        id: number

    @Column({ type: DataType.STRING, allowNull: false })
        name: string

    @Column({ type: DataType.STRING, allowNull: false })
        chatType: ChatType

}

