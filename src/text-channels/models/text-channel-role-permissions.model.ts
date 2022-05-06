import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Role } from 'src/roles/models/roles.model'
import { ForcedPermissionLevel } from 'src/roles/types/permission-level'
import { TextChannel } from './text-channels.model'

@Table({ tableName: 'channel-role-permissions' })
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



    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: ForcedPermissionLevel.ALOWED })
        viewTextChannels: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: ForcedPermissionLevel.ALOWED })
        readMessages: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: ForcedPermissionLevel.ALOWED })
        writeMessages: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: ForcedPermissionLevel.NOT_ALOWED })
        deleteMessages: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: ForcedPermissionLevel.ALOWED })
        embedLinks: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: ForcedPermissionLevel.ALOWED })
        embedFiles: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: ForcedPermissionLevel.ALOWED })
        addReactions: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: ForcedPermissionLevel.ALOWED })
        useEmojis: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: ForcedPermissionLevel.ALOWED })
        useExternalEmojis: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: ForcedPermissionLevel.ALOWED })
        mentionDefaultRoles: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: ForcedPermissionLevel.ALOWED })
        mentionCustomRoles: ForcedPermissionLevel

}

