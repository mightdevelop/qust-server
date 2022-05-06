import { RoleCategoryPermissionsList } from 'src/roles/types/permissions/category-permissions'
import { RoleTextChannelPermissionsList } from 'src/roles/types/permissions/text-channel-permissions'

export class CategoryLayout {

    name: string

    rolesPermissions?: CategoryRolePermissionsLayout[]

    channels: TextChannelLayout[]

}

class TextChannelLayout {

    name: string

    rolesPermissions?: TextChannelRolePermissionsLayout[]

}


class CategoryRolePermissionsLayout {
    roleId: number
    permissions: Partial<RoleCategoryPermissionsList>
}
class TextChannelRolePermissionsLayout {
    roleId: number
    permissions: Partial<RoleTextChannelPermissionsList>
}