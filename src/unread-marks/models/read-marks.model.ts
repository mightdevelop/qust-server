import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Message } from 'src/messages/models/messages.model'
import { User } from 'src/users/models/users.model'
import { MessageLocation } from '../types/message-location'

@Table({ tableName: 'unread-marks' })
export class UnreadMark extends Model<UnreadMark> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => User)
        userId: string

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Message)
        messageId: string

    @BelongsTo(() => User)
        user: User

    @BelongsTo(() => Message)
        message: Message

    @Column({ type: DataType.JSON, allowNull: false })
        messageLocation: MessageLocation

}