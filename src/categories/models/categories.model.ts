import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript'
import { Group } from 'src/groups/models/groups.model'
import { TextChannel } from 'src/text-channels/models/text-channels.model'
import { CategoryRolePermissions } from './category-role-permissions.model'

@Table({ tableName: 'categories' })
export class Category extends Model<Category> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @Column({ type: DataType.STRING, allowNull: false })
        name: string

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Group)
        groupId: string

    @BelongsTo(() => Group, { onDelete: 'cascade' })
        group: Group

    @HasMany(() => TextChannel)
        channels: TextChannel[]

    @HasMany(() => CategoryRolePermissions)
        permissions: CategoryRolePermissions[]

}

