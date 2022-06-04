import { Category } from 'src/categories/models/categories.model'
import { Role } from 'src/roles/models/roles.model'
import { UserToResponse } from 'src/users/types/user-to-response.class'

export class GroupToResponse {

    id: string

    ownerId: string

    name: string

    users?: UserToResponse[]

    roles?: Role[]

    categories?: Category[]

}