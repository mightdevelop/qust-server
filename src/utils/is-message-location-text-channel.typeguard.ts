import { MessageTextChannelLocation } from 'src/unread-marks/types/message-location'

export function isMessageLocationTextChannel(location): location is MessageTextChannelLocation {
    if (location === typeof MessageTextChannelLocation) {
        return true
    }
    return false
}