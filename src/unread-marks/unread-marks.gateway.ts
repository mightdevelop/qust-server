import { UseGuards } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { SocketIoCurrentUser } from 'src/auth/decorators/socket.io-current-user.decorator'
import { SocketIoJwtAuthGuard } from 'src/auth/guards/socket.io-jwt.guard'
import { UserFromRequest } from 'src/auth/types/request-response'
import { MessagesService } from 'src/messages/messages.service'
import { SocketIoService } from 'src/socketio/socketio.service'
import { InternalUnreadMarksCudEvent } from './events/internal-read-marks.CUD.event'
import { UnreadMark } from './models/unread-marks.model'
import { UnreadMarksService } from './unread-marks.service'

@WebSocketGateway(8080, { cors: { origin: '*' }, namespace: '/unread-marks' })
export class UnreadMarksGateway {

    constructor(
        private socketIoService: SocketIoService,
        private unreadMarksService: UnreadMarksService,
        private messagesService: MessagesService,
    ) {}

    @WebSocketServer()
        server: Server

    @SubscribeMessage('add-unread-marks')
    @UseGuards(SocketIoJwtAuthGuard)
    async createUnreadMarks(
        @SocketIoCurrentUser() user: UserFromRequest,
        @ConnectedSocket() socket: Socket,
        @MessageBody() { messagesIds }: { messagesIds: string[] }
    ): Promise<void> {
        const messagesLocations = (await this.messagesService.getMessagesByIds(messagesIds))
            ?.map(message => message.messageLocation)
        const unreadMarks: UnreadMark[] =
            await this.unreadMarksService.getUnreadMarkByUserIdAndLocations(user.id, messagesLocations)
        if (!unreadMarks.length) {
            socket.emit('404', 'Unread marks not found')
            return
        }
        await this.unreadMarksService.deleteUnreadMarks({ unreadMarks })
    }

    @SubscribeMessage('remove-unread-marks')
    @UseGuards(SocketIoJwtAuthGuard)
    async deleteUnreadMarks(
        @SocketIoCurrentUser() user: UserFromRequest,
        @ConnectedSocket() socket: Socket,
        @MessageBody() { unreadMarksIds }: { unreadMarksIds: string[] }
    ): Promise<void> {
        const unreadMarks: UnreadMark[] = await this.unreadMarksService.getUnreadMarksByIds(unreadMarksIds)
        if (!unreadMarks.length) {
            socket.emit('404', 'Unread marks not found')
            return
        }
        await this.unreadMarksService.deleteUnreadMarks({ unreadMarks })
    }

    @OnEvent('internal-unread-marks.created')
    async showToSocketsNewUnreadMarks(event: InternalUnreadMarksCudEvent): Promise<void> {
        const socketsOfMentionRecipients = (await this.socketIoService.getSocketsByUsersIds(
            (await this.server.fetchSockets()),
            event.usersIds
        ))
        this.server
            .to(socketsOfMentionRecipients.map(socket => socket.id))
            .emit('unread-mark-created', event.unreadMarks[0])
    }

    @OnEvent('internal-unread-marks.updated')
    async showToSocketsUpdatedUnreadMarks(event: InternalUnreadMarksCudEvent): Promise<void> {
        const socketsOfMentionRecipients = await this.socketIoService.getSocketsByUsersIds(
            (await this.server.fetchSockets()),
            event.usersIds
        )
        this.server
            .to(socketsOfMentionRecipients.map(socket => socket.id))
            .emit('unread-mark-deleted', event.unreadMarks)
    }

    @OnEvent('internal-unread-marks.deleted')
    async hideFromSocketsDeletedUnreadMarks(event: InternalUnreadMarksCudEvent): Promise<void> {
        const socketsOfMentionRecipients = await this.socketIoService.getSocketsByUsersIds(
            (await this.server.fetchSockets()),
            event.usersIds
        )
        this.server
            .to(socketsOfMentionRecipients.map(socket => socket.id))
            .emit('unread-mark-deleted', event.unreadMarks)
    }

}