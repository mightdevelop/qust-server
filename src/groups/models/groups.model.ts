import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from 'sequelize-typescript'
import { User } from 'src/users/models/users.model'
import { GroupUser } from './group-user.model'
import { Role } from '../../roles/models/roles.model'
import { Category } from 'src/categories/models/categories.model'
import { GroupBlacklist } from 'src/group-blacklists/models/group-blacklists.model'
import { GroupAuditLog } from 'src/group-audit-logs/models/group-audit-logs.model'
import { Mention } from 'src/mentions/models/mentions.model'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

@Table({ tableName: 'groups' })
export class Group extends Model<Group> {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @ApiPropertyOptional({ type: User })
    @BelongsTo(() => User)
        owner: User

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => User)
        ownerId: string

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: false })
        name: string

    @ApiPropertyOptional({ type: [ User ] })
    @BelongsToMany(() => User, () => GroupUser)
        users: User[]

    @ApiPropertyOptional({ type: [ Role ] })
    @HasMany(() => Role)
        roles: Role[]

    @ApiPropertyOptional({ type: [ Category ] })
    @HasMany(() => Category, { onDelete: 'cascade' })
        categories: Category[]

    @ApiPropertyOptional({ type: [ Mention ] })
    @HasMany(() => Mention, { onDelete: 'cascade' })
        mentions: Mention[]

    @ApiPropertyOptional({ type: GroupBlacklist })
    @HasOne(() => GroupBlacklist, { onDelete: 'cascade' })
        blacklist: GroupBlacklist

    @ApiPropertyOptional({ type: GroupAuditLog })
    @HasOne(() => GroupAuditLog, { onDelete: 'cascade' })
        auditLog: GroupAuditLog

    // @HasMany(() => InviteLink)
    //     inviteLinks: InviteLink[]

    // @HasMany(() => Emoji)
    //     emojis: Emoji[]

}

