import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Socket } from 'socket.io'
import { User } from 'src/users/models/users.model'

@Table({ tableName: 'connected-sockets' })
export class ConnectedSocket extends Model<ConnectedSocket> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @Column({ type: DataType.JSON, allowNull: false })
        socket: Socket

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => User)
        userId: string

    @BelongsTo(() => User)
        user: User


}

