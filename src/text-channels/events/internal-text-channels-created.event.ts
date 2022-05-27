import { Type } from 'class-transformer'
import { IsArray, IsUUID, ValidateNested } from 'class-validator'
import { TextChannel } from '../models/text-channels.model'

export class InternalTextChannelsCreatedEvent {

    constructor({ channel, usersIds }: InternalTextChannelsCreatedEventArgs) {
        this.channel = channel
        this.usersIds = usersIds
    }

    channel: TextChannel

    usersIds: string[]

}

class InternalTextChannelsCreatedEventArgs {

    @Type(() => TextChannel)
        channel: TextChannel

    @IsArray()
    @ValidateNested({ each: true })
    @IsUUID()
        usersIds: string[]

}