import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Socket } from 'socket.io'
import { ConnectedSocket } from './models/connected-socket.model'


@Injectable()
export class SocketIoService {

    constructor(
        @InjectModel(ConnectedSocket) private socketRepository: typeof ConnectedSocket
    ) {}

    async getConnectedSockets(): Promise<ConnectedSocket[]> {
        return await this.socketRepository.findAll()
    }

    async getUserIdBySocket(socket: Socket): Promise<string> {
        return (await this.socketRepository.findOne({ where: { socket } })).userId
    }

    async pushSocket(dto: { userId: string, socket: Socket }): Promise<void> {
        await this.socketRepository.create(dto)
    }

    async popSocket(socket: Socket): Promise<void> {
        await this.socketRepository.destroy({ where: { socket } })
    }

}