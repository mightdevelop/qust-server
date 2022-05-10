import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { MessagesModule } from 'src/messages/messages.module'
import { PermissionsModule } from 'src/permissions/permissions.module'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'
import { Category } from './models/categories.model'
import { CategoryRolePermissions } from './models/category-role-permissions.model'

@Module({
    controllers: [ CategoriesController ],
    providers: [ CategoriesService ],
    imports: [
        SequelizeModule.forFeature([ Category, CategoryRolePermissions ]),
        MessagesModule,
        PermissionsModule
    ],
    exports: [ CategoriesService ]
})
export class CategoriesModule {}
