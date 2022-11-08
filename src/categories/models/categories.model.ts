import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript'
import { Group } from 'src/groups/models/groups.model'
import { TextChannel } from 'src/text-channels/models/text-channels.model'
import { CategoryRolePermissions } from './category-role-permissions.model'

@Table({ tableName: 'categories' })
export class Category extends Model<Category> {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: false })
        name: string

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Group)
        groupId: string

    @ApiPropertyOptional({ type: Group })
    @BelongsTo(() => Group, { onDelete: 'cascade' })
        group: Group

    @ApiPropertyOptional({ type: [ TextChannel ] })
    @HasMany(() => TextChannel)
        channels: TextChannel[]

    @ApiPropertyOptional({ type: [ CategoryRolePermissions ] })
    @HasMany(() => CategoryRolePermissions)
        permissions: CategoryRolePermissions[]

}

