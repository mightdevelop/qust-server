import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Group } from 'src/groups/models/groups.model'
import { Message } from 'src/messages/models/messages.model'
import { TextChannel } from 'src/text-channels/models/text-channels.model'
import { User } from 'src/users/models/users.model'

@Table({ tableName: 'mentions' })
export class Mention extends Model<Mention> {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => User)
        userId: string

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Message)
        messageId: string

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => TextChannel)
        textChannelId: string

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Group)
        groupId: string

    @ApiPropertyOptional({ type: User })
    @BelongsTo(() => User)
        user: User

    @ApiPropertyOptional({ type: Message })
    @BelongsTo(() => Message)
        message: Message

    @ApiPropertyOptional({ type: Group })
    @BelongsTo(() => Group)
        textChannel: Group

    @ApiPropertyOptional({ type: TextChannel })
    @BelongsTo(() => TextChannel)
        group: TextChannel

}

