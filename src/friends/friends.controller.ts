import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common'
import { UserFromRequest } from 'src/auth/types/request-response'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { FriendsService } from './friends.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { User } from 'src/users/models/users.model'
import { Friend } from './models/friends.model'
import { UsersService } from 'src/users/users.service'
import { UserModelInterceptor } from 'src/users/interceptors/users-model.interceptor'


@Controller('/friends')
export class FriendsController {

    constructor(
        private friendsService: FriendsService,
        private usersService: UsersService,
    ) {}

    @Get('/')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(UserModelInterceptor)
    async getMyFriends(
        @CurrentUser() user: UserFromRequest,
        @Query('offset') offset: number,
    ): Promise<User[]> {
        const friends: User[] = await this.usersService.getFriendsByUserId(user.id, 30, offset)
        return friends
    }

    @Get('/requests/fromme')
    @UseGuards(JwtAuthGuard)
    async getFriendshipRequestsFromMe(
        @CurrentUser() user: UserFromRequest
    ): Promise<Friend[]> {
        const requests: Friend[] = await this.friendsService.getRequestsFromUserId(user.id)
        return requests
    }

    @Get('/requests/tome')
    @UseGuards(JwtAuthGuard)
    async getFriendshipRequestsToMe(
        @CurrentUser() user: UserFromRequest
    ): Promise<Friend[]> {
        const requests: Friend[] = await this.friendsService.getRequestsToUserId(user.id)
        return requests
    }

    @Post('/:friendId')
    @UseGuards(JwtAuthGuard)
    async friendshipRequest(
        @Param('friendId') friendId: string,
        @CurrentUser() user: UserFromRequest,
        @Body() { cancel }: { cancel: boolean }
    ): Promise<Friend> {
        if (cancel) {
            const friendRow: Friend =
                await this.friendsService.cancelFriendshipRequest({ friendId, userId: user.id })
            return friendRow
        }
        const request: Friend = await this.friendsService.friendshipRequest({ friendId, userId: user.id })
        return request
    }

    @Put('/:requestedUserId')
    @UseGuards(JwtAuthGuard)
    async responseToFriendshipRequest(
        @Param('requestedUserId') requestedUserId: string,
        @CurrentUser() user: UserFromRequest,
        @Body() { isConfirm }: { isConfirm: boolean }
    ): Promise<Friend> {
        const request: Friend =
            await this.friendsService.responseToFriendshipRequest(requestedUserId, user.id, isConfirm)
        return request
    }

    @Delete('/:friendId')
    @UseGuards(JwtAuthGuard)
    async removeFriend(
        @Param('friendId') friendId: string,
        @CurrentUser() user: UserFromRequest,
    ): Promise<Friend> {
        const userFriendRow: Friend = await this.friendsService.getUserFriendRow(friendId, user.id)
        if (!userFriendRow)
            throw new BadRequestException({
                message: `User ID:${friendId} is not a friend to ID:${user.id}`
            })
        await userFriendRow.destroy()
        return userFriendRow
    }

}