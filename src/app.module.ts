import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from './users/models/users.model'
import 'dotenv/config'
import { AuthModule } from './auth/auth.module'
import { Friend } from './friends/models/friends.model'
import { Notification } from './notifications/models/notifications.model'


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
                Friend,
                Notification,
            ],
            autoLoadModels: true,
        }),
        AuthModule,
        // ChatModule,
    ],
    providers: [ AppService ],
})
export class AppModule {}
