import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { PermissionLevel } from '../types/permission-level'
import { DefaultRolePermissions } from '../types/permissions/default-permissions'
import { Role } from './roles.model'

@Table({ tableName: 'role-permissions' })
export class RolePermissions extends Model<RolePermissions> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: number

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Role)
        roleId: number

    @BelongsTo(() => Role)
        role: Role



    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.manageGroup
    })
        manageGroup: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.manageTextChannels
    })
        manageTextChannels: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.manageCategories
    })
        manageCategories: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.manageRoles
    })
        manageRoles: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.manageEvents
    })
        manageEvents: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.manageEmojis
    })
        manageEmojis: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.readAuditLog
    })
        readAuditLog: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.readAuditLog
    })
        banUsers: PermissionLevel


    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.voiceConnect
    })
        voiceConnect: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.voiceConnect
    })
        voiceSpeak: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.streamVideo
    })
        streamVideo: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.muteMembers
    })
        muteMembers: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.deafenMembers
    })
        deafenMembers: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.moveMembers
    })
        moveMembers: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.inviteUsers
    })
        inviteUsers: PermissionLevel


    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.viewTextChannels
    })
        viewTextChannels: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.readMessages
    })
        readMessages: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.writeMessages
    })
        writeMessages: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.deleteMessages
    })
        deleteMessages: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.embedLinks
    })
        embedLinks: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.embedFiles
    })
        embedFiles: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.addReactions
    })
        addReactions: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.useEmojis
    })
        useEmojis: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.useExternalEmojis
    })
        useExternalEmojis: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.mentionDefaultRoles
    })
        mentionDefaultRoles: PermissionLevel

    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.mentionCustomRoles
    })
        mentionCustomRoles: PermissionLevel

}

