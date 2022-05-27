import { Type } from 'class-transformer'
import { IsArray, IsUUID, ValidateNested } from 'class-validator'
import { TextChannel } from '../models/text-channels.model'

export class InternalTextChannelsUpdatedEvent {

    constructor({ channel, usersIds }: InternalTextChannelsUpdatedEventArgs) {
        this.channel = channel
        this.usersIds = usersIds
    }

    channel: TextChannel

    usersIds: string[]

}

class InternalTextChannelsUpdatedEventArgs {

    @Type(() => TextChannel)
        channel: TextChannel

    @IsArray()
    @ValidateNested({ each: true })
    @IsUUID()
        usersIds: string[]

}