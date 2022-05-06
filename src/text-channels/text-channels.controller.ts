import { Controller } from '@nestjs/common'
import { TextChannelsService } from './text-channels.service'


@Controller('/channels')
export class TextChannelsController {

    constructor(
        private textChannelsService: TextChannelsService,
    ) {}

    // @Post('/')
    // @UseGuards(JwtAuthGuard)
    // async createChat(
    //     @Body() createChatDto: CreateChatDto,
    //     @CurrentUser() user: RequestResponseUser
    // ): Promise<Chat> {
    //     const chat: Chat = await this.chatsService.createChat({
    //         ...createChatDto, chattersIds: [ ...createChatDto.chattersIds, user.id ]
    //     })
    //     const chatters: User[] = await this.usersService.getChattersByChatId(chat.id)
    //     const sendChatMessageDto: SendChatMessageDto = {
    //         userId: StandartBots.CHAT_BOT.id,
    //         username: StandartBots.CHAT_BOT.username,
    //         chatId: chat.id,
    //         content: {
    //             text: addUsersMessageContent(user.username, chatters.map(chatter => chatter.username))
    //         }
    //     }
    //     await this.chatMessageService.sendMessageToChat(sendChatMessageDto)
    //     return chat
    // }

    // @Put('/')
    // @UseGuards(JwtAuthGuard)
    // async updateChat(
    //     @Body() dto: UpdateChatDto,
    //     @CurrentUser() user: RequestResponseUser
    // ): Promise<Chat> {
    //     isUserChatParticipantValidate(user.id, dto.chatId)
    //     const chat: Chat = await this.chatsService.updateChat(dto)
    //     return chat
    // }

    // @Post('/:id')
    // @UseGuards(JwtAuthGuard)
    // async addUsersToChat(
    //     @Param('id') chatId: number,
    //     @Body() { chattersIds }: { chattersIds: number[] },
    //     @CurrentUser() user: RequestResponseUser,
    // ): Promise<Chat> {
    //     const addUsersDto: AddUsersToChatDto = { chatId, chattersIds }
    //     isUserChatParticipantValidate(user.id, chatId)
    //     const chat: Chat = await this.chatsService.addUsersToChat(addUsersDto)
    //     const chatters: User[] = await this.usersService.getChattersByChatId(chatId)
    //     const sendChatMessageDto: SendChatMessageDto = {
    //         userId: StandartBots.CHAT_BOT.id,
    //         username: StandartBots.CHAT_BOT.username,
    //         chatId,
    //         content: {
    //             text: addUsersMessageContent(user.username, chatters.map(chatter => chatter.username))
    //         }
    //     }
    //     await this.chatMessageService.sendMessageToChat(sendChatMessageDto)
    //     return chat
    // }

    // @Post('/:id/messages')
    // @UseGuards(JwtAuthGuard)
    // async sendMessageToChat(
    //     @Param('id') chatId: number,
    //     @CurrentUser() user: RequestResponseUser,
    //     @Body() dto: CreateMessageContentDto
    // ): Promise<Message> {
    //     isUserChatParticipantValidate(user.id, chatId)
    //     const message: Message = await this.chatMessageService.sendMessageToChat({
    //         userId: user.id,
    //         username: user.username,
    //         chatId,
    //         content: dto
    //     })
    //     return message
    // }

    // @Get('/:id/messages')
    // @UseGuards(JwtAuthGuard)
    // async getMessagesWithContentFromChat(
    //     @Param('id') chatId: number,
    //     @CurrentUser() user: RequestResponseUser
    // ): Promise<Message[]> {
    //     isUserChatParticipantValidate(user.id, chatId)
    //     const messages: Message[] = await this.chatMessageService.getMessagesWithContentFromChat(chatId)
    //     return messages
    // }

}