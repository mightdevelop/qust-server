import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { ChatUser } from 'src/chats/models/chat-user.model'
import { Friend } from 'src/friends/models/friends.model'
import { FriendRequestStatus } from 'src/friends/types/friend-request-status'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './models/users.model'


@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(ChatUser) private chatUserRepository: typeof ChatUser,
        @InjectModel(Friend) private userFriendsRepository: typeof Friend,
    ) {}

    async getAllUsers(): Promise<User[]> {
        const users: User[] = await this.userRepository.findAll()
        return users
    }

    async getUserById(
        authorId: number
    ): Promise<User> {
        const user: User = await this.userRepository.findByPk(authorId)
        return user
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

    async getChattersByChatId(chatId: number): Promise<User[]> {
        const chatUserColumns: ChatUser[] = await this.chatUserRepository.findAll({ where: { chatId } })
        const chattersIds: {id: number}[] = chatUserColumns.map(column => {
            return { id: column.userId }
        })
        const chatters: User[] = await this.userRepository.findAll({
            where: { [Op.or]: chattersIds }
        })
        return chatters
    }

    async getFriendsByUserId(
        userId: number
    ): Promise<User[]> {
        const userFriendColumns: Friend[] = await this.userFriendsRepository.findAll(
            { where: { userId, status: FriendRequestStatus.CONFIRM } }
        )
        const friendsIds: {id: number}[] = userFriendColumns.map(column => {
            return { id: column.userId }
        })
        const friends: User[] = await this.userRepository.findAll({
            where: { [Op.or]: friendsIds }
        })
        return friends
    }

    async createUser(
        dto: CreateUserDto
    ): Promise<User> {
        const user: User = await this.userRepository.create(dto)
        return user
    }

    async updateUser(
        userId: number,
        dto: UpdateUserDto
    ): Promise<User> {
        const user: User = await this.userRepository.findByPk(userId)
        await user.update(dto)
        return user
    }

    async deleteUser(
        authorId: number
    ): Promise<User> {
        const user: User = await this.userRepository.findByPk(authorId)
        await this.userRepository.destroy({ where: { id: authorId } })
        return user
    }

}