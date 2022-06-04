import { CreateUpdateDelete } from 'src/utils/create-update-delete.enum'
import { Group } from '../models/groups.model'

export class InternalGroupsCudEvent {

    constructor({ group, action }: InternalGroupsCudEventArgs) {
        this.group = group
        this.action = action
    }

    group: Group

    action: CreateUpdateDelete

}

class InternalGroupsCudEventArgs {

    group: Group

    action: CreateUpdateDelete

}