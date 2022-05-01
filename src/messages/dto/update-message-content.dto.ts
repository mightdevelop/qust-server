import { IsNumber, IsString } from 'class-validator'

export class UpdateMessageContentDto {

    @IsNumber()
        messageContentId: number

    @IsString()
        text: string

}