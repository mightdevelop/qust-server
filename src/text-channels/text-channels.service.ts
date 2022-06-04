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
import { InternalTextChannelsCudEvent } from './events/internal-text-channels.CUD.event'
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
            await this.permissionsService.getIdsOfUsersThatCanViewTextChannel(channel.id, dto.groupId)
        this.eventEmitter.emit(
            'internal-text-channels.created',
            new InternalTextChannelsCudEvent({
                userIdWhoTriggered: dto.userId,
                groupId: dto.groupId,
                channel,
                usersIds,
                action: 'create'
            })
        )
        return channel
    }

    async updateTextChannel(dto: UpdateTextChannelDto): Promise<TextChannel> {
        dto.channel.name = dto.name
        await dto.channel.save()
        const usersIds: string[] =
            await this.permissionsService.getIdsOfUsersThatCanViewTextChannel(dto.channel.id, dto.groupId)
        this.eventEmitter.emit(
            'internal-text-channels.updated',
            new InternalTextChannelsCudEvent({
                userIdWhoTriggered: dto.userId,
                groupId: dto.groupId,
                channel: dto.channel,
                usersIds,
                action: 'update'
            })
        )
        return dto.channel
    }

    async deleteTextChannel(dto: DeleteTextChannelDto): Promise<TextChannel> {
        await dto.channel.destroy()
        const usersIds: string[] =
            await this.permissionsService.getIdsOfUsersThatCanViewTextChannel(dto.channel.id, dto.groupId)
        this.eventEmitter.emit(
            'internal-text-channels.deleted',
            new InternalTextChannelsCudEvent({
                userIdWhoTriggered: dto.userId,
                groupId: dto.groupId,
                channel: dto.channel,
                usersIds,
                action: 'delete'
            })
        )
        return dto.channel
    }

}