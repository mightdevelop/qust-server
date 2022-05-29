import { Module } from '@nestjs/common'
import { SocketIoService } from './socketio.service'

@Module({
    providers: [ SocketIoService ],
    imports: [],
    exports: [ SocketIoService ]
})
export class SocketIoModule {}