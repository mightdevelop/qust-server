import { IsUUID, IsString } from 'class-validator'

export class CreateMessageDto {

    @IsUUID()
        userId: string

    @IsString()
        text: string

}