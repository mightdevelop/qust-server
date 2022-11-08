import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsUUID } from 'class-validator'
import { UserSettingsList } from '../types/user-settings-list.class'

export class UpdateUserSettingsDto {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @IsUUID()
        userId: string

    @ApiProperty({ type: UserSettingsList })
    @Type(() => UserSettingsList)
        changes: UserSettingsList

}