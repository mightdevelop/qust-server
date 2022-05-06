import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { CategoriesModule } from 'src/categories/categories.module'
import { GroupsController } from './groups.controller'
import { GroupsService } from './groups.service'
import { GroupUser } from './models/group-user.model'
import { Group } from './models/groups.model'

@Module({
    controllers: [ GroupsController ],
    providers: [ GroupsService ],
    imports: [
        SequelizeModule.forFeature([ Group, GroupUser ]),
        CategoriesModule
    ],
    exports: [ GroupsService ]
})
export class GroupsModule {}
