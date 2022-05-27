import { IsArray, IsUUID, ValidateNested } from 'class-validator'

export class InternalGroupsDeletedEvent {

    constructor({ groupId, usersIds }: InternalGroupsDeletedEventArgs) {
        this.groupId = groupId
        this.usersIds = usersIds
    }

    groupId: string

    usersIds: string[]

}

class InternalGroupsDeletedEventArgs {

    @IsUUID()
        groupId: string

    @IsArray()
    @ValidateNested({ each: true })
    @IsUUID()
        usersIds: string[]

}