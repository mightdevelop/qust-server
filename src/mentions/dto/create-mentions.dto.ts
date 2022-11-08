import { IsUUID } from 'class-validator'

export class CreateMentionsDto {

    @IsUUID(4, { each: true })
        usersIds: string[]

    @IsUUID()
        messageId: string

    @IsUUID()
        textChannelId: string

    @IsUUID()
        groupId: string

}