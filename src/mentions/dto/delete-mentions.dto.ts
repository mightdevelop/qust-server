import { Type } from 'class-transformer'
import { IsOptional, IsUUID, ValidateNested } from 'class-validator'
import { Mention } from '../models/mentions.model'

export class DeleteMentionsDto {

    @ValidateNested({ each: true })
    @Type(() => Mention)
        mentions: Mention[]

    @IsUUID()
    @IsOptional()
        userId?: string

}