import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UpdateTextChannelBody {

    @ApiProperty({ type: String })
    @IsString()
        name: string

}