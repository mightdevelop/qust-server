import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { User } from 'src/users/models/users.model'
import { Chat } from './chats.model'

@Table({ tableName: 'chat-user' })
export class ChatUser extends Model<ChatUser> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: number

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => User)
        userId: number

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Chat)
        chatId: number

}

