import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript'
import { Group } from 'src/groups/models/groups.model'
import { LoggedAction } from './logged-action.model'

@Table({ tableName: 'group-audit-logs' })
export class GroupAuditLog extends Model<GroupAuditLog> {

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

    @ApiPropertyOptional({ type: [ LoggedAction ] })
    @HasMany(() => LoggedAction)
        actions: LoggedAction[]

}

