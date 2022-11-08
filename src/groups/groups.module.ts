import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { GroupsController } from './groups.controller'
import { GroupsService } from './groups.service'
import { GroupUser } from './models/group-user.model'
import { Group } from './models/groups.model'
import { LayoutsModule } from 'src/layouts/layouts.module'
import { RolesModule } from 'src/roles/roles.module'
import { CategoriesModule } from 'src/categories/categories.module'

@Module({
    controllers: [ GroupsController ],
    providers: [ GroupsService ],
    imports: [
        SequelizeModule.forFeature([ Group, GroupUser ]),
        LayoutsModule,
        forwardRef(() => RolesModule),
        forwardRef(() => CategoriesModule),
    ],
    exports: [ GroupsService ]
})
export class GroupsModule {}
