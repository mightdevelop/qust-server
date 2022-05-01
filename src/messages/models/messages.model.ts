import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { User } from 'src/users/models/users.model'
import { MessageContent } from './message-content.model'

@Table({ tableName: 'messages' })
export class Message extends Model<Message> {

    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
        id: number

    @Column({ type: DataType.INTEGER, allowNull: false })
    @ForeignKey(() => User)
        userId: number

    @Column({ type: DataType.INTEGER, unique: true, allowNull: false })
    @ForeignKey(() => MessageContent)
        contentId: number

    @Column({ type: DataType.STRING, allowNull: false })
        username: string

    @Column({ type: DataType.DATE, allowNull: false })
        timestamp: number

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
        edited: boolean

}

