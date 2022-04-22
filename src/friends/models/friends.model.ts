import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { User } from 'src/users/models/users.model'
import { FriendRequestStatus } from '../types/friend-request-status'

@Table({ tableName: 'friends' })
export class Friend extends Model {

    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
        id: number

    @Column({ type: DataType.ENUM(
        FriendRequestStatus.REQUEST,
        FriendRequestStatus.CONFIRM
    ), defaultValue: FriendRequestStatus.REQUEST })
        status: FriendRequestStatus

    @Column
    @ForeignKey(() => User)
        userId: number

    @Column
    @ForeignKey(() => User)
        friendId: number

}

