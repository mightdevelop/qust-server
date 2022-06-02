import { IsArray, IsUUID, ValidateNested } from 'class-validator'

export class CreateMentionsDto {

    @IsArray()
    @ValidateNested({ each: true })
    @IsUUID()
        usersIds: string[]

    @IsUUID()
        messageId: string

    @IsUUID()
        textChannelId: string

    @IsUUID()
        groupId: string

}