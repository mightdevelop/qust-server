import { UseGuards } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { JwtService } from '@nestjs/jwt'
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { SocketIoCurrentUser } from 'src/auth/decorators/socket.io-current-user.decorator'
import { SocketIoJwtAuthGuard } from 'src/auth/guards/socket.io-jwt.guard'
import { UserFromRequest } from 'src/auth/types/request-response'
import { TokenPayload } from 'src/auth/types/tokenPayload'
import { SocketIoService } from 'src/socketio/socketio.service'
import { InternalMentionsCudEvent } from './events/internal-mentions.CUD.event'
import { MentionsService } from './mentions.service'
import { Mention } from './models/mentions.model'


@WebSocketGateway(8080, { cors: { origin: '*' }, namespace: '/mentions' })
export class RolesGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private socketIoService: SocketIoService,
        private mentionsService: MentionsService,
        private jwtService: JwtService,
    ) {}

    @WebSocketServer()
        server: Server

    async handleConnection(@ConnectedSocket() socket: Socket) {
        const { id } = this.jwtService.decode(
            socket.handshake.query['access_token'].toString()
        ) as TokenPayload
        await this.socketIoService.pushClient({ userId: id, socketId: socket.id })
        socket.emit('200', socket.id)
    }
    async handleDisconnect(@ConnectedSocket() socket: Socket) {
        await this.socketIoService.removeClient(socket.id)
    }

    @SubscribeMessage('remove-mentions')
    @UseGuards(SocketIoJwtAuthGuard)
    async deleteMentions(
        @SocketIoCurrentUser() user: UserFromRequest,
        @ConnectedSocket() socket: Socket,
        @MessageBody() { mentionsIds }: { mentionsIds: string[] }
    ): Promise<void> {
        const mentions: Mention[] = await this.mentionsService.getMentionsByIds(mentionsIds)
        if (!mentions.length) {
            socket.emit('404', 'Mentions not found')
            return
        }
        await this.mentionsService.deleteMentions({ mentions, userId: user.id })
    }

    @OnEvent('internal-mentions.created')
    async showToSocketsNewMention(event: InternalMentionsCudEvent): Promise<void> {
        const socketsOfMentionRecipients = (await this.socketIoService.getSocketsByUsersIds(
            (await this.server.fetchSockets()),
            event.usersIds
        ))
        this.server
            .to(socketsOfMentionRecipients.map(socket => socket.id))
            .emit('mention-created', event.mentions[0])
    }

    @OnEvent('internal-mentions.deleted')
    async hideFromSocketsDeletedMentions(event: InternalMentionsCudEvent): Promise<void> {
        const socketsOfMentionRecipients = await this.socketIoService.getSocketsByUsersIds(
            (await this.server.fetchSockets()),
            event.usersIds
        )
        this.server
            .to(socketsOfMentionRecipients.map(socket => socket.id))
            .emit('mention-deleted', event.mentions)
    }

}