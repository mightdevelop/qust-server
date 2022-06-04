import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { isAdmin } from 'src/auth/decorators/isAdmin.decorator'
import { UsersService } from './users.service'
import { User } from './models/users.model'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { CreateUserDto } from './dto/create-user.dto'
import { AdminGuard } from 'src/auth/guards/admin.guard'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { UserModelInterceptor } from './interceptors/users-model.interceptor'


@Controller('/users')
export class UsersController {

    constructor(
        private usersService: UsersService,
    ) {}

    @Get('/')
    @isAdmin()
    @UseGuards(JwtAuthGuard, AdminGuard)
    async getUsers(): Promise<User[]> {
        const users: User[] = await this.usersService.getUsers()
        return users
    }

    @Get('/:userId')
    @UseGuards(JwtAuthGuard)
    async getUserById(
        @Param('userId') userId: string,
    ): Promise<User> {
        const user: User = await this.usersService.getUserById(userId)
        if (!user)
            throw new NotFoundException({ message: 'User not found' })
        return user
    }

    @Get('/:userId/friends')
    @isAdmin()
    @UseGuards(JwtAuthGuard, AdminGuard)
    async getFriendsByUserId(
        @Param('userId') userId: string,
        @Query('offset') offset: number,
    ): Promise<User[]> {
        const user = await this.usersService.getUserById(userId)
        if (!user)
            throw new NotFoundException({ message: 'User not found' })
        const friends: User[] = await this.usersService.getFriendsByUserId(userId, 30, offset)
        return friends
    }

    @Post('/')
    @isAdmin()
    @UseGuards(JwtAuthGuard, AdminGuard)
    async createUser(
        @Body() dto: CreateUserDto,
    ): Promise<User> {
        const user: User = await this.usersService.createUser(dto)
        return user
    }

    @Put('/:userId')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(UserModelInterceptor)
    async updateUser(
        @Param('userId') userId: string,
        @Body() body: { info: string, username: string },
        @CurrentUser() { id, isAdmin },
    ): Promise<User> {
        if (!userId)
            userId = id
        const user: User = await this.usersService.getUserById(userId)
        if (!user) {
            throw new NotFoundException({ message: 'User does not exists' })
        }
        if (id !== userId && isAdmin) {
            throw new ForbiddenException({ message: 'You have no access' })
        }
        const updatedUser: User = await this.usersService.updateUser({ userId, ...body })
        return updatedUser
    }

    @Delete('/:userId')
    @isAdmin()
    @UseGuards(JwtAuthGuard, AdminGuard)
    async deleteUser(
        @Param('userId') userId: string,
    ): Promise<User> {
        const user: User = await this.usersService.deleteUser(userId)
        return user
    }

}