import { RoleCategoryPermissionsListClass } from 'src/permissions/types/permissions/role-category-permissions-list.class'
import { RolePermissionsListClass } from 'src/permissions/types/permissions/role-permissions-list.class'
import { RoleTextChannelPermissionsListClass } from 'src/permissions/types/permissions/role-text-channel-permissions-list.class'


export class GroupLayout {
    roleLayouts?: RoleLayout[]
    categoryLayouts?: CategoryLayout[]
}

export class RoleLayout {
    name: string
    permissions?: RolePermissionsListClass
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
    permissions: Partial<RoleCategoryPermissionsListClass>
}
export class TextChannelRolePermissionsLayout {
    roleName: string
    permissions: Partial<RoleTextChannelPermissionsListClass>
}