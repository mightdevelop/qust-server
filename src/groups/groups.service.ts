import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { StandardGroupLayouts } from 'src/layouts/types/standard-group-layouts'
import { CreateGroupDto } from './dto/create-group.dto'
import { LayoutsService } from '../layouts/layouts.service'
import { Group } from './models/groups.model'


@Injectable()
export class GroupsService {

    constructor(
        private layoutsService: LayoutsService,
        @InjectModel(Group) private groupRepository: typeof Group,
    ) {}

    async getGroupById(groupId: string): Promise<Group> {
        const group: Group = await this.groupRepository.findByPk(groupId)
        return group
    }

    async createGroup(dto: CreateGroupDto): Promise<Group> {
        const group: Group = await this.groupRepository.create(dto)
        await this.layoutsService.createRolesCategoriesAndTextChannelsByLayout({
            groupId: group.id,
            groupLayout: StandardGroupLayouts[dto.layout ? dto.layout : 'DEFAULT']
        })
        return group
    }

}