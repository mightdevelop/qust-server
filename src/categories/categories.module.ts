import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { TextChannel } from 'src/text-channels/models/text-channels.model'
import { MessagesModule } from 'src/messages/messages.module'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'
import { Category } from './models/categories.model'
import { CategoryRolePermissions } from './models/category-role-permissions.model'

@Module({
    controllers: [ CategoriesController ],
    providers: [ CategoriesService ],
    imports: [
        SequelizeModule.forFeature([ Category, CategoryRolePermissions, TextChannel ]),
        MessagesModule,
    ],
    exports: [ CategoriesService ]
})
export class CategoriesModule {}
