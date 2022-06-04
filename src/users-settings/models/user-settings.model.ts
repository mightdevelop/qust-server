import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { User } from 'src/users/models/users.model'

@Table({ tableName: 'user-settings' })
export class UserSettings extends Model<UserSettings> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => User)
        userId: string

    @BelongsTo(() => User, { onDelete: 'cascade' })
        user: User

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
        isInvis: boolean

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
        isSleep: boolean

}

