import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { TextChannel } from 'src/text-channels/models/text-channels.model'
import { Message } from './messages.model'

@Table({ tableName: 'text-channel-message' })
export class TextChannelMessage extends Model<TextChannelMessage> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Message)
        messageId: string

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => TextChannel)
        channelId: string

}