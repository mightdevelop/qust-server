import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { User } from 'src/users/models/users.model'
import { Chat } from './chats.model'

@Table({ tableName: 'chat-user' })
export class ChatUser extends Model<ChatUser> {

    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
        id: number

    @Column({ type: DataType.INTEGER, allowNull: false })
    @ForeignKey(() => User)
        userId: number

    @Column({ type: DataType.INTEGER, allowNull: false })
    @ForeignKey(() => Chat)
        chatId: number

}

