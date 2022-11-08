import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { UserFromRequest } from 'src/auth/types/request-response'
import { MessageContent } from 'src/messages/models/message-content.model'
import { Message } from 'src/messages/models/messages.model'
import { TextChannelMessageService } from 'src/messages/text-channel-message.service'
import { RequiredGroupPermissions } from 'src/permissions/decorators/required-group-permissions.decorator'
import { CategoryPermissionsGuard } from 'src/permissions/guards/category-permissions.guard'
import { GroupPermissionsGuard } from 'src/permissions/guards/group-permissions.guard'
import { TextChannelPermissionsGuard } from 'src/permissions/guards/text-channel-permissions.guard'
import { RolePermissionsEnum } from 'src/permissions/types/permissions/role-permissions.enum'
import { CreateTextChannelBody } from './dto/create-text-channel.body'
import { TextChannelIdDto } from './dto/text-channel-id.dto'
import { TextDto } from './dto/text.dto'
import { UpdateTextChannelBody } from './dto/update-text-channel.body'
import { TextChannel } from './models/text-channels.model'
import { TextChannelsService } from './text-channels.service'


@ApiTags('text-channels')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('/text-channels')
export class TextChannelsController {

    constructor(
        private textChannelsService: TextChannelsService,
        private textChannelMessageService: TextChannelMessageService,
    ) {}

    @Get('/:textChannelId/messages')
    @UseGuards(TextChannelPermissionsGuard)
    async getMessagesByTextChannelId(
        @Param() { textChannelId }: TextChannelIdDto,
    ): Promise<Message[]> {
        const messages: Message[] =
            await this.textChannelMessageService.getMessagesFromTextChannel(textChannelId, MessageContent)
        return messages
    }

    @Post('/')
    @RequiredGroupPermissions([ RolePermissionsEnum.manageCategoriesAndChannels ])
    @UseGuards(GroupPermissionsGuard)
    async createTextChannel(
        @CurrentUser() user: UserFromRequest,
        @Body() dto: CreateTextChannelBody
    ): Promise<TextChannel> {
        const channel: TextChannel =
            await this.textChannelsService.createTextChannel({ ...dto, userId: user.id })
        return channel
    }

    @Put('/:textChannelId')
    @UseGuards(CategoryPermissionsGuard)
    async updateTextChannel(
        @CurrentUser() user: UserFromRequest,
        @Param() { textChannelId }: TextChannelIdDto,
        @Body() { name }: UpdateTextChannelBody
    ): Promise<TextChannel> {
        const channel: TextChannel = await this.textChannelsService.getTextChannelById(textChannelId)
        if (!channel)
            throw new NotFoundException({ message: 'Text channel not found' })
        const updatedChannel: TextChannel =
            await this.textChannelsService.updateTextChannel({ userId: user.id, name, channel })
        return updatedChannel
    }

    @Delete('/:textChannelId')
    @UseGuards(CategoryPermissionsGuard)
    async deleteTextChannel(
        @CurrentUser() user: UserFromRequest,
        @Param() { textChannelId }: TextChannelIdDto,
    ): Promise<TextChannel> {
        const channel: TextChannel = await this.textChannelsService.getTextChannelById(textChannelId)
        if (!channel)
            throw new NotFoundException({ message: 'Text channel not found' })
        await this.textChannelsService.deleteTextChannel({ userId: user.id, channel })
        return channel
    }

    @Post('/:textChannelId/messages')
    async sendMessageToTextChannel(
        @Param() { textChannelId }: TextChannelIdDto,
        @CurrentUser() user: UserFromRequest,
        @Body() { text }: TextDto
    ): Promise<Message> {
        if (!await this.textChannelsService.getTextChannelById(textChannelId))
            throw new NotFoundException({ message: 'Text channel not found' })
        const message: Message = await this.textChannelMessageService.sendMessageToTextChannel({
            userId: user.id,
            username: user.username,
            textChannelId,
            text
        })
        return message
    }

}