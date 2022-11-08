import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectModel } from '@nestjs/sequelize'
import { InternalUserSettingsChangeEvent } from 'src/users/events/internal-user-settings.change.event'
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto'
import { UserSettings } from './models/user-settings.model'
import { defaultUserSettings } from './types/default-settings'


@Injectable()
export class UserSettingsService {

    constructor(
        @InjectModel(UserSettings) private settingsRepository: typeof UserSettings,
        private eventEmitter: EventEmitter2,
    ) {}

    async getUserSettingsByUserId(
        userId: string
    ): Promise<UserSettings> {
        return await this.settingsRepository.findOne({ where: { userId } })
    }

    async setUserSettings(
        { changes, userId }: UpdateUserSettingsDto
    ): Promise<UserSettings> {
        const settings: UserSettings = await this.settingsRepository.findOne({ where: { userId } })
        if (!changes)
            changes = defaultUserSettings
        settings.setAttributes(changes)
        await settings.save()
        this.eventEmitter.emit(
            'internal-user-settings.change',
            new InternalUserSettingsChangeEvent({ settings })
        )
        return settings
    }

}