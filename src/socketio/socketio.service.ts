import { Injectable } from '@nestjs/common'
import { IsString, IsUUID } from 'class-validator'
import { RemoteSocket } from 'socket.io'


@Injectable()
export class SocketIoService {

    private clients: { userId: string, socketId: string }[] = []

    async getClients(): Promise<UserIdAndSocketId[]> {
        return this.clients
    }

    async getClientsByUsersIds(usersIds: string[]) {
        return this.clients.filter(client => usersIds.some(userId => userId === client.userId))
    }

    async getClientsBySocketsIds(socketsIds: string[]): Promise<UserIdAndSocketId[]> {
        return this.clients.filter(client => socketsIds.some(socketId => socketId === client.socketId))
    }

    async getSocketsByUsersIds(
        sockets: RemoteSocket<any, any>[],
        socketsIds: string[]
    ): Promise<RemoteSocket<any, any>[]> {
        return this.clients
            .filter(client => socketsIds.some(socketId => socketId === client.socketId))
            .map(client => sockets.find(socket => socket.id === client.socketId))
    }

    async pushClient(client: UserIdAndSocketId): Promise<void> {
        this.clients.push(client)
    }

    async removeClient(socketId: string): Promise<void> {
        this.clients.filter(client => client.socketId = socketId)
    }

}

class UserIdAndSocketId {

    @IsUUID()
        userId: string

    @IsString()
        socketId: string

}