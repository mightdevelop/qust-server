import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from 'sequelize-typescript'
import { User } from 'src/users/models/users.model'
import { GroupUser } from './group-user.model'
import { Role } from '../../roles/models/roles.model'
import { Category } from 'src/categories/models/categories.model'
import { GroupBlacklist } from 'src/group-blacklists/models/group-blacklists.model'
import { GroupAuditLog } from 'src/group-audit-logs/models/group-audit-logs.model'
import { Mention } from 'src/mentions/models/mentions.model'
import { UnreadMark } from 'src/unread-marks/models/read-marks.model'

@Table({ tableName: 'groups' })
export class Group extends Model<Group> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @BelongsTo(() => User)
        owner: User

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => User)
        ownerId: string

    @Column({ type: DataType.STRING, allowNull: false })
        name: string

    @BelongsToMany(() => User, () => GroupUser)
        users: User[]

    @HasMany(() => Role)
        roles: Role[]

    @HasMany(() => Category, { onDelete: 'cascade' })
        categories: Category[]

    @HasMany(() => Mention, { onDelete: 'cascade' })
        mentions: Mention[]

    @HasOne(() => GroupBlacklist, { onDelete: 'cascade' })
        blacklist: GroupBlacklist

    @HasOne(() => GroupAuditLog, { onDelete: 'cascade' })
        auditLog: GroupAuditLog

    // @HasMany(() => InviteLink)
    //     inviteLinks: InviteLink[]

    // @HasMany(() => Emoji)
    //     emojis: Emoji[]

}

