import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { UnreadMark } from '../models/unread-marks.model'

export class DeleteUnreadMarksDto {

    @ValidateNested({ each: true })
    @Type(() => UnreadMark)
        unreadMarks: UnreadMark[]

}