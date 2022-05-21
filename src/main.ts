import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import 'dotenv/config'
import { AppModule } from './app.module'
import { RedisIoAdapter } from './chats/adapters/redis-io.adapter'


async function start() {
    try {
        const app = await NestFactory.create(AppModule)
        app.enableCors()
        app.useGlobalPipes(new ValidationPipe())
        const redisIoAdapter = new RedisIoAdapter(app)
        await redisIoAdapter.connectToRedis()
        app.useWebSocketAdapter(redisIoAdapter)

        await app.listen(process.env.PORT, () => console.log('Server started on PORT ' + process.env.PORT))
    }
    catch (error) {
        console.log(error)
    }
}
start()