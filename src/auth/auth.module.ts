import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { SequelizeModule } from '@nestjs/sequelize'
import { UsersModule } from 'src/users/users.module'
import { User } from 'src/users/models/users.model'
import { jwtSecret } from 'src/utils/const'
import { JwtStrategy } from 'src/utils/jwt.strategy'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'


@Module({
    controllers: [ AuthController ],
    providers: [
        AuthService,
        JwtStrategy,
    ],
    imports: [
        SequelizeModule.forFeature([ User ]),
        JwtModule.register({
            secret: jwtSecret,
            signOptions: { expiresIn: '15m' },
        }),
        PassportModule,
        UsersModule,
    ],
    exports: [ AuthService ],
})

export class AuthModule {}