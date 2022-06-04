import { UserSettings } from 'src/users-settings/models/user-settings.model'

export class InternalUserSettingsChangeEvent {

    constructor(
        { settings }: InternalUsersCudEventArgs
    ) {
        this.settings = settings
    }

    settings: UserSettings

}

class InternalUsersCudEventArgs {

    settings: UserSettings

}