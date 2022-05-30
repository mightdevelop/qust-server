import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { GroupBlacklistsService } from './group-blacklists.service'
import { GroupBlacklist } from './models/group-blacklists.model'
import { GroupPermissionsGuard } from 'src/permissions/guards/group-permissions.guard'
import { RequiredGroupPermissions } from 'src/permissions/decorators/required-group-permissions.decorator'
import { RolePermissionsEnum } from 'src/permissions/types/permissions/role-permissions.enum'
import { BannedUser } from './models/banned-users.model'
import { GroupsService } from 'src/groups/groups.service'
import { Group } from 'src/groups/models/groups.model'


@Controller('/')
export class GroupBlacklistsController {

    constructor(
        private groupBlacklistsService: GroupBlacklistsService,
        private groupsService: GroupsService,
    ) {}

    @Get('/groups/:groupId/blacklist')
    @RequiredGroupPermissions([ RolePermissionsEnum.banUsers ])
    @UseGuards(JwtAuthGuard, GroupPermissionsGuard)
    async getGroupBlacklistByGroupId(
        @Param('groupId') groupId: string,
    ): Promise<GroupBlacklist> {
        const blacklist: GroupBlacklist =
            await this.groupBlacklistsService.getGroupBlacklistByGroupId(groupId)
        if (!blacklist)
            throw new NotFoundException({ message: 'Blacklist not found' })
        return blacklist
    }

    @Post('/groups/:groupId/blacklist')
    @RequiredGroupPermissions([ RolePermissionsEnum.banUsers ])
    @UseGuards(JwtAuthGuard, GroupPermissionsGuard)
    async banUser(
        @Param('groupId') groupId: string,
        @Body() dto: { userId: string, banReason?: string },
    ): Promise<BannedUser> {
        const group: Group =
            await this.groupsService.getGroupById(groupId)
        if (!group)
            throw new NotFoundException({ message: 'Group not found' })
        const bannedUserRow: BannedUser =
            await this.groupBlacklistsService.addUserToGroupBlacklist({ ...dto, groupId })
        await this.groupsService.removeUserFromGroup({ userId: dto.userId, groupId })
        return bannedUserRow
    }

    @Delete('/groups/:groupId/blacklist')
    @RequiredGroupPermissions([ RolePermissionsEnum.banUsers ])
    @UseGuards(JwtAuthGuard, GroupPermissionsGuard)
    async unBanUser(
        @Param('groupId') groupId: string,
        @Body() { userId }: { userId: string },
    ): Promise<BannedUser> {
        const group: Group =
            await this.groupsService.getGroupById(groupId)
        if (!group)
            throw new NotFoundException({ message: 'Group not found' })
        const bannedUserRow: BannedUser =
            await this.groupBlacklistsService.getBannedUserRowByUserId(userId)
        if (!bannedUserRow)
            throw new BadRequestException({ message: 'User isn\'t banned' })
        await this.groupBlacklistsService.removeUserFromGroupBlacklist(bannedUserRow)
        return bannedUserRow
    }

}