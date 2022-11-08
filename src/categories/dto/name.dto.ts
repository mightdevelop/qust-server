import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class NameDto {

    @ApiProperty({ type: String })
    @IsString()
        name: string

}