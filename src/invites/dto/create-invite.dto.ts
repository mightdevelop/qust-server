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
    @Min(300)     // 5 mins
    @Max(5097600) // 2 months
        ttl?: number

}