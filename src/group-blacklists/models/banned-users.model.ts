import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { User } from 'src/users/models/users.model'
import { GroupBlacklist } from './group-blacklists.model'

@Table({ tableName: 'banned-users' })
export class BannedUser extends Model<BannedUser> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => User)
        userId: string

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => GroupBlacklist)
        blacklistId: string

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: '' })
        banReason: string

}

