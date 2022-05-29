import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectModel } from '@nestjs/sequelize'
import { CategoriesService } from 'src/categories/categories.service'
import { Category } from 'src/categories/models/categories.model'
import { PermissionsService } from 'src/permissions/permissions.service'
import { User } from 'src/users/models/users.model'
import { UsersService } from 'src/users/users.service'
import { CreateTextChannelDto } from './dto/create-text-channel.dto'
import { DeleteTextChannelDto } from './dto/delete-text-channel.dto'
import { UpdateTextChannelDto } from './dto/update-text-channel.dto'
import { InternalTextChannelsCreatedEvent } from './events/internal-text-channels-created.event'
import { InternalTextChannelsDeletedEvent } from './events/internal-text-channels-deleted.event'
import { InternalTextChannelsUpdatedEvent } from './events/internal-text-channels-updated.event'
import { TextChannel } from './models/text-channels.model'


@Injectable()
export class TextChannelsService {

    constructor(
        private categoriesService: CategoriesService,
        private eventEmitter: EventEmitter2,
        @Inject(forwardRef(() => PermissionsService)) private permissionsService: PermissionsService,
        private usersService: UsersService,
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

    async getAllowedToViewTextChannelsIdsByUserId(userId: string): Promise<string[]> {
        return await this.permissionsService.getAllowedToViewTextChannelsIdsByUserId(userId)
    }

    async getUsersThatCanViewTextChannel(channelId: string): Promise<User[]> {
        const usersIds: string[] =
            await this.permissionsService.getIdsOfUsersThatCanViewTextChannel(channelId)
        const users: User[] = await this.usersService.getUsersByIdsArray(usersIds)
        return users
    }

    async createTextChannel(dto: CreateTextChannelDto): Promise<TextChannel> {
        const channel: TextChannel = await this.channelRepository.create(dto)
        const usersIds: string[] =
            await this.permissionsService.getIdsOfUsersThatCanViewTextChannel(channel.id)
        this.eventEmitter.emit(
            'internal-text-channels.created',
            new InternalTextChannelsCreatedEvent({ channel, usersIds })
        )
        return channel
    }

    async updateTextChannel({ channel, name }: UpdateTextChannelDto): Promise<TextChannel> {
        channel.name = name
        await channel.save()
        const usersIds: string[] =
            await this.permissionsService.getIdsOfUsersThatCanViewTextChannel(channel.id)
        this.eventEmitter.emit(
            'internal-text-channels.updated',
            new InternalTextChannelsUpdatedEvent({ channel, usersIds })
        )
        return channel
    }

    async deleteTextChannel({ channel }: DeleteTextChannelDto): Promise<TextChannel> {
        await channel.destroy()
        const usersIds: string[] =
            await this.permissionsService.getIdsOfUsersThatCanViewTextChannel(channel.id)
        this.eventEmitter.emit(
            'internal-text-channels.deleted',
            new InternalTextChannelsDeletedEvent({ channelId: channel.id, usersIds })
        )
        return channel
    }

}