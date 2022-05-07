import { IsUUID } from 'class-validator'

export class CreateDialogueDto {

    @IsUUID()
        firstChatterId: string

    @IsUUID()
        secondChatterId: string

}