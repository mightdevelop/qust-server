import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { StandardGroupLayouts } from 'src/layouts/types/standard-group-layouts'
import { CreateGroupDto } from './dto/create-group.dto'
import { LayoutsService } from '../layouts/layouts.service'
import { Group } from './models/groups.model'
import { GroupUser } from './models/group-user.model'
import { Includeable } from 'sequelize/types'
import { DeleteGroupDto } from './dto/delete-group.dto'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InternalGroupsDeletedEvent } from './events/internal-groups-deleted.event'
import { UsersService } from 'src/users/users.service'
import { UserIdAndGroupIdDto } from 'src/permissions/dto/user-id-and-group-id.dto'


@Injectable()
export class GroupsService {

    constructor(
        private eventEmitter: EventEmitter2,
        private usersService: UsersService,
        private layoutsService: LayoutsService,
        @InjectModel(Group) private groupRepository: typeof Group,
        @InjectModel(GroupUser) private groupUserRepository: typeof GroupUser,
    ) {}

    async getGroupById(groupId: string, include?: Includeable | Includeable[]): Promise<Group> {
        const group: Group = await this.groupRepository.findByPk(groupId, { include })
        return group
    }

    async getGroupsIdsByUserId(userId: string): Promise<string[]> {
        return (await this.groupUserRepository.findAll({ where: { userId } })).map(row => row.groupId)
    }

    async isUserGroupParticipant({ userId, groupId }: UserIdAndGroupIdDto): Promise<boolean> {
        return !!await this.groupUserRepository.findOne({ where: { userId, groupId } })
    }

    async addUserToGroup(dto: UserIdAndGroupIdDto): Promise<GroupUser> {
        const groupUserRow: GroupUser = await this.groupUserRepository.create(dto)
        return groupUserRow
    }

    async removeUserFromGroup(dto: UserIdAndGroupIdDto): Promise<GroupUser> {
        const groupUserRow: GroupUser = await this.groupUserRepository.findOne({ where: { ...dto } })
        if (!groupUserRow)
            throw new NotFoundException({ message: 'User is not a group participant' })
        await groupUserRow.destroy()
        return groupUserRow
    }

    async createGroup(dto: CreateGroupDto): Promise<Group> {
        const group: Group = await this.groupRepository.create(dto)
        await this.layoutsService.createBlacklistRolesCategoriesAndTextChannelsByLayout({
            groupId: group.id,
            groupLayout: StandardGroupLayouts[dto.layout || 'DEFAULT']
        })
        return group
    }

    async deleteGroup({ group }: DeleteGroupDto): Promise<Group> {
        await group.destroy()
        const usersIds: string[] = (await this.usersService.getUsersByGroupId(group.id))
            .map(user => user.id)
        this.eventEmitter.emit(
            'internal-groups.deleted',
            new InternalGroupsDeletedEvent({ groupId: group.id, usersIds })
        )
        return group
    }

}