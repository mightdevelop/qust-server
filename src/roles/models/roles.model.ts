import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from 'sequelize-typescript'
import { Group } from '../../groups/models/groups.model'
import { RoleUser } from './role-user.model'
import { CategoryRolePermissions } from 'src/categories/models/category-role-permissions.model'
import { TextChannelRolePermissions } from 'src/text-channels/models/text-channel-role-permissions.model'
import { User } from 'src/users/models/users.model'
import { RolePermissions } from 'src/permissions/models/role-permissions.model'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

@Table({ tableName: 'roles' })
export class Role extends Model<Role> {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'new role' })
        name: string

    @ApiProperty({ type: String, format: 'hex' })
    @Column({ type: DataType.STRING, allowNull: false, defaultValue: '#00e34c' })
        color: string

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Group)
        groupId: string

    @ApiPropertyOptional({ type: Group })
    @BelongsTo(() => Group)
        group: Group

    @ApiPropertyOptional({ type: [ User ] })
    @BelongsToMany(() => User, () => RoleUser)
        users: User[]



    @ApiPropertyOptional({ type: [ CategoryRolePermissions ] })
    @HasMany(() => CategoryRolePermissions, { onDelete: 'cascade' })
        categoryPermissions: CategoryRolePermissions[]

    @ApiPropertyOptional({ type: [ TextChannelRolePermissions ] })
    @HasMany(() => TextChannelRolePermissions, { onDelete: 'cascade' })
        textChannelPermissions: TextChannelRolePermissions[]

    @ApiPropertyOptional({ type: RolePermissions })
    @HasOne(() => RolePermissions, { onDelete: 'cascade' })
        permissions: RolePermissions

}

