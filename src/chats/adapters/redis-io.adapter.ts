import { IoAdapter } from '@nestjs/platform-socket.io'
import { ServerOptions } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'
import 'dotenv/config'

export class RedisIoAdapter extends IoAdapter {
    private adapterConstructor: ReturnType<typeof createAdapter>

    async connectToRedis(): Promise<void> {
        const pubClient = createClient({
            url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
        })
        const subClient = pubClient.duplicate()

        this.adapterConstructor = createAdapter(pubClient, subClient)
    }

    createIOServer(port: number, options?: ServerOptions): any {
        const server = super.createIOServer(port, options)
        server.adapter(this.adapterConstructor)
        return server
    }
}