import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { RedisIoAdapter } from './socketio/adapters/redis-io.adapter'


async function start() {
    try {
        const app = await NestFactory.create(AppModule)
        app.enableCors()
        app.useGlobalPipes(new ValidationPipe())
        const redisIoAdapter = new RedisIoAdapter(app)
        await redisIoAdapter.connectToRedis()
        app.useWebSocketAdapter(redisIoAdapter)
        const PORT = process.env.APP_PORT
        await app.listen(PORT, () => console.log('Server started on PORT ' + PORT))
    }
    catch (error) {
        console.log(error)
    }
}
start()