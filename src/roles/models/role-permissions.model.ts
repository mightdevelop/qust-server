import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { ForcedPermissionLevel } from '../types/permission-level'
import { DefaultRolePermissions } from '../types/permissions/default-permissions'
import { Role } from './roles.model'

@Table({ tableName: 'role-permissions' })
export class RolePermissions extends Model<RolePermissions> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Role)
        roleId: string

    @BelongsTo(() => Role)
        role: Role



    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.manageGroup
    })
        manageGroup: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.manageTextChannels
    })
        manageTextChannels: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.manageCategories
    })
        manageCategories: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.manageRoles
    })
        manageRoles: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.manageEvents
    })
        manageEvents: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.manageEmojis
    })
        manageEmojis: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.readAuditLog
    })
        readAuditLog: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.readAuditLog
    })
        banUsers: ForcedPermissionLevel


    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.voiceConnect
    })
        voiceConnect: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.voiceConnect
    })
        voiceSpeak: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.streamVideo
    })
        streamVideo: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.muteMembers
    })
        muteMembers: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.deafenMembers
    })
        deafenMembers: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.moveMembers
    })
        moveMembers: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.inviteUsers
    })
        inviteUsers: ForcedPermissionLevel


    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.viewTextChannels
    })
        viewTextChannels: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.readMessages
    })
        readMessages: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.writeMessages
    })
        writeMessages: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.deleteMessages
    })
        deleteMessages: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.embedLinks
    })
        embedLinks: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.embedFiles
    })
        embedFiles: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.addReactions
    })
        addReactions: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.useEmojis
    })
        useEmojis: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.useExternalEmojis
    })
        useExternalEmojis: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.mentionDefaultRoles
    })
        mentionDefaultRoles: ForcedPermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.mentionCustomRoles
    })
        mentionCustomRoles: ForcedPermissionLevel

}

