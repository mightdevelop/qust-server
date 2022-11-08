import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Message } from './messages.model'

@Table({ tableName: 'message-content' })
export class MessageContent extends Model<MessageContent> {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: true })
        text: string

    @ApiPropertyOptional({ type: Message })
    @BelongsTo(() => Message, { onDelete: 'cascade' })
        message: Message

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, unique: true, allowNull: false })
    @ForeignKey(() => Message)
        messageId: string

}

