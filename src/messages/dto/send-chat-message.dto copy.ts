import { IsString } from 'class-validator'

export class CreateMessageContentDto {

    @IsString()
        text: string

}