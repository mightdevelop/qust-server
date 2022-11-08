import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class DeleteMentionsBody {

    @ApiProperty({ type: [ String ], format: 'uuid' })
    @IsUUID(4, { each: true })
        mentionsIds: string[]

}