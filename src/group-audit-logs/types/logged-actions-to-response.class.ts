import { Type } from 'class-transformer'
import { IsOptional, IsString, IsUUID } from 'class-validator'
import { UserToResponse } from 'src/users/types/user-to-response.class'

export class LoggedActionToResponse {

    @IsUUID()
        id: string

    @Type(() => UserToResponse)
    @IsOptional()
        user?: UserToResponse

    @IsString()
        body: string

}