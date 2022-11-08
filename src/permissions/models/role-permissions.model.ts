import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Role } from 'src/roles/models/roles.model'
import { ForcedPermissionLevel } from '../types/permissions/permission-level'
import { DefaultRolePermissions } from '../types/permissions/default-permissions'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { enumToArrayOfIndexes } from 'src/utils/enum-to-array-of-indexes'

@Table({ tableName: 'role-permissions' })
export class RolePermissions extends Model<RolePermissions> {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Role)
        roleId: string

    @ApiPropertyOptional({ type: Role })
    @BelongsTo(() => Role)
        role: Role



    @ApiProperty({ enum: enumToArrayOfIndexes(ForcedPermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.manageGroup
    })
        manageGroup: ForcedPermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(ForcedPermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.manageRoles
    })
        manageRoles: ForcedPermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(ForcedPermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.manageCategoriesAndChannels
    })
        manageCategoriesAndChannels: ForcedPermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(ForcedPermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.manageEvents
    })
        manageEvents: ForcedPermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(ForcedPermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.manageEmojis
    })
        manageEmojis: ForcedPermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(ForcedPermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.readAuditLog
    })
        readAuditLog: ForcedPermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(ForcedPermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.readAuditLog
    })
        banUsers: ForcedPermissionLevel


    @ApiProperty({ enum: enumToArrayOfIndexes(ForcedPermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.voiceConnect
    })
        voiceConnect: ForcedPermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(ForcedPermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.voiceConnect
    })
        voiceSpeak: ForcedPermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(ForcedPermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.streamVideo
    })
        streamVideo: ForcedPermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(ForcedPermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.muteMembers
    })
        muteMembers: ForcedPermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(ForcedPermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.deafenMembers
    })
        deafenMembers: ForcedPermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(ForcedPermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.moveMembers
    })
        moveMembers: ForcedPermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(ForcedPermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.inviteUsers
    })
        inviteUsers: ForcedPermissionLevel


    @ApiProperty({ enum: enumToArrayOfIndexes(ForcedPermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.viewTextChannels
    })
        viewTextChannels: ForcedPermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(ForcedPermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.readMessages
    })
        readMessages: ForcedPermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(ForcedPermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.writeMessages
    })
        writeMessages: ForcedPermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(ForcedPermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.deleteMessages
    })
        deleteMessages: ForcedPermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(ForcedPermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.embedLinks
    })
        embedLinks: ForcedPermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(ForcedPermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.embedFiles
    })
        embedFiles: ForcedPermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(ForcedPermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.addReactions
    })
        addReactions: ForcedPermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(ForcedPermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.useEmojis
    })
        useEmojis: ForcedPermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(ForcedPermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.useExternalEmojis
    })
        useExternalEmojis: ForcedPermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(ForcedPermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.mentionDefaultRoles
    })
        mentionDefaultRoles: ForcedPermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(ForcedPermissionLevel),  })
    @Column({ type: DataType.SMALLINT, allowNull: false,
        defaultValue: DefaultRolePermissions.mentionCustomRoles
    })
        mentionCustomRoles: ForcedPermissionLevel

}

