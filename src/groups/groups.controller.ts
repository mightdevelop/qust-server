import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { RequestResponseUser } from 'src/auth/types/request-response'
import { GroupsService } from './groups.service'
import { Group } from './models/groups.model'
import { GroupLayoutName } from './types/group-layout-names.enum'


@Controller('/groups')
export class GroupsController {

    constructor(
        private groupsService: GroupsService,
    ) {}

    @Post('/')
    @UseGuards(JwtAuthGuard)
    async createGroup(
        @Body() body: { name: string, layout?: GroupLayoutName },
        @CurrentUser() user: RequestResponseUser
    ): Promise<Group> {
        const group: Group = await this.groupsService.createGroup({
            ...body,
            ownerId: user.id,
        })
        return group
    }

}