import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { UserSettingsList } from '../types/user-settings-list.class'

export class UpdateUserSettingsBody {

    @ApiProperty({ type: UserSettingsList })
    @Type(() => UserSettingsList)
        changes: UserSettingsList

}