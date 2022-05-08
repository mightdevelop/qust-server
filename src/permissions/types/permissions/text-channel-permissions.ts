import { PermissionLevel } from '../permission-level'

export class RoleTextChannelPermissionsList {
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