import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Group } from 'src/groups/models/groups.model'
import { User } from 'src/users/models/users.model'
import { BannedUser } from './banned-users.model'

@Table({ tableName: 'group-blacklists' })
export class GroupBlacklist extends Model<GroupBlacklist> {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Group)
        groupId: string

    @ApiPropertyOptional({ type: Group })
    @BelongsTo(() => Group, { onDelete: 'cascade' })
        group: Group

    @ApiPropertyOptional({ type: [ User ] })
    @BelongsToMany(() => User, () => BannedUser)
        users: User[]

}

