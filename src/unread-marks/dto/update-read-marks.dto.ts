import { IsUUID } from 'class-validator'

export class UpdateUnreadMarksDto {

    @IsUUID(4, { each: true })
        usersIds: string[]

    @IsUUID()
        messageId: string

    @IsUUID()
        newMessageId: string

}