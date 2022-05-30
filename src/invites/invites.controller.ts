import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { UserFromRequest } from 'src/auth/types/request-response'
import { GroupBlacklistsService } from 'src/group-blacklists/group-blacklists.service'
import { BannedUser } from 'src/group-blacklists/models/banned-users.model'
import { GroupsService } from 'src/groups/groups.service'
import { Group } from 'src/groups/models/groups.model'
import { RequiredGroupPermissions } from 'src/permissions/decorators/required-group-permissions.decorator'
import { GroupPermissionsGuard } from 'src/permissions/guards/group-permissions.guard'
import { RolePermissionsEnum } from 'src/permissions/types/permissions/role-permissions.enum'
import { User } from 'src/users/models/users.model'
import { UsersService } from 'src/users/users.service'
import { CreateInviteDto } from './dto/create-invite.dto'
import { InvitesService } from './invites.service'
import { Invite } from './models/invites.model'


@Controller('/invites')
export class InvitesController {

    constructor(
        private invitesService: InvitesService,
        private groupsService: GroupsService,
        private usersService: UsersService,
        private groupBlacklistsService: GroupBlacklistsService,
    ) {}

    @Get('/')
    @RequiredGroupPermissions([ RolePermissionsEnum.manageGroup ])
    @UseGuards(JwtAuthGuard, GroupPermissionsGuard)
    async getInvitesByGroupId(
        @Body() { groupId }: { groupId: string }
    ): Promise<Invite[]> {
        const invites: Invite[] = await this.invitesService.getInvitesByGroupId(groupId)
        return invites
    }

    @Post('/')
    @RequiredGroupPermissions([ RolePermissionsEnum.inviteUsers ])
    @UseGuards(JwtAuthGuard, GroupPermissionsGuard)
    async createInvite(
        @Body() dto: CreateInviteDto
    ): Promise<Invite> {
        const group: Group = await this.groupsService.getGroupById(dto.groupId)
        if (!group)
            throw new NotFoundException({ message: 'Group not found' })
        const invite: Invite = await this.invitesService.createInvite(dto)
        return invite
    }

    @Post('/:inviteId')
    @UseGuards(JwtAuthGuard)
    async useInvite(
        @Param('inviteId') inviteId: string,
        @CurrentUser() user: UserFromRequest
    ): Promise<string> {
        const invite: Invite = await this.invitesService.getInviteById(inviteId)
        if (!invite)
            throw new NotFoundException({ message: 'Invite not found' })
        const bannedUserRow: BannedUser =
            await this.groupBlacklistsService.getBannedUserRowByUserId(user.id)
        if (bannedUserRow)
            throw new BadRequestException({ message: 'You are banned in this group' })
        const groupUsers: User[] = await this.usersService.getUsersByGroupId(invite.groupId)
        if (groupUsers.map(u => u.id).includes(user.id))
            throw new BadRequestException({ message: 'You are already a group participant' })
        await this.groupsService.addUserToGroup({ userId: user.id, groupId: invite.groupId })
        return invite.groupId
    }

}