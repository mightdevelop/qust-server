import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { FriendsController } from './friends.controller'
import { FriendsService } from './friends.service'
import { Friend } from './models/friends.model'


@Module({
    controllers: [ FriendsController ],
    providers: [
        FriendsService,
    ],
    imports: [
        SequelizeModule.forFeature([ Friend ]),
    ],
    exports: [ FriendsService ]
})

export class FriendsModule {}