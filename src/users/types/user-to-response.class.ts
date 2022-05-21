import { IsString, IsUUID } from 'class-validator'

export class UserToResponse {

    @IsUUID()
        id: string

    @IsString()
        username: string

    @IsString()
        info: string

}