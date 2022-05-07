import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript'
import { Category } from 'src/categories/models/categories.model'
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

}

