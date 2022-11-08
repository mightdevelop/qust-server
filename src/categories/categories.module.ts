import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { PermissionsModule } from 'src/permissions/permissions.module'
import { SocketIoModule } from 'src/socketio/socketio.module'
import { TextChannelsModule } from 'src/text-channels/text-channels.module'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'
import { Category } from './models/categories.model'
import { CategoryRolePermissions } from './models/category-role-permissions.model'

@Module({
    controllers: [ CategoriesController ],
    providers: [
        CategoriesService,
    ],
    imports: [
        SequelizeModule.forFeature([ Category, CategoryRolePermissions ]),
        SocketIoModule,
        forwardRef(() => PermissionsModule),
        forwardRef(() => TextChannelsModule),
    ],
    exports: [ CategoriesService ]
})
export class CategoriesModule {}
