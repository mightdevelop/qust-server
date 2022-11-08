import { MessageLocation } from '../types/message-location'

export class CreateUnreadMarksDto {

    usersIds: string[]

    messageId: string

    messageLocation: MessageLocation

}