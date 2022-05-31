import { IsString, IsUUID } from 'class-validator'

export class CreateCategoryDto {

    @IsString()
        name: string

    @IsUUID()
        groupId: string

    @IsUUID()
        userId: string

}