import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from 'sequelize-typescript'
import { Mention } from 'src/mentions/models/mentions.model'
import { MessageLocation } from 'src/unread-marks/types/message-location'
import { User } from 'src/users/models/users.model'
import { MessageContent } from './message-content.model'

@Table({ tableName: 'messages' })
export class Message extends Model<Message> {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => User)
        userId: string

    @ApiPropertyOptional({ type: MessageContent })
    @HasOne(() => MessageContent, { onDelete: 'cascade' })
        content: MessageContent

    @ApiProperty({ type: Boolean })
    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
        edited: boolean

    @ApiPropertyOptional({ type: [ Mention ] })
    @HasMany(() => Mention)
        mentions: Mention[]

    @ApiProperty({ type: MessageLocation })
    @Column({ type: DataType.JSON, allowNull: false })
        messageLocation: MessageLocation

}

