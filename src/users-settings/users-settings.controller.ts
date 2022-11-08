import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { UserFromRequest } from 'src/auth/types/request-response'
import { UpdateUserSettingsBody } from './dto/update-user-settings.body'
import { UserSettings } from './models/user-settings.model'
import { UserSettingsService } from './users-settings.service'



@ApiTags('user-settings')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('/user-settings')
export class UserSettingsController {

    constructor(
        private settingsService: UserSettingsService,
    ) {}

    @Get('/')
    async getMySettings(
        @CurrentUser() user: UserFromRequest,
    ): Promise<UserSettings> {
        return await this.settingsService.getUserSettingsByUserId(user.id)
    }

    @Put('/')
    async getChangeMySettings(
        @CurrentUser() user: UserFromRequest,
        @Body() dto: UpdateUserSettingsBody
    ): Promise<UserSettings> {
        return await this.settingsService.setUserSettings({ ...dto, userId: user.id })
    }

}