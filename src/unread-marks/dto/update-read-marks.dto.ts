import { IsArray, IsUUID, ValidateNested } from 'class-validator'

export class UpdateUnreadMarksDto {

    @IsArray()
    @ValidateNested({ each: true })
    @IsUUID()
        usersIds: string[]

    @IsUUID()
        messageId: string

    @IsUUID()
        newMessageId: string

}