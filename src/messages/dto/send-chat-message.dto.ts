import { IsUUID, IsString, IsBoolean, IsOptional } from 'class-validator'

export class SendChatMessageDto {

    @IsUUID()
        userId: string

    @IsUUID()
        chatId: string

    @IsString()
        text: string

    @IsBoolean()
    @IsOptional()
        noMentions?: boolean

}