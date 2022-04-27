import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './models/users.model'


@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User) private userRepository: typeof User,
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