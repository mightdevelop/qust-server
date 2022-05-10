import { Type } from 'class-transformer'
import { TextChannel } from '../models/text-channels.model'

export class DeleteTextChannelDto {

    @Type(() => TextChannel)
        channel: TextChannel

}