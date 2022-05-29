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
} from '@nestjs/common'
import { isAdmin } from 'src/auth/decorators/isAdmin.decorator'
import { UsersService } from './users.service'
import { User } from './models/users.model'
import { UpdateUserDto } from './dto/update-user.dto'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { CreateUserDto } from './dto/create-user.dto'
import { AdminGuard } from 'src/auth/guards/admin.guard'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { usersToResponse } from './utils/users-to-UserToResponse-array'
import { UserToResponse } from './types/user-to-response.class'


@Controller('/users')
export class UsersController {

    constructor(
        private usersService: UsersService,
    ) {}

    // @Get('/')
    // async getUsers(): Promise<UserToResponse[]> {
    //     const users: User[] = await this.usersService.getUsers()
    //     return await usersToResponse(users)
    // }

    @Get('/:userId')
    async getUserById(
        @Param('userId') userId: string,
    ): Promise<UserToResponse> {
        const user: User = await this.usersService.getUserById(userId)
        if (!user)
            throw new NotFoundException({ message: 'User not found' })
        return await usersToResponse([ user ])[0]
    }

    @Get('/:userId/friends')
    async getFriendsByUserId(
        @Param('userId') userId: string,
        @Query('offset') offset: number,
    ): Promise<UserToResponse[]> {
        const user = await this.usersService.getUserById(userId)
        if (!user)
            throw new NotFoundException({ message: 'User not found' })
        const friends: User[] = await this.usersService.getFriendsByUserId(userId, 30, offset)
        return await usersToResponse(friends)
    }

    @Post('/')
    @isAdmin()
    @UseGuards(JwtAuthGuard, AdminGuard)
    async createUser(
        @Body() dto: CreateUserDto,
    ): Promise<UserToResponse> {
        const user: User = await this.usersService.createUser(dto)
        return await usersToResponse([ user ])[0]
    }

    @Put('/:userId')
    @UseGuards(JwtAuthGuard)
    async updateUser(
        @Param('userId') userId: string,
        @Body() dto: UpdateUserDto,
        @CurrentUser() { id, isAdmin },
    ): Promise<UserToResponse> {
        if (!userId)
            userId = id
        const user: User = await this.usersService.getUserById(userId)
        if (!user) {
            throw new NotFoundException({ message: 'User does not exists' })
        }
        if (id !== userId && isAdmin) {
            throw new ForbiddenException({ message: 'You have no access' })
        }
        const updatedUser: User = await this.usersService.updateUser(userId, dto)
        return await usersToResponse([ updatedUser ])[0]
    }

    @Delete('/:userId')
    @isAdmin()
    @UseGuards(JwtAuthGuard, AdminGuard)
    async deleteUser(
        @Param('userId') userId: string,
    ): Promise<UserToResponse> {
        const user: User = await this.usersService.deleteUser(userId)
        return await usersToResponse([ user ])[0]
    }

}