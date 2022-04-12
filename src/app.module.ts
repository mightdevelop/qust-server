import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ChatModule } from './chat/chat.module'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from './users/models/users.model'
import 'dotenv/config'


@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `@${process.env.NODE_ENV}.env`,
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: +process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USER,
            password: String(process.env.POSTGRES_PASSWORD),
            database: process.env.POSTGRES_DB,
            models: [
                User,
            ],
            autoLoadModels: true,
        }),
        ChatModule,
    ],
    controllers: [ AppController ],
    providers: [ AppService ],
})
export class AppModule {}
