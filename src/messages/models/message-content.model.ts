import { Column, DataType, Model, Table } from 'sequelize-typescript'

@Table({ tableName: 'message-content' })
export class MessageContent extends Model {

    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
        id: number

    @Column({ type: DataType.STRING, allowNull: true })
        text: string

}

