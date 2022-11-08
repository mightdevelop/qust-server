import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { User } from 'src/users/models/users.model'

@Table({ tableName: 'user-settings' })
export class UserSettings extends Model<UserSettings> {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => User)
        userId: string

    @ApiPropertyOptional({ type: User })
    @BelongsTo(() => User, { onDelete: 'cascade' })
        user: User

    @ApiProperty({ type: Boolean })
    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
        isInvis: boolean

    @ApiProperty({ type: Boolean })
    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
        isSleep: boolean

}

