import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Group } from 'src/groups/models/groups.model'
import { Message } from 'src/messages/models/messages.model'
import { TextChannel } from 'src/text-channels/models/text-channels.model'
import { User } from 'src/users/models/users.model'

@Table({ tableName: 'mentions' })
export class Mention extends Model<Mention> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => User)
        userId: string

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Message)
        messageId: string

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => TextChannel)
        textChannelId: string

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Group)
        groupId: string

    @BelongsTo(() => User)
        user: User

    @BelongsTo(() => Message)
        message: Message

}

