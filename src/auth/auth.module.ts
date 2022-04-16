import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { SequelizeModule } from '@nestjs/sequelize'
import { UsersModule } from 'src/users/users.module'
import { User } from 'src/users/models/users.model'
import { JwtAuthStrategy } from 'src/utils/jwt.strategy'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import 'dotenv/config'
import { accessConfig } from 'src/jwt-config'


@Module({
    controllers: [ AuthController ],
    providers: [
        AuthService,
        JwtAuthStrategy,
    ],
    imports: [
        // CacheModule.registerAsync({
        //     useFactory: () => ({
        //         store: redisStore,
        //         host: process.env.REDIS_HOST,
        //         port: +process.env.REDIS_PORT,
        //         ttl: 2592000
        //     }),
        // }),
        SequelizeModule.forFeature([ User ]),
        JwtModule.register({
            secret: accessConfig.secret,
            signOptions: { expiresIn: '15m' },
        }),
        PassportModule,
        UsersModule,
    ],
    exports: [ AuthService ],
})

export class AuthModule {}