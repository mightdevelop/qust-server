import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript'
import { Group } from 'src/groups/models/groups.model'
import { LoggedAction } from './logged-action.model'

@Table({ tableName: 'group-audit-logs' })
export class GroupAuditLog extends Model<GroupAuditLog> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Group)
        groupId: string

    @BelongsTo(() => Group, { onDelete: 'cascade' })
        group: Group

    @HasMany(() => LoggedAction)
        actions: LoggedAction[]

}

