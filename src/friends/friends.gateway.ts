import { OnEvent } from '@nestjs/event-emitter'
import {
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'socket.io'
import { InternalFriendRequestsCudEvent } from './events/internal-friend-requests.CUD.event'
import { InternalFriendsCudEvent } from './events/internal-friends.CUD.event'


@WebSocketGateway(8080, { cors: { origin: '*' }, namespace: '/friends' })
export class FriendsGateway {

    @WebSocketServer()
        server: Server

    @OnEvent('internal-friend-requests.created')
    @OnEvent('internal-friend-requests.deleted')
    async onFriendRequestsCudEvents(event: InternalFriendRequestsCudEvent): Promise<void> {
        this.server
            .to([ event.requestedUserId, event.respondingUserId ])
            .emit(`friendship-request-${event.action}d`, [ event.requestedUserId, event.respondingUserId ])
    }

    @OnEvent('internal-friends.created')
    @OnEvent('internal-friends.deleted')
    async onFriendsCudEvents(event: InternalFriendsCudEvent): Promise<void> {
        this.server
            .to(event.friendsIds)
            .emit(`friend-${event.action}d`, event.friendsIds)
    }

}