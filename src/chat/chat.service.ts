import { Injectable } from '@nestjs/common'
import { AuthService } from '../auth/auth.service'
// import { Socket } from 'socket.io'
// import { WsException } from '@nestjs/websockets'


@Injectable()
export class ChatService {

    constructor(
        private authService: AuthService
    ) {}

    // async getUserFromSocket(socket: Socket) {
    //     const cookie = socket.handshake.headers.cookie
    //     const { Authentication: token } = parse(cookie)
    //     const user = await this.authService.getUserFromToken(token)
    //     if (!user)
    //         throw new WsException('Invalid credentials')
    //     return user
    // }

}