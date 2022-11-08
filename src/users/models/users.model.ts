import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BelongsToMany, Column, DataType, HasMany, HasOne, Model, Table } from 'sequelize-typescript'
import { LoggedAction } from 'src/group-audit-logs/models/logged-action.model'
import { BannedUser } from 'src/group-blacklists/models/banned-users.model'
import { GroupBlacklist } from 'src/group-blacklists/models/group-blacklists.model'
import { GroupUser } from 'src/groups/models/group-user.model'
import { Group } from 'src/groups/models/groups.model'
import { Mention } from 'src/mentions/models/mentions.model'
import { RoleUser } from 'src/roles/models/role-user.model'
import { Role } from 'src/roles/models/roles.model'
import { UserSettings } from 'src/users-settings/models/user-settings.model'
import { enumToArrayOfIndexes } from 'src/utils/enum-to-array-of-indexes'
import { UserStatus } from '../types/user-status.enum'

@Table({ tableName: 'users' })
export class User extends Model<User> {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: false })
        username: string

    @ApiProperty({ type: String, format: 'email' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
        email: string

    @ApiProperty({ type: String, format: 'password' })
    @Column({ type: DataType.STRING, allowNull: false })
        password: string

    @ApiProperty({ type: Boolean })
    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
        isAdmin: boolean

    @ApiProperty({ type: String })
    @Column({ type: DataType.STRING, allowNull: false, defaultValue: '' })
        info: string

    @ApiProperty({ enum: enumToArrayOfIndexes(UserStatus) })
    @Column({ type: DataType.STRING, allowNull: false, defaultValue: UserStatus.OFFLINE })
        status: UserStatus

    @ApiPropertyOptional({ type: UserSettings })
    @HasOne(() => UserSettings)
        settings: UserSettings

    @ApiPropertyOptional({ type: [ LoggedAction ] })
    @HasMany(() => LoggedAction)
        actions: LoggedAction[]

    @ApiPropertyOptional({ type: [ Mention ] })
    @HasMany(() => Mention)
        mentions: Mention[]

    @ApiPropertyOptional({ type: [ Group ] })
    @BelongsToMany(() => Group, () => GroupUser)
        groups: Group[]

    @ApiPropertyOptional({ type: [ UserSettings ] })
    @BelongsToMany(() => Role, () => RoleUser)
        roles: Role[]

    @ApiPropertyOptional({ type: GroupBlacklist })
    @BelongsToMany(() => GroupBlacklist, () => BannedUser)
        groupBlacklists: GroupBlacklist

}

