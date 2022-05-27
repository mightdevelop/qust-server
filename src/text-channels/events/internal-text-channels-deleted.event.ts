import { IsArray, IsUUID, ValidateNested } from 'class-validator'

export class InternalTextChannelsDeletedEvent {

    constructor({ channelId, usersIds }: InternalTextChannelsDeletedEventArgs) {
        this.channelId = channelId
        this.usersIds = usersIds
    }

    channelId: string

    usersIds: string[]

}

class InternalTextChannelsDeletedEventArgs {

    @IsUUID()
        channelId: string

    @IsArray()
    @ValidateNested({ each: true })
    @IsUUID()
        usersIds: string[]

}