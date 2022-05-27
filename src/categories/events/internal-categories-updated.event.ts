import { Type } from 'class-transformer'
import { IsArray, IsUUID, ValidateNested } from 'class-validator'
import { Category } from 'src/categories/models/categories.model'

export class InternalCategoriesUpdatedEvent {

    constructor({ category, usersIds }: InternalCategoriesUpdatedEventArgs) {
        this.category = category
        this.usersIds = usersIds
    }

    category: Category

    usersIds: string[]

}

class InternalCategoriesUpdatedEventArgs {

    @Type(() => Category)
        category: Category

    @IsArray()
    @ValidateNested({ each: true })
    @IsUUID()
        usersIds: string[]

}