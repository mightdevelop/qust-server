import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { RequestResponseUser } from 'src/auth/types/request-response'
import { User } from 'src/users/models/users.model'
import { UsersService } from 'src/users/users.service'
import { GroupsService } from './groups.service'
import { Group } from './models/groups.model'
import { GroupLayoutName } from './types/group-layout-names.enum'


@Controller('/groups')
export class GroupsController {

    constructor(
        private groupsService: GroupsService,
        private usersService: UsersService,
    ) {}

    @Get('/:groupId/users')
    @UseGuards(JwtAuthGuard)
    async getUsersByGroupId(
        @Param('groupId') groupId: string
    ): Promise<User[]> {
        const users: User[] = await this.usersService.getUsersByGroupId(groupId)
        return users
    }

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
        await this.groupsService.addUserToGroup({ userId: user.id, groupId: group.id })
        return group
    }

}