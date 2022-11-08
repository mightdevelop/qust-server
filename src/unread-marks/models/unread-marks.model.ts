import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Message } from 'src/messages/models/messages.model'
import { User } from 'src/users/models/users.model'
import { MessageLocation } from '../types/message-location'

@Table({ tableName: 'unread-marks' })
export class UnreadMark extends Model<UnreadMark> {

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

    @ApiPropertyOptional({ type: User })
    @BelongsTo(() => User)
        user: User

    @ApiPropertyOptional({ type: Message })
    @BelongsTo(() => Message)
        message: Message

    @ApiProperty({ type: MessageLocation })
    @Column({ type: DataType.JSON, allowNull: false })
        messageLocation: MessageLocation

}