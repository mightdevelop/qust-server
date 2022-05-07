import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript'
import { GroupUser } from 'src/groups/models/group-user.model'
import { Group } from 'src/groups/models/groups.model'
import { RoleUser } from 'src/roles/models/role-user.model'
import { Role } from 'src/roles/models/roles.model'

@Table({ tableName: 'users' })
export class User extends Model<User> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @Column({ type: DataType.STRING, allowNull: false })
        username: string

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
        email: string

    @Column({ type: DataType.STRING, allowNull: false })
        password: string

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
        banned: boolean

    @Column({ type: DataType.STRING, allowNull: true })
        banReason: string

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
        isAdmin: boolean

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: '' })
        info: string

    @BelongsToMany(() => Group, () => GroupUser)
        groups: Group[]

    @BelongsToMany(() => Role, () => RoleUser)
        roles: Role[]

}

