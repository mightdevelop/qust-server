import { IsNumber } from 'class-validator'

export class CreateDialogueDto {

    @IsNumber()
        firstChatterId: number

    @IsNumber()
        secondChatterId: number

}