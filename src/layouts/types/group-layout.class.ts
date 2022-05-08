import { RoleCategoryPermissionsList } from 'src/permissions/types/permissions/category-permissions'
import { RolePermissionsListClass } from 'src/permissions/types/permissions/role-permissions-list.class'
import { RoleTextChannelPermissionsList } from 'src/permissions/types/permissions/text-channel-permissions'


export class GroupLayout {
    roleLayouts: RoleLayout[]
    categoryLayouts: CategoryLayout[]
}

export class RoleLayout {
    name: string
    permissions?: Partial<RolePermissionsListClass>
}

export class CategoryLayout {
    name: string
    permissionsOfRoles?: CategoryRolePermissionsLayout[]
    channelLayouts: TextChannelLayout[]
}

export class TextChannelLayout {
    name: string
    permissionsOfRoles?: TextChannelRolePermissionsLayout[]
}


export class CategoryRolePermissionsLayout {
    roleName: string
    permissions: Partial<RoleCategoryPermissionsList>
}
export class TextChannelRolePermissionsLayout {
    roleName: string
    permissions: Partial<RoleTextChannelPermissionsList>
}