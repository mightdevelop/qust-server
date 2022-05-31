import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { User } from 'src/users/models/users.model'
import { GroupAuditLog } from './group-audit-logs.model'

@Table({ tableName: 'logged-actions' })
export class LoggedAction extends Model<LoggedAction> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => User)
        userId: string

    @BelongsTo(() => User)
        user: User

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => GroupAuditLog)
        auditLogId: string

    @Column({ type: DataType.STRING, allowNull: false })
        body: string

}

