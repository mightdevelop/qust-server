import { Type } from 'class-transformer'
import { IsString, IsUUID } from 'class-validator'
import { TextChannel } from '../models/text-channels.model'

export class UpdateTextChannelDto {

    @IsString()
        name: string

    @Type(() => TextChannel)
        channel: TextChannel

    @IsUUID()
        userId: string

    @IsUUID()
        groupId: string

}