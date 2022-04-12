import { UseGuards } from '@nestjs/common'
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'socket.io'
import { WsJwtGuard } from 'src/auth/guards/ws.guard'


@WebSocketGateway()
export class ChatGateway {

    @WebSocketServer()
        server: Server

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('send_message')
    messageHandler(@MessageBody() data: string) {
        this.server.sockets.emit('receive_message', data)
    }

}