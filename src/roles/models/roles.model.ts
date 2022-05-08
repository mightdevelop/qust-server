import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from 'sequelize-typescript'
import { Group } from '../../groups/models/groups.model'
import { RoleUser } from './role-user.model'
import { CategoryRolePermissions } from 'src/categories/models/category-role-permissions.model'
import { TextChannelRolePermissions } from 'src/text-channels/models/text-channel-role-permissions.model'
import { User } from 'src/users/models/users.model'
import { RolePermissions } from 'src/permissions/models/role-permissions.model'

@Table({ tableName: 'roles' })
export class Role extends Model<Role> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'new role' })
        name: string

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: '#00e34c' })
        color: string

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Group)
        groupId: string

    @BelongsTo(() => Group)
        group: Group

    @BelongsToMany(() => User, () => RoleUser)
        users: User[]



    @HasMany(() => CategoryRolePermissions, { onDelete: 'cascade' })
        categoryPermissions: CategoryRolePermissions

    @HasMany(() => TextChannelRolePermissions, { onDelete: 'cascade' })
        channelPermissions: TextChannelRolePermissions

    @HasOne(() => RolePermissions, { onDelete: 'cascade' })
        permissions: RolePermissions

}

