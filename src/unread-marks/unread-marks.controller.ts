import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { UserFromRequest } from 'src/auth/types/request-response'
import { MessagesService } from 'src/messages/messages.service'
import { Message } from 'src/messages/models/messages.model'
import { UnreadMark } from './models/read-marks.model'
import { UnreadMarksService } from './unread-marks.service'


@Controller('/unread-marks')
export class UnreadMarksController {

    constructor(
        private unreadMarksService: UnreadMarksService,
        private messagesService: MessagesService,
    ) {}

    @Get('/')
    @UseGuards(JwtAuthGuard)
    async getUnreadMarksByUserId(
        @CurrentUser() user: UserFromRequest,
        @Query('offset') offset: number,
    ): Promise<UnreadMark[]> {
        return await this.unreadMarksService.getUnreadMarksByUserId( user.id, Message, 30, offset )
    }

    @Post('/')
    @UseGuards(JwtAuthGuard)
    async createUnreadMark(
        @CurrentUser() user: UserFromRequest,
        @Body() { messageId }: { messageId: string },
    ): Promise<UnreadMark[]> {
        const message: Message = await this.messagesService.getMessageById(messageId)
        const unreadMark: UnreadMark = (await this.unreadMarksService.getUnreadMarkByUserIdAndLocations(
            user.id, [ message.messageLocation ]
        ))[0]
        if (unreadMark)
            return await this.unreadMarksService.updateUnreadMarks({
                messageId: unreadMark.messageId,
                newMessageId: messageId,
                usersIds: [ user.id ]
            })
        return await this.unreadMarksService.createUnreadMarks({
            usersIds: [ user.id ],
            messageId,
            messageLocation: message.messageLocation
        })
    }

    @Delete('/')
    @UseGuards(JwtAuthGuard)
    async deleteUnreadMarksByIds(
        @Body() { unreadMarksIds }: { unreadMarksIds: string[] },
    ): Promise<UnreadMark[]> {
        console.log(unreadMarksIds)
        const unreadMarks: UnreadMark[] = await this.unreadMarksService.getUnreadMarksByIds(unreadMarksIds)
        return await this.unreadMarksService.deleteUnreadMarks({ unreadMarks })
    }

}