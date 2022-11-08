import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { UserFromRequest } from 'src/auth/types/request-response'
import { MessagesService } from 'src/messages/messages.service'
import { Message } from 'src/messages/models/messages.model'
import { PartialOffsetDto } from 'src/users/dto/partial-offset.dto'
import { UnreadMark } from './models/unread-marks.model'
import { UnreadMarksService } from './unread-marks.service'


@ApiTags('unread-marks')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('/unread-marks')
export class UnreadMarksController {

    constructor(
        private unreadMarksService: UnreadMarksService,
        private messagesService: MessagesService,
    ) {}

    @Get('/')
    async getUnreadMarksByUserId(
        @CurrentUser() user: UserFromRequest,
        @Query() { offset }: PartialOffsetDto
    ): Promise<UnreadMark[]> {
        return await this.unreadMarksService.getUnreadMarksByUserId(
            user.id, Message, 30, offset ? Number(offset) : undefined
        )
    }

    @Post('/')
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
    async deleteUnreadMarksByIds(
        @Body() { unreadMarksIds }: { unreadMarksIds: string[] },
    ): Promise<UnreadMark[]> {
        const unreadMarks: UnreadMark[] = await this.unreadMarksService.getUnreadMarksByIds(unreadMarksIds)
        return await this.unreadMarksService.deleteUnreadMarks({ unreadMarks })
    }

}