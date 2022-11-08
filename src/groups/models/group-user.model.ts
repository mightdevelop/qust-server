import { ApiProperty } from '@nestjs/swagger'
import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { User } from 'src/users/models/users.model'
import { Group } from './groups.model'

@Table({ tableName: 'group-user' })
export class GroupUser extends Model<GroupUser> {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Group)
        groupId: string

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => User)
        userId: string

}

