import { ApiProperty } from '@nestjs/swagger'
import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { User } from 'src/users/models/users.model'
import { enumToArrayOfIndexes } from 'src/utils/enum-to-array-of-indexes'
import { FriendRequestStatus } from '../types/friend-request-status'

@Table({ tableName: 'friends' })
export class Friend extends Model<Friend> {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @ApiProperty({ enum: enumToArrayOfIndexes(FriendRequestStatus) })
    @Column({ type: DataType.SMALLINT, defaultValue: FriendRequestStatus.REQUEST })
        status: FriendRequestStatus

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => User)
        userId: string

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => User)
        friendId: string

}

