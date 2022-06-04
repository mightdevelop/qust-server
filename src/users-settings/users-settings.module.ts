import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UserSettings } from './models/user-settings.model'
import { UserSettingsController } from './users-settings.controller'
import { UserSettingsService } from './users-settings.service'

@Module({
    controllers: [ UserSettingsController ],
    providers: [
        UserSettingsService,
    ],
    imports: [
        SequelizeModule.forFeature([ UserSettings ]),
    ],
    exports: [
        UserSettingsService,
    ]
})

export class UserSettingsModule {}