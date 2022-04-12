import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { SequelizeModule } from '@nestjs/sequelize'
import { jwtSecret } from 'src/utils/const'
import { UsersService } from './users.service'
import { User } from './models/users.model'
import { UsersController } from './users.controller'


@Module({
    controllers: [ UsersController ],
    providers: [
        UsersService,
    ],
    imports: [
        SequelizeModule.forFeature([ User ]),
        JwtModule.register({
            secret: jwtSecret,
            signOptions: { expiresIn: '15m' },
        }),
    ],
    exports: [
        UsersService,
    ]
})

export class UsersModule {}