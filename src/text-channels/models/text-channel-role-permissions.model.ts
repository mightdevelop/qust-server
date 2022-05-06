import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Role } from 'src/roles/models/roles.model'
import { PermissionLevel } from 'src/roles/types/permission-level'
import { TextChannel } from './text-channels.model'

@Table({ tableName: 'text-channel-role-permissions' })
export class TextChannelRolePermissions extends Model<TextChannelRolePermissions> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: number

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Role)
        roleId: number

    @BelongsTo(() => Role)
        role: Role

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => TextChannel)
        channelId: number

    @BelongsTo(() => TextChannel)
        channel: TextChannel



    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: PermissionLevel.ALOWED })
        viewTextChannels: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: PermissionLevel.ALOWED })
        readMessages: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: PermissionLevel.ALOWED })
        writeMessages: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: PermissionLevel.NOT_ALOWED })
        deleteMessages: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: PermissionLevel.ALOWED })
        embedLinks: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: PermissionLevel.ALOWED })
        embedFiles: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: PermissionLevel.ALOWED })
        addReactions: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: PermissionLevel.ALOWED })
        useEmojis: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: PermissionLevel.ALOWED })
        useExternalEmojis: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: PermissionLevel.ALOWED })
        mentionDefaultRoles: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: PermissionLevel.ALOWED })
        mentionCustomRoles: PermissionLevel

}

