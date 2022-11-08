import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { RedisIoAdapter } from './socketio/adapters/redis-io.adapter'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function start() {
    try {
        const app = await NestFactory.create(AppModule)
        app.enableCors()
        app.useGlobalPipes(new ValidationPipe())
        const redisIoAdapter = new RedisIoAdapter(app)
        await redisIoAdapter.connectToRedis()
        app.useWebSocketAdapter(redisIoAdapter)
        const PORT = process.env.APP_PORT

        const config = new DocumentBuilder()
            .setTitle('API')
            .setVersion('1.0')
            .addBearerAuth(
                {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    name: 'JWT',
                    description: 'Enter JWT token',
                    in: 'header',
                },
                'jwt'
            )
            .build()
        const document = SwaggerModule.createDocument(app, config)
        SwaggerModule.setup('api', app, document)

        await app.listen(PORT, () => console.log('Server started on PORT ' + PORT))
    }
    catch (error) {
        console.log(error)
    }
}
start()