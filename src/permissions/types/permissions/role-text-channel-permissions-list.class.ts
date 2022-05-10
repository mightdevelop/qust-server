import { PermissionLevel } from './permission-level'

export class RoleTextChannelPermissionsListClass {
    viewTextChannels: PermissionLevel
    readMessages: PermissionLevel
    writeMessages: PermissionLevel
    deleteMessages: PermissionLevel
    embedLinks: PermissionLevel
    embedFiles: PermissionLevel
    addReactions: PermissionLevel
    useEmojis: PermissionLevel
    useExternalEmojis: PermissionLevel
    mentionDefaultRoles: PermissionLevel
    mentionCustomRoles: PermissionLevel
}