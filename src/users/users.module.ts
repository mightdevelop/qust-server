import { forwardRef, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { SequelizeModule } from '@nestjs/sequelize'
import { UsersService } from './users.service'
import { User } from './models/users.model'
import { UsersController } from './users.controller'
import { FriendsModule } from 'src/friends/friends.module'


@Module({
    controllers: [ UsersController ],
    providers: [
        UsersService,
    ],
    imports: [
        SequelizeModule.forFeature([ User ]),
        JwtModule.register({}),
        forwardRef(() => FriendsModule)
    ],
    exports: [
        UsersService,
    ]
})

export class UsersModule {}