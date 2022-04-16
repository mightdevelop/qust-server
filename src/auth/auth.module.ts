import { CacheModule, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { SequelizeModule } from '@nestjs/sequelize'
import { UsersModule } from 'src/users/users.module'
import { User } from 'src/users/models/users.model'
import { JwtAuthStrategy } from 'src/utils/jwt.strategy'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import 'dotenv/config'
import { JwtRefreshStrategy } from 'src/utils/jwt-refresh-strategy'
import * as redisStore from 'cache-manager-redis-store'


@Module({
    controllers: [ AuthController ],
    providers: [
        AuthService,
        JwtAuthStrategy,
        JwtRefreshStrategy
    ],
    imports: [
        CacheModule.registerAsync({
            useFactory: () => ({
                store: redisStore,
                host: process.env.REDIS_HOST,
                port: +process.env.REDIS_PORT,
                ttl: 2592000 // 30 days refresh token
            }),
        }),
        SequelizeModule.forFeature([ User ]),
        JwtModule.register({}),
        PassportModule,
        UsersModule,
    ],
    exports: [ AuthService ],
})

export class AuthModule {}