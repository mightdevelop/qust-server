import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { User } from 'src/users/models/users.model'
import { Group } from './groups.model'

@Table({ tableName: 'group-user' })
export class GroupUser extends Model<GroupUser> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: number

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Group)
        groupId: number

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => User)
        userId: number

}

