import { usersToResponse } from 'src/users/utils/users-to-response.func'
import { Group } from '../models/groups.model'
import { GroupToResponse } from '../types/group-to-response.class'

export const groupsToResponse = (groups: Group[]): GroupToResponse[] => groups
    .map(group => ({
        id: group.id,
        ownerId: group.ownerId,
        name: group.name,
        users: group.users? usersToResponse(group.users) : undefined,
        roles: group.roles,
        categories: group.categories,
    }))