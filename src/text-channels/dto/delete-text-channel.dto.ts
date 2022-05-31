import { Type } from 'class-transformer'
import { IsUUID } from 'class-validator'
import { TextChannel } from '../models/text-channels.model'

export class DeleteTextChannelDto {

    @Type(() => TextChannel)
        channel: TextChannel

    @IsUUID()
        userId: string

    @IsUUID()
        groupId: string

}