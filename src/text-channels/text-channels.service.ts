import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CategoriesService } from 'src/categories/categories.service'
import { Category } from 'src/categories/models/categories.model'
import { CreateTextChannelDto } from './dto/create-text-channel.dto'
import { DeleteTextChannelDto } from './dto/delete-text-channel.dto'
import { UpdateTextChannelDto } from './dto/update-text-channel.dto'
import { TextChannel } from './models/text-channels.model'


@Injectable()
export class TextChannelsService {

    constructor(
        private categoriesService: CategoriesService,
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

    async createTextChannel(dto: CreateTextChannelDto): Promise<TextChannel> {
        const channel: TextChannel = await this.channelRepository.create(dto)
        return channel
    }

    async updateTextChannel({ channel, name }: UpdateTextChannelDto): Promise<TextChannel> {
        await channel.update({ name })
        return channel
    }

    async deleteTextChannel({ channel }: DeleteTextChannelDto): Promise<TextChannel> {
        await channel.destroy()
        return channel
    }

}