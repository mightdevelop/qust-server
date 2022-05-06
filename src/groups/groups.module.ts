import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { CategoriesModule } from 'src/categories/categories.module'
import { Category } from 'src/categories/models/categories.model'
import { TextChannel } from 'src/text-channels/models/text-channels.model'
import { GroupsController } from './groups.controller'
import { GroupsService } from './groups.service'
import { LayoutsService } from './layouts.service'
import { GroupUser } from './models/group-user.model'
import { Group } from './models/groups.model'

@Module({
    controllers: [ GroupsController ],
    providers: [ GroupsService, LayoutsService ],
    imports: [
        SequelizeModule.forFeature([ Group, GroupUser, Category, TextChannel ]),
        CategoriesModule
    ],
    exports: [ GroupsService ]
})
export class GroupsModule {}
