import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { User } from 'src/users/models/users.model'


@Table({ tableName: 'notifications' })
export class Notification extends Model {

    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
        id: number

    @ForeignKey(() => User)
        userId: number

    @Column({ type: DataType.STRING, allowNull: false })
        body: string

    @Column({ type: DataType.DATE })
        timestamp: number

}

