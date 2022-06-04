import { IsUUID, IsString, MaxLength, MinLength } from 'class-validator'

export class SendTextChannelMessageDto {

    @IsUUID()
        userId: string

    @IsString()
    @MinLength(4)
    @MaxLength(25)
        username: string

    @IsUUID()
        textChannelId: string

    @IsString()
        text: string

}