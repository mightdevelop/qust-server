import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { PermissionLevel } from 'src/permissions/types/permissions/permission-level'
import { Role } from 'src/roles/models/roles.model'
import { enumToArrayOfIndexes } from 'src/utils/enum-to-array-of-indexes'
import { Category } from './categories.model'

@Table({ tableName: 'category-role-permissions' })
export class CategoryRolePermissions extends Model<CategoryRolePermissions> {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Role)
        roleId: string

    @ApiPropertyOptional({ type: Role })
    @BelongsTo(() => Role)
        role: Role

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Category)
        categoryId: string

    @ApiPropertyOptional({ type: Category })
    @BelongsTo(() => Category)
        category: Category



    @ApiProperty({ enum: enumToArrayOfIndexes(PermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: PermissionLevel.NOT_ALOWED })
        manageCategory: PermissionLevel

}

