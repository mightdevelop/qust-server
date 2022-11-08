import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { InternalMessagesCudEvent } from 'src/messages/events/internal-messages.CUD.event'
import { MessagesService } from 'src/messages/messages.service'
import { Message } from 'src/messages/models/messages.model'
import { PermissionsService } from 'src/permissions/permissions.service'
import { UsersService } from 'src/users/users.service'
import { isMessageLocationTextChannel } from 'src/utils/is-message-location-text-channel.typeguard'
import { UnreadMark } from './models/unread-marks.model'
import { UnreadMarksService } from './unread-marks.service'


@Injectable()
export class UnreadMarksCreator {

    constructor(
        private unreadMarksService: UnreadMarksService,
        private usersService: UsersService,
        private messagesService: MessagesService,
        private permissionsService: PermissionsService,
    ) {}

    @OnEvent('internal-messages.created')
    async createUnreadMarksOnMessageCreated(
        { message, noMentions }: InternalMessagesCudEvent
    ): Promise<void> {
        if (noMentions) return
        let idsOfUsersThatDontHaveUnreadMarkInLocation: string[]
        if (isMessageLocationTextChannel(message.messageLocation.location)) {
            const channelUsersIds: string[] =
                await this.permissionsService.getIdsOfUsersThatCanViewTextChannel(
                    message.messageLocation.location.textChannelId,
                    message.messageLocation.location.groupId
                )
            const idsOfUserThatHaveUnreadMarkInChannel =
                (await this.unreadMarksService.getUnreadMarksByLocations([ message.messageLocation ]))
                    .map(mark => mark.userId)
            idsOfUsersThatDontHaveUnreadMarkInLocation = channelUsersIds
                .filter(userId => !idsOfUserThatHaveUnreadMarkInChannel.includes(userId))
        } else {
            const chatUsersIds: string[] = await this.usersService.getIdsOfChattersByChatId(
                message.messageLocation.location.chatId
            )
            const idsOfUserThatHaveUnreadMarkInChat =
                (await this.unreadMarksService.getUnreadMarksByMessageId(message.id))
                    .map(mark => mark.userId)
            idsOfUsersThatDontHaveUnreadMarkInLocation = chatUsersIds
                .filter(userId => !idsOfUserThatHaveUnreadMarkInChat.includes(userId))
        }
        await this.unreadMarksService.createUnreadMarks({
            usersIds: idsOfUsersThatDontHaveUnreadMarkInLocation,
            messageId: message.id,
            messageLocation: message.messageLocation
        })
    }

    @OnEvent('internal-messages.deleted')
    async moveUnreadMarksOnMessageDeleted(
        { message }: InternalMessagesCudEvent
    ): Promise<void> {
        const newMessage: Message = await this.messagesService.getNextMessage(message)
        const unreadMarks: UnreadMark[] =
            await this.unreadMarksService.getUnreadMarksByMessageId(message.id)
        newMessage
            ?
            await this.unreadMarksService.updateUnreadMarks({
                messageId: message.id,
                usersIds: unreadMarks.map(mark => mark.userId),
                newMessageId: newMessage.id
            })
            :
            await this.unreadMarksService.deleteUnreadMarks({ unreadMarks })
    }

}