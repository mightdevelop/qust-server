import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript'
import { Category } from 'src/categories/models/categories.model'
import { Mention } from 'src/mentions/models/mentions.model'
import { Message } from 'src/messages/models/messages.model'
import { TextChannelMessage } from 'src/messages/models/text-channel-message.model'
import { TextChannelRolePermissions } from './text-channel-role-permissions.model'

@Table({ tableName: 'text-channels' })
export class TextChannel extends Model<TextChannel> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @Column({ type: DataType.STRING, allowNull: false })
        name: string

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Category)
        categoryId: string

    @BelongsTo(() => Category)
        category: Category

    @HasMany(() => TextChannelRolePermissions)
        permissions: TextChannelRolePermissions[]

    @BelongsToMany(() => Message, () => TextChannelMessage)
        messages: Message[]

    @HasMany(() => Mention, { onDelete: 'cascade' })
        mentions: Mention[]

}

