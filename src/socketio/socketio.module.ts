import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ConnectedSocket } from './models/connected-socket.model'
import { SocketIoService } from './socketio.service'

@Module({
    providers: [ SocketIoService ],
    imports: [
        SequelizeModule.forFeature([ ConnectedSocket ]),
    ],
    exports: [ SocketIoService ]
})
export class SocketIoModule {}