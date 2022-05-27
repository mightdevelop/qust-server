import { CacheModule, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { JwtAuthStrategy } from 'src/auth/strategies/jwt-auth.strategy'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import 'dotenv/config'
import { JwtRefreshStrategy } from './strategies/jwt-refresh-strategy'
import { create } from 'cache-manager-redis-store'
import { SocketIoJwtAuthStrategy } from './strategies/socketio-jwt-auth.strategy'


@Module({
    controllers: [ AuthController ],
    providers: [
        AuthService,
        JwtAuthStrategy,
        JwtRefreshStrategy,
        SocketIoJwtAuthStrategy,
    ],
    imports: [
        CacheModule.registerAsync({
            useFactory: () => ({
                store: create({ db: 0 }),
                host: process.env.REDIS_HOST,
                port: +process.env.REDIS_PORT,
                ttl: 2592000 // 30 days refresh token
            }),
        }),
        JwtModule.register({}),
    ],
    exports: [ AuthService ],
})

export class AuthModule {}