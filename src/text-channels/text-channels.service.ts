import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CategoriesService } from 'src/categories/categories.service'
import { Category } from 'src/categories/models/categories.model'
import { GroupsService } from 'src/groups/groups.service'
import { PermissionsService } from 'src/permissions/permissions.service'
import { CreateTextChannelDto } from './dto/create-text-channel.dto'
import { DeleteTextChannelDto } from './dto/delete-text-channel.dto'
import { UpdateTextChannelDto } from './dto/update-text-channel.dto'
import { TextChannel } from './models/text-channels.model'


@Injectable()
export class TextChannelsService {

    constructor(
        private categoriesService: CategoriesService,
        private groupsService: GroupsService,
        private permissionsService: PermissionsService,
        @InjectModel(TextChannel) private channelRepository: typeof TextChannel,
    ) {}

    async getTextChannelById(channelId: string): Promise<TextChannel> {
        const channel: TextChannel = await this.channelRepository.findByPk(channelId)
        return channel
    }

    async getGroupIdByTextChannelId(channelId: string): Promise<string> {
        const channel: TextChannel = await this.channelRepository.findByPk(channelId)
        if (!channel)
            throw new NotFoundException({ message: 'Text channel not found' })
        const category: Category = await this.categoriesService.getCategoryById(channel.categoryId)
        return category.groupId
    }

    async getAllowedToViewTextChannelsIds(userId: string): Promise<string[]> {
        const groupIds: string[] = await this.groupsService.getGroupsIdsByUserId(userId)
        const allowedToViewTextChannelsIds: string[] = []
        for (const groupId of groupIds) {
            const channeldIds: string[] =
                await this.permissionsService.getAllowedToViewTextChannelsIdsInGroup({ userId, groupId })
            allowedToViewTextChannelsIds.push(...channeldIds)
        }
        return allowedToViewTextChannelsIds
    }

    async createTextChannel(dto: CreateTextChannelDto): Promise<TextChannel> {
        const channel: TextChannel = await this.channelRepository.create(dto)
        return channel
    }

    async updateTextChannel({ channel, name }: UpdateTextChannelDto): Promise<TextChannel> {
        channel.name = name
        await channel.save()
        return channel
    }

    async deleteTextChannel({ channel }: DeleteTextChannelDto): Promise<TextChannel> {
        await channel.destroy()
        return channel
    }

}