import { IsString, IsUUID } from 'class-validator'

export class AddActionToAuditLogDto {

    @IsUUID()
        userId: string

    @IsUUID()
        groupId: string

    @IsString()
        body: string

}