import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsBoolean, IsOptional } from 'class-validator'

export class SendChatMessageBody {

    @ApiProperty({ type: String })
    @IsString()
        text: string

    @ApiPropertyOptional({ type: Boolean })
    @IsBoolean()
    @IsOptional()
        noMentions?: boolean

}