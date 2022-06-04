import { Category } from 'src/categories/models/categories.model'
import { CreateUpdateDelete } from 'src/utils/create-update-delete.enum'

export class InternalCategoriesCudEvent {

    constructor({ userIdWhoTriggered, category, action }: InternalCategoriesCudEventArgs) {
        this.userIdWhoTriggered = userIdWhoTriggered
        this.category = category
        this.action = action
    }

    userIdWhoTriggered: string

    category: Category

    action: CreateUpdateDelete

}

class InternalCategoriesCudEventArgs {

    userIdWhoTriggered: string

    category: Category

    action: CreateUpdateDelete

}