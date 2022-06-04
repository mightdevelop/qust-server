import { Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from 'sequelize-typescript'
import { Mention } from 'src/mentions/models/mentions.model'
import { MessageLocation } from 'src/unread-marks/types/message-location'
import { User } from 'src/users/models/users.model'
import { MessageContent } from './message-content.model'

@Table({ tableName: 'messages' })
export class Message extends Model<Message> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => User)
        userId: string

    @HasOne(() => MessageContent, { onDelete: 'cascade' })
        content: MessageContent

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
        edited: boolean

    @HasMany(() => Mention)
        mentions: Mention[]

    @Column({ type: DataType.JSON, allowNull: false })
        messageLocation: MessageLocation

}

