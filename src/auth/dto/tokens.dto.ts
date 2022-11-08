import { ApiProperty } from '@nestjs/swagger'

export class TokensDto {

    @ApiProperty({ type: String })
        accessToken: string

    @ApiProperty({ type: String })
        refreshToken: string

}