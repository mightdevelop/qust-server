import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Group } from 'src/groups/models/groups.model'

@Table({ tableName: 'invites' })
export class Invite extends Model<Invite> {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.STRING, unique: true, primaryKey: true })
        id: string

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Group)
        groupId: string

    @ApiPropertyOptional({ type: Group })
    @BelongsTo(() => Group)
        group: Group

    @ApiProperty({ type: Number, default: 100 })
    @Column({ type: DataType.SMALLINT, allowNull: true, defaultValue: 100 })
        remainingUsages: number

    @ApiProperty({ type: Number, format: 'second', default: 1209600, maximum: 1209600000 })
    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1209600 /* 2 weeks */ })
        ttl: number

}

