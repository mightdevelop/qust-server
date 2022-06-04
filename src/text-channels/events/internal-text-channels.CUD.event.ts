import { CreateUpdateDelete } from 'src/utils/create-update-delete.enum'
import { TextChannel } from '../models/text-channels.model'

export class InternalTextChannelsCudEvent {

    constructor(
        { userIdWhoTriggered, groupId, channel, action }: InternalTextChannelsCreatedEventArgs
    ) {
        this.userIdWhoTriggered = userIdWhoTriggered
        this.groupId = groupId
        this.channel = channel
        this.action = action
    }

    userIdWhoTriggered: string

    groupId: string

    channel: TextChannel

    action: CreateUpdateDelete

}

class InternalTextChannelsCreatedEventArgs {

    userIdWhoTriggered: string

    groupId: string

    channel: TextChannel

    action: CreateUpdateDelete

}