import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript'
import { Category } from 'src/categories/models/categories.model'
import { Mention } from 'src/mentions/models/mentions.model'
import { Message } from 'src/messages/models/messages.model'
import { TextChannelMessage } from 'src/messages/models/text-channel-message.model'
import { TextChannelRolePermissions } from './text-channel-role-permissions.model'

@Table({ tableName: 'text-channels' })
export class TextChannel extends Model<TextChannel> {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: false })
        name: string

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Category)
        categoryId: string

    @ApiPropertyOptional({ type: Category })
    @BelongsTo(() => Category)
        category: Category

    @ApiPropertyOptional({ type: [ TextChannelRolePermissions ] })
    @HasMany(() => TextChannelRolePermissions)
        permissions: TextChannelRolePermissions[]

    @ApiPropertyOptional({ type: [ Message ] })
    @BelongsToMany(() => Message, () => TextChannelMessage)
        messages: Message[]

    @ApiPropertyOptional({ type: [ Mention ] })
    @HasMany(() => Mention, { onDelete: 'cascade' })
        mentions: Mention[]

}

