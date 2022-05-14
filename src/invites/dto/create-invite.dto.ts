import { IsNumber, IsOptional, IsUUID, Max, Min } from 'class-validator'

export class CreateInviteDto {

    @IsUUID()
        groupId: string

    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(10000)
        remainingUsages?: number

    @IsNumber()
    @IsOptional()
    @Min(300000)     // 5 mins
    @Max(5097600000) // 2 months
        ttl?: number

}