import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { InternalMessagesCudEvent } from 'src/messages/events/internal-messages.CUD.event'
import { InternalTextChannelsMessageSentEvent } from 'src/messages/events/internal-text-channels.message-sent.event'
import { TextChannelMessageService } from 'src/messages/text-channel-message.service'
import { parseMessageMentions } from 'src/messages/utils/message-mentions.parser'
import { TextChannelsService } from 'src/text-channels/text-channels.service'
import { UsersService } from 'src/users/users.service'
import { MentionsService } from './mentions.service'
import { Mention } from './models/mentions.model'


@Injectable()
export class MessagesListener {

    constructor(
        private mentionsService: MentionsService,
        private usersService: UsersService,
        private textChannelsService: TextChannelsService,
        private textChannelMessageService: TextChannelMessageService,
    ) {}

    @OnEvent('internal-text-channels.message-sent')
    async sendMentionsOnTextChannelMessageCreated(
        { message, channelId }: InternalTextChannelsMessageSentEvent
    ): Promise<void> {
        console.log(1)
        console.log(1)
        console.log(1)
        console.log(1)
        console.log(1)
        console.log(1)
        const groupId: string = await this.textChannelsService.getGroupIdByTextChannelId(channelId)
        const groupUsersIds = (await this.usersService.getUsersByGroupId(groupId)).map(user => user.id)
        const usersIds: string[] = parseMessageMentions(message.content.text)
            .filter(userId => groupUsersIds.find(groupUserId => groupUserId === userId))
        console.log(groupUsersIds)
        console.log(parseMessageMentions(message.content.text))
        await this.mentionsService.createMentions({
            usersIds,
            groupId,
            messageId: message.id,
            textChannelId: channelId
        })
    }

    @OnEvent('internal-messages.updated')
    async sendOrDeleteMentionsOnTextChannelMessageUpdated(
        { message }: InternalMessagesCudEvent
    ): Promise<void> {
        const mentions: Mention[] = await this.mentionsService.getMentionsByMessageId(message.id)
        const mentionedUsersIdsInUpdatedMessage: string[] = parseMessageMentions(message.content.text)
        const usersIdToCreateMentions: string[] = mentionedUsersIdsInUpdatedMessage
            ?.filter(userId => mentions.find(mention => mention.userId === userId))
        const mentionsToDelete: Mention[] = mentions
            .filter(mention => mentionedUsersIdsInUpdatedMessage
                ?.find(userId => mention.userId === userId)
            )
        if (usersIdToCreateMentions) {
            const channelId: string =
                (await this.textChannelMessageService.getTextChannelMessageRow(message.id)).channelId
            await this.mentionsService.createMentions({
                usersIds: usersIdToCreateMentions,
                groupId: await this.textChannelsService.getGroupIdByTextChannelId(channelId),
                messageId: message.id,
                textChannelId: channelId
            })
        }
        if (mentionsToDelete)
            await this.mentionsService.deleteMentions({ mentions })
    }

    @OnEvent('internal-messages.deleted')
    async deleteMentionsOnTextChannelMessageDeleted(
        { message }: InternalMessagesCudEvent
    ): Promise<void> {
        const mentions: Mention[] = await this.mentionsService.getMentionsByMessageId(message.id)
        await this.mentionsService.deleteMentions({ mentions })
    }

}