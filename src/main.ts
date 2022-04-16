import { NestFactory } from '@nestjs/core'
import 'dotenv/config'
import { AppModule } from './app.module'


async function start() {
    try {
        const app = await NestFactory.create(AppModule)
        app.enableCors()
        await app.listen(process.env.PORT, () => console.log('Server started on PORT ' + process.env.PORT))
    }
    catch (error) {
        console.log(error)
    }
}
start()