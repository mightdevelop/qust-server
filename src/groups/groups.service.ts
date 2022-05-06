import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CategoriesService } from 'src/categories/categories.service'
import { StandardCategoryLayouts } from 'src/categories/types/standard-category-layouts'
import { CreateGroupDto } from './dto/create-group.dto'
import { Group } from './models/groups.model'


@Injectable()
export class GroupsService {

    constructor(
        private categoriesService: CategoriesService,
        @InjectModel(Group) private groupRepository: typeof Group,
    ) {}

    async createGroup(dto: CreateGroupDto): Promise<Group> {
        const group: Group = await this.groupRepository.create(dto)
        await this.categoriesService.createCategoriesAndTextChannelsByLayout({
            groupId: group.id,
            categoryLayouts: StandardCategoryLayouts[dto.layout ? dto.layout : 'DEFAULT']
        })
        return group
    }

    // async createByDefaultLayout(group: Group): Promise<void> {
    //     const categories: Category[] = await this.categoriesService.createCategoriesByDefaultLayout(group.id)
    //     const channels: TextChannel[] = await this.textChannelsService.createTextChannelsByDefaultLayout(group.id)
    //     await group.update({ categories })
    //     return
    // }

    // async createGroup(dto: CreateGroupDto): Promise<Group> {
    //     const group: Group = await this.groupRepository.create({
    //         name: dto.name
    //     })
    //     const arrayToCreateChatUserColumns: {
    //         chatId: number,
    //         userId: number
    //     }[] = dto.chattersIds.map(chatterId => {
    //         return {
    //             chatId: chat.id,
    //             userId: chatterId
    //         }
    //     })
    //     await this.chatUserRepository.bulkCreate(arrayToCreateChatUserColumns)
    //     return chat
    // }

    // async updateChat(dto: UpdateChatDto): Promise<Chat> {
    //     const chat: Chat = await this.chatRepository.findOne({
    //         where: { id: dto.chatId, chatType: ChatType.chat }
    //     })
    //     if (!chat)
    //         throw new NotFoundException({ message: 'Chat not found' })
    //     await chat.update(dto)
    //     return chat
    // }

    // async deleteChat(chatId: number): Promise<Chat> {
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
    //         chatId: number,
    //         userId: number
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