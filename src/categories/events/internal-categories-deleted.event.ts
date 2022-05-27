import { IsArray, IsUUID, ValidateNested } from 'class-validator'

export class InternalCategoriesDeletedEvent {

    constructor({ categoryId, usersIds }: InternalCategoriesDeletedEventArgs) {
        this.categoryId = categoryId
        this.usersIds = usersIds
    }

    categoryId: string

    usersIds: string[]

}

class InternalCategoriesDeletedEventArgs {

    @IsUUID()
        categoryId: string

    @IsArray()
    @ValidateNested({ each: true })
    @IsUUID()
        usersIds: string[]

}