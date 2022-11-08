import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength, MinLength } from 'class-validator'

export class InviteIdDto {

    @ApiProperty({ type: String, format: '11 symbols', example: 'Xl21WoDoEgd' })
    @IsString()
    @MinLength(11)
    @MaxLength(11)
        inviteId: string

}