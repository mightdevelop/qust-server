import { IsOptional, IsString, IsUUID } from 'class-validator'

export class BanUserInGroupDto {

    @IsUUID()
        userId: string

    @IsUUID()
        groupId: string

    @IsString()
    @IsOptional()
        banReason?: string

}