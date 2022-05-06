import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { User } from 'src/users/models/users.model'
import { FriendRequestStatus } from '../types/friend-request-status'

@Table({ tableName: 'friends' })
export class Friend extends Model<Friend> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: number

    @Column({ type: DataType.ENUM(
        FriendRequestStatus.REQUEST,
        FriendRequestStatus.CONFIRM
    ), defaultValue: FriendRequestStatus.REQUEST })
        status: FriendRequestStatus

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => User)
        userId: number

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => User)
        friendId: number

}

