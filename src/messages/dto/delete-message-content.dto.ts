import { IsNumber } from 'class-validator'

export class DeleteMessageContentDto {

    @IsNumber()
        messageContentId: number

}