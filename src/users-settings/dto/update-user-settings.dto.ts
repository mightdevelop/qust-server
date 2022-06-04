import { Type } from 'class-transformer'
import { IsOptional, IsUUID } from 'class-validator'
import { UserSettingsList } from '../types/user-settings-list.class'

export class UpdateUserSettingsDto {

    @IsUUID()
        userId: string

    @Type(() => UserSettingsList)
    @IsOptional()
        config?: UserSettingsList

}