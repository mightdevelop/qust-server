import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { StandardGroupLayouts } from 'src/layouts/types/standard-category-layouts'
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
        await this.layoutsService.createCategoriesAndTextChannelsByLayout({
            groupId: group.id,
            groupLayout: StandardGroupLayouts[dto.layout ? dto.layout : 'DEFAULT']
        })
        return group
    }

    // async updateChat(dto: UpdateChatDto): Promise<Chat> {
    //     const chat: Chat = await this.chatRepository.findOne({
    //         where: { id: dto.chatId, chatType: ChatType.chat }
    //     })
    //     if (!chat)
    //         throw new NotFoundException({ message: 'Chat not found' })
    //     await chat.update(dto)
    //     return chat
    // }

    // async deleteChat(chatId: string): Promise<Chat> {
    //     const chat: Chat = await this.chatRepository.findByPk(chatId)
    //     if (!chat)
    //         throw new NotFoundException({ message: 'Chat not found' })
    //     await this.chatUserRepository.destroy({ where: { chatId } })
    //     return chat
    // }

    // async createDialogue({ firstChatterId, secondChatterId }: CreateDialogueDto): Promise<Chat> {
    //     const chat: Chat = await this.chatRepository.create({
    //         name: `${firstChatterId} AND ${secondChatterId} DIALOGUE`, chatType: ChatType.dialogue
    //     })
    //     await this.chatUserRepository.create([
    //         { chatId: chat.id, userId: firstChatterId },
    //         { chatId: chat.id, userId: secondChatterId }
    //     ])
    //     return chat
    // }

    // async addUsersToChat(dto: AddUsersToChatDto): Promise<Chat> {
    //     const chat: Chat = await this.chatRepository.findOne({
    //         where: { id: dto.chatId, chatType: ChatType.chat }
    //     })
    //     if (!chat)
    //         throw new NotFoundException({ message: 'Chat not found' })
    //     const arrayToCreateChatUserColumns: {
    //         chatId: string,
    //         userId: string
    //     }[] = dto.chattersIds.map(chatterId => {
    //         return {
    //             chatId: chat.id,
    //             userId: chatterId
    //         }
    //     })
    //     await this.chatUserRepository.bulkCreate(arrayToCreateChatUserColumns)
    //     return chat
    // }

}