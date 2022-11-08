import { CreateUpdateDelete } from 'src/utils/create-update-delete.enum'
import { UnreadMark } from '../models/unread-marks.model'

export class InternalUnreadMarksCudEvent {

    constructor({ unreadMarks, usersIds, action }: InternalUnreadMarksCudEventArgs) {
        this.unreadMarks = unreadMarks
        this.usersIds = usersIds
        this.action = action
    }

    unreadMarks: UnreadMark[]

    usersIds: string[]

    action: CreateUpdateDelete

}

class InternalUnreadMarksCudEventArgs {

    unreadMarks: UnreadMark[]

    usersIds: string[]

    action: CreateUpdateDelete

}