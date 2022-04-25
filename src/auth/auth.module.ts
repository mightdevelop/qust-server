import { CacheModule, forwardRef, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { SequelizeModule } from '@nestjs/sequelize'
import { UsersModule } from 'src/users/users.module'
import { User } from 'src/users/models/users.model'
import { JwtAuthStrategy } from 'src/auth/strategies/jwt-auth.strategy'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import 'dotenv/config'
import { JwtRefreshStrategy } from './strategies/jwt-refresh-strategy'
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
        forwardRef(() => PassportModule),
        forwardRef(() => UsersModule),
    ],
    exports: [ AuthService ],
})

export class AuthModule {}