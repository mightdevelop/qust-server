import { Category } from 'src/categories/models/categories.model'
import { CreateUpdateDelete } from 'src/utils/create-update-delete.enum'

export class InternalCategoriesCudEvent {

    constructor({ userIdWhoTriggered, category, usersIds, action }: InternalCategoriesCudEventArgs) {
        this.userIdWhoTriggered = userIdWhoTriggered
        this.category = category
        this.usersIds = usersIds
        this.action = action
    }

    userIdWhoTriggered: string

    category: Category

    usersIds: string[]

    action: CreateUpdateDelete

}

class InternalCategoriesCudEventArgs {

    userIdWhoTriggered: string

    category: Category

    usersIds: string[]

    action: CreateUpdateDelete

}