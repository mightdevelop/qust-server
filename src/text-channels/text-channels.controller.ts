import { Body, Controller, Delete, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { RequiredPermissions } from 'src/permissions/decorators/required-permissions.decorator'
import { CategoryPermissionsGuard } from 'src/permissions/guards/category-permissions.guard'
import { GroupPermissionsGuard } from 'src/permissions/guards/group-permissions.guard'
import { RolePermissionsEnum } from 'src/permissions/types/permissions/role-permissions.enum'
import { CreateTextChannelDto } from './dto/create-text-channel.dto'
import { TextChannel } from './models/text-channels.model'
import { TextChannelsService } from './text-channels.service'


@Controller('/text-channels')
export class TextChannelsController {

    constructor(
        private textChannelsService: TextChannelsService,
    ) {}

    @Post('/')
    @RequiredPermissions([ RolePermissionsEnum.manageCategoriesAndChannels ])
    @UseGuards(JwtAuthGuard, GroupPermissionsGuard)
    async createTextChannel(
        @Body() dto: CreateTextChannelDto
    ): Promise<TextChannel> {
        const channel: TextChannel = await this.textChannelsService.createTextChannel(dto)
        return channel
    }

    @Put('/:channelId')
    @UseGuards(JwtAuthGuard, CategoryPermissionsGuard)
    async updateTextChannel(
        @Param('channelId') channelId: string,
        @Body() { name }: { name: string }
    ): Promise<TextChannel> {
        const channel: TextChannel = await this.textChannelsService.getTextChannelById(channelId)
        if (!channel)
            throw new NotFoundException({ message: 'Text channel not found' })
        const updatedChannel: TextChannel =
            await this.textChannelsService.updateTextChannel({ name, channel })
        return updatedChannel
    }

    @Delete('/:channelId')
    @UseGuards(JwtAuthGuard, CategoryPermissionsGuard)
    async deleteTextChannel(
        @Param('channelId') channelId: string
    ): Promise<TextChannel> {
        const channel: TextChannel = await this.textChannelsService.getTextChannelById(channelId)
        if (!channel)
            throw new NotFoundException({ message: 'Text channel not found' })
        await this.textChannelsService.deleteTextChannel({ channel })
        return channel
    }

}