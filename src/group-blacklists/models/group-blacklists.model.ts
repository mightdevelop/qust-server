import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Group } from 'src/groups/models/groups.model'
import { User } from 'src/users/models/users.model'
import { BannedUser } from './banned-users.model'

@Table({ tableName: 'group-blacklists' })
export class GroupBlacklist extends Model<GroupBlacklist> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Group)
        groupId: string

    @BelongsTo(() => Group, { onDelete: 'cascade' })
        group: Group

    @BelongsToMany(() => User, () => BannedUser)
        users: User[]

}

