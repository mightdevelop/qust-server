import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Group } from 'src/groups/models/groups.model'

@Table({ tableName: 'invites' })
export class Invite extends Model<Invite> {

    @Column({ type: DataType.STRING, unique: true, primaryKey: true })
        id: string

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Group)
        groupId: string

    @BelongsTo(() => Group)
        group: Group

    @Column({ type: DataType.SMALLINT, allowNull: true, defaultValue: 100 })
        remainingUsages: number

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1209600 /* 2 weeks */ })
        ttl: number

}

