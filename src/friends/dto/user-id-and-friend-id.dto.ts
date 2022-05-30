import { IsUUID } from 'class-validator'

export class UserIdAndFriendIdDto {

    @IsUUID()
        userId: string

    @IsUUID()
        friendId: string

}