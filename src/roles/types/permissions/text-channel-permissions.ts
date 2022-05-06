import { ForcedPermissionLevel } from '../permission-level'

export class RoleTextChannelPermissionsList {
    viewTextChannels: ForcedPermissionLevel
    readMessages: ForcedPermissionLevel
    writeMessages: ForcedPermissionLevel
    deleteMessages: ForcedPermissionLevel
    embedLinks: ForcedPermissionLevel
    embedFiles: ForcedPermissionLevel
    addReactions: ForcedPermissionLevel
    useEmojis: ForcedPermissionLevel
    useExternalEmojis: ForcedPermissionLevel
    mentionDefaultRoles: ForcedPermissionLevel
    mentionCustomRoles: ForcedPermissionLevel
}