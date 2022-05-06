import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { User } from 'src/users/models/users.model'


@Table({ tableName: 'notifications' })
export class Notification extends Model<Notification> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: number

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => User)
        userId: number

    @Column({ type: DataType.STRING, allowNull: false })
        body: string

    @Column({ type: DataType.DATE, allowNull: false })
        timestamp: number

}

