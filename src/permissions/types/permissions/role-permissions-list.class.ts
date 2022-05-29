import { ForcedPermissionLevel } from './permission-level'

export class RolePermissionsListClass {
    manageGroup?: ForcedPermissionLevel
    manageCategoriesAndChannels?: ForcedPermissionLevel
    manageRoles?: ForcedPermissionLevel
    manageEvents?: ForcedPermissionLevel
    manageEmojis?: ForcedPermissionLevel
    readAuditLog?: ForcedPermissionLevel
    banUsers?: ForcedPermissionLevel
    viewTextChannels?: ForcedPermissionLevel
    readMessages?: ForcedPermissionLevel
    writeMessages?: ForcedPermissionLevel
    deleteMessages?: ForcedPermissionLevel
    embedLinks?: ForcedPermissionLevel
    embedFiles?: ForcedPermissionLevel
    addReactions?: ForcedPermissionLevel
    useEmojis?: ForcedPermissionLevel
    useExternalEmojis?: ForcedPermissionLevel
    mentionDefaultRoles?: ForcedPermissionLevel
    mentionCustomRoles?: ForcedPermissionLevel
    inviteUsers?: ForcedPermissionLevel
    voiceConnect?: ForcedPermissionLevel
    voiceSpeak?: ForcedPermissionLevel
    streamVideo?: ForcedPermissionLevel
    muteMembers?: ForcedPermissionLevel
    deafenMembers?: ForcedPermissionLevel
    moveMembers?: ForcedPermissionLevel
}