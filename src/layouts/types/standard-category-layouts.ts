import { ForcedPermissionLevel, PermissionLevel } from 'src/roles/types/permission-level'
import { GroupLayout } from './group-layout.class'

export const StandardGroupLayouts: { [key:string]: GroupLayout } = {
    DEFAULT: {
        roleLayouts: [
            {
                name: 'moderator',
                permissions: {
                    deleteMessages: ForcedPermissionLevel.ALOWED,
                    banUsers: ForcedPermissionLevel.ALOWED,
                    manageTextChannels: ForcedPermissionLevel.ALOWED,
                    deafenMembers: ForcedPermissionLevel.ALOWED,
                }
            }
        ],

        categoryLayouts: [
            {
                name: 'Text channels',
                permissionsOfRoles: [
                    {
                        roleName: 'moderator',
                        permissions: {
                            manageCategory: PermissionLevel.ALOWED
                        }
                    }
                ],
                channelLayouts: [
                    {
                        name: 'chatting',
                        permissionsOfRoles: [
                            {
                                roleName: 'moderator',
                                permissions: {
                                    deleteMessages: PermissionLevel.ALOWED
                                }
                            }
                        ]
                    },
                    {
                        name: 'flood'
                    }
                ]
            }
        ]
    }

}