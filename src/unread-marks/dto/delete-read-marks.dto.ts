import { Type } from 'class-transformer'
import { IsArray, ValidateNested } from 'class-validator'
import { UnreadMark } from '../models/read-marks.model'

export class DeleteUnreadMarksDto {

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UnreadMark)
        unreadMarks: UnreadMark[]

}