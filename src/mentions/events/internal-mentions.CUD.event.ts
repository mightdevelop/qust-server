import { CreateUpdateDelete } from 'src/utils/create-update-delete.enum'
import { Mention } from '../models/mentions.model'

export class InternalMentionsCudEvent {

    constructor({ mentions, usersIds, action }: InternalMentionsCudEventArgs) {
        this.mentions = mentions
        this.usersIds = usersIds
        this.action = action
    }

    mentions: Mention[]

    usersIds: string[]

    action: CreateUpdateDelete

}

class InternalMentionsCudEventArgs {

    mentions: Mention[]

    usersIds: string[]

    action: CreateUpdateDelete

}