import { UseGuards } from '@nestjs/common'
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'socket.io'
import { WsJwtAuthGuard } from 'src/auth/guards/ws.guard'


@WebSocketGateway()
export class ChatGateway {

    @WebSocketServer()
        server: Server

    @UseGuards(WsJwtAuthGuard)
    @SubscribeMessage('send_message')
    messageHandler(@MessageBody() data: string) {
        this.server.sockets.emit('receive_message', data)
    }

}