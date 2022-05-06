import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { User } from 'src/users/models/users.model'
import { Role } from './roles.model'

@Table({ tableName: 'role-user' })
export class RoleUser extends Model<RoleUser> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: number

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Role)
        roleId: number

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => User)
        userId: number

}

