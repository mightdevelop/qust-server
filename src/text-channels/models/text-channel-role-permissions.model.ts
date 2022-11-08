import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { PermissionLevel } from 'src/permissions/types/permissions/permission-level'
import { Role } from 'src/roles/models/roles.model'
import { enumToArrayOfIndexes } from 'src/utils/enum-to-array-of-indexes'
import { TextChannel } from './text-channels.model'

@Table({ tableName: 'text-channel-role-permissions' })
export class TextChannelRolePermissions extends Model<TextChannelRolePermissions> {

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

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => TextChannel)
        textChannelId: string

    @ApiPropertyOptional({ type: TextChannel })
    @BelongsTo(() => TextChannel)
        channel: TextChannel



    @ApiProperty({ enum: enumToArrayOfIndexes(PermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: PermissionLevel.ALOWED })
        viewTextChannels: PermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(PermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: PermissionLevel.ALOWED })
        readMessages: PermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(PermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: PermissionLevel.ALOWED })
        writeMessages: PermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(PermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: PermissionLevel.NOT_ALOWED })
        deleteMessages: PermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(PermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: PermissionLevel.ALOWED })
        embedLinks: PermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(PermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: PermissionLevel.ALOWED })
        embedFiles: PermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(PermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: PermissionLevel.ALOWED })
        addReactions: PermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(PermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: PermissionLevel.ALOWED })
        useEmojis: PermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(PermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: PermissionLevel.ALOWED })
        useExternalEmojis: PermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(PermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: PermissionLevel.ALOWED })
        mentionDefaultRoles: PermissionLevel

    @ApiProperty({ enum: enumToArrayOfIndexes(PermissionLevel) })
    @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: PermissionLevel.ALOWED })
        mentionCustomRoles: PermissionLevel

}

