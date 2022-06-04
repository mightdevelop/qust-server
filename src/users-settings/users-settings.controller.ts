import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { UserFromRequest } from 'src/auth/types/request-response'
import { UserSettings } from './models/user-settings.model'
import { UserSettingsList } from './types/user-settings-list.class'
import { UserSettingsService } from './users-settings.service'



@Controller('/user-settings')
export class UserSettingsController {

    constructor(
        private settingsService: UserSettingsService,
    ) {}

    @Get('/')
    @UseGuards(JwtAuthGuard)
    async getMySettings(
        @CurrentUser() user: UserFromRequest,
    ): Promise<UserSettings> {
        return await this.settingsService.getUserSettingsByUserId(user.id)
    }

    @Put('/')
    @UseGuards(JwtAuthGuard)
    async getChangeMySettings(
        @CurrentUser() user: UserFromRequest,
        @Body() { config }: { config: UserSettingsList }
    ): Promise<UserSettings> {
        return await this.settingsService.setUserSettings({ config, userId: user.id })
    }

}