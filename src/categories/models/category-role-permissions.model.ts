import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Role } from 'src/roles/models/roles.model'
import { PermissionLevel } from 'src/roles/types/permission-level'
import { Category } from './categories.model'

@Table({ tableName: 'category-role-permissions' })
export class CategoryRolePermissions extends Model<CategoryRolePermissions> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Role)
        roleId: string

    @BelongsTo(() => Role)
        role: Role

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Category)
        categoryId: string

    @BelongsTo(() => Category)
        category: Category



    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: PermissionLevel.NOT_ALOWED })
        manageCategory: PermissionLevel

}

