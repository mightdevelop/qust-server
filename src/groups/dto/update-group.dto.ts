import { Type } from 'class-transformer'
import { IsString } from 'class-validator'
import { Group } from '../models/groups.model'

export class UpdateGroupDto {

    @Type(() => Group)
        group: Group

    @IsString()
        name: string

}