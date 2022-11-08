import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class TextDto {

    @ApiProperty({ type: String })
    @IsString()
        text: string

}