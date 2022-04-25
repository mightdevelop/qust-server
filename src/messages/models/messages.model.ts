import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Chat } from 'src/chat/models/chats.model'
import { User } from 'src/users/models/users.model'

@Table({ tableName: 'messages' })
export class Message extends Model {

    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
        id: number

    @Column({ type: DataType.INTEGER, allowNull: false })
    @ForeignKey(() => User)
        userId: number

    @Column({ type: DataType.INTEGER, allowNull: false })
    @ForeignKey(() => Chat)
        chatId: number

    @Column({ type: DataType.STRING, allowNull: false })
        username: string

    @Column({ type: DataType.DATE, allowNull: false })
        timestamp: number

    // @BelongsTo(() => MessageContent)
    //     content: string

}

