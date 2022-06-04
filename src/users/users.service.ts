import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { ChatUser } from 'src/chats/models/chat-user.model'
import { Friend } from 'src/friends/models/friends.model'
import { FriendRequestStatus } from 'src/friends/types/friend-request-status'
import { GroupUser } from 'src/groups/models/group-user.model'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './models/users.model'


@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(ChatUser) private chatUserRepository: typeof ChatUser,
        @InjectModel(Friend) private userFriendsRepository: typeof Friend,
        @InjectModel(GroupUser) private groupUserRepository: typeof GroupUser,
    ) {}

    async getUsers(limit?: number, offset?: number): Promise<User[]> {
        const users: User[] = await this.userRepository.findAll({ limit, offset })
        return users
    }

    async getUserById(
        userId: string
    ): Promise<User> {
        const user: User = await this.userRepository.findByPk(userId)
        return user
    }

    async getUsersByIdsArray(
        usersIds: string[]
    ): Promise<User[]> {
        const users: User[] = await this.userRepository.findAll({ where: { [Op.or]: { id: usersIds } } })
        return users
    }

    async getUserByUsername(
        username: string
    ): Promise<User> {
        const user: User = await this.userRepository.findOne({ where: { username } })
        return user
    }

    async getUserByEmail(
        email: string
    ): Promise<User> {
        const user: User = await this.userRepository.findOne({ where: { email } })
        return user
    }

    async getChattersByChatId(chatId: string): Promise<User[]> {
        const chatUserRows: ChatUser[] = await this.chatUserRepository.findAll({ where: { chatId } })
        const chatters: User[] = await this.userRepository.findAll({
            where: { [Op.or]: chatUserRows.map(row => ({ id: row.userId })) }
        })
        return chatters
    }

    async getIdsOfChattersByChatId(chatId: string): Promise<string[]> {
        const chatUserRows: ChatUser[] = await this.chatUserRepository.findAll({ where: { chatId } })
        return chatUserRows.map(row => row.userId)
    }

    async getFriendsByUserId(
        userId: string,
        limit?: number,
        offset?: number,
    ): Promise<User[]> {
        const userFriendRows: Friend[] = await this.userFriendsRepository.findAll(
            { where: { userId, status: FriendRequestStatus.CONFIRM } }
        )
        const friends: User[] = await this.userRepository.findAll({
            where: { [Op.or]: userFriendRows.map(row => ({ id: row.userId })) }, limit, offset
        })
        return friends
    }

    async getUsersByGroupId(
        groupId: string,
        limit?: number,
        offset?: number,
    ): Promise<User[]> {
        const userGroupRows: GroupUser[] = await this.groupUserRepository.findAll(
            { where: { groupId } }
        )
        const users: User[] = await this.userRepository.findAll({
            where: { [Op.or]: userGroupRows.map(row => ({ id: row.userId })) }, limit, offset
        })
        return users
    }

    async createUser(
        dto: CreateUserDto
    ): Promise<User> {
        const user: User = await this.userRepository.create(dto)
        return user
    }

    async updateUser(
        userId: string,
        dto: UpdateUserDto
    ): Promise<User> {
        const user: User = await this.userRepository.findByPk(userId)
        user.setAttributes(dto)
        await user.save()
        return user
    }

    async deleteUser(
        authorId: string
    ): Promise<User> {
        const user: User = await this.userRepository.findByPk(authorId)
        await this.userRepository.destroy({ where: { id: authorId } })
        return user
    }

}