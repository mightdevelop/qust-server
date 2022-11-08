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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UserChangesBody } from './dto/user-changes.body'
import { UserIdDto } from 'src/users/dto/user-id.dto'
import { PartialUserIdDto } from './dto/partial-user-id.dto'
import { PartialOffsetDto } from './dto/partial-offset.dto'


@ApiTags('users')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('/users')
export class UsersController {

    constructor(
        private usersService: UsersService,
    ) {}

    @Get('/')
    @isAdmin()
    @UseGuards(AdminGuard)
    async getUsers(): Promise<User[]> {
        const users: User[] = await this.usersService.getUsers()
        return users
    }

    @Get('/:userId')
    async getUserById(
        @Param() { userId }: UserIdDto,
    ): Promise<User> {
        const user: User = await this.usersService.getUserById(userId)
        if (!user)
            throw new NotFoundException({ message: 'User not found' })
        return user
    }

    @Get('/:userId/friends')
    @isAdmin()
    @UseGuards(AdminGuard)
    async getFriendsByUserId(
        @Param() { userId }: UserIdDto,
        @Query() { offset }: PartialOffsetDto,
    ): Promise<User[]> {
        const user = await this.usersService.getUserById(userId)
        if (!user)
            throw new NotFoundException({ message: 'User not found' })
        const friends: User[] = await this.usersService.getFriendsByUserId(
            userId, 30, offset ? Number(offset) : undefined
        )
        return friends
    }

    @Post('/')
    @isAdmin()
    @UseGuards(AdminGuard)
    async createUser(
        @Body() dto: CreateUserDto,
    ): Promise<User> {
        const user: User = await this.usersService.createUser(dto)
        return user
    }

    @Put('/:userId?')
    @UseInterceptors(UserModelInterceptor)
    async updateUser(
        @Param() { userId }: PartialUserIdDto,
        @Body() dto: UserChangesBody,
        @CurrentUser() { id, isAdmin },
    ): Promise<User> {
        if (userId === '{userId}')
            userId = id
        const user: User = await this.usersService.getUserById(userId)
        if (!user) {
            throw new NotFoundException({ message: 'User does not exists' })
        }
        if (id !== userId && !isAdmin) {
            throw new ForbiddenException({ message: 'You have no access' })
        }
        const updatedUser: User = await this.usersService.updateUser({ ...dto, userId: user.id })
        return updatedUser
    }

    @Delete('/:userId')
    @isAdmin()
    @UseGuards(AdminGuard)
    async deleteUser(
        @Param() { userId }: UserIdDto,
    ): Promise<User> {
        const user: User = await this.usersService.deleteUser(userId)
        return user
    }

}