import { BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript'
import { LoggedAction } from 'src/group-audit-logs/models/logged-action.model'
import { BannedUser } from 'src/group-blacklists/models/banned-users.model'
import { GroupBlacklist } from 'src/group-blacklists/models/group-blacklists.model'
import { GroupUser } from 'src/groups/models/group-user.model'
import { Group } from 'src/groups/models/groups.model'
import { Mention } from 'src/mentions/models/mentions.model'
import { RoleUser } from 'src/roles/models/role-user.model'
import { Role } from 'src/roles/models/roles.model'
import { UserStatus } from '../types/user-status.enum'

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

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
        isAdmin: boolean

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: '' })
        info: string

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: UserStatus.OFFLINE })
        status: UserStatus

    @HasMany(() => LoggedAction)
        actions: LoggedAction[]

    @HasMany(() => Mention)
        mentions: Mention[]

    @BelongsToMany(() => Group, () => GroupUser)
        groups: Group[]

    @BelongsToMany(() => Role, () => RoleUser)
        roles: Role[]

    @BelongsToMany(() => GroupBlacklist, () => BannedUser)
        groupBlacklists: GroupBlacklist

}

