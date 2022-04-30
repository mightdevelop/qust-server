import { IsString, MaxLength, MinLength } from 'class-validator'

export class SendFriendshipRequestNotificationDto {
    @IsString()
    @MinLength(4)
    @MaxLength(25)
        requesterUsername: string
}