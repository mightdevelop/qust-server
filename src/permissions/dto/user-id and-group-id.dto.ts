import { IsUUID } from 'class-validator'

export class UserIdAndGroupIdDto {

    @IsUUID()
        userId: string

    @IsUUID()
        groupId: string

}