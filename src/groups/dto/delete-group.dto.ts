import { Type } from 'class-transformer'
import { Group } from '../models/groups.model'

export class DeleteGroupDto {

    @Type(() => Group)
        group: Group

}