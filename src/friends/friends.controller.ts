import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { UserFromRequest } from 'src/auth/types/request-response'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { FriendsService } from './friends.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { User } from 'src/users/models/users.model'
import { Friend } from './models/friends.model'
import { InjectModel } from '@nestjs/sequelize'
import { FriendRequestStatus } from './types/friend-request-status'
import { UsersService } from 'src/users/users.service'


@Controller('/friends')
export class FriendsController {

    constructor(
        private friendsService: FriendsService,
        private usersService: UsersService,
        @InjectModel(Friend) private userFriendsRepository: typeof Friend,
    ) {}

    @Get('/')
    @UseGuards(JwtAuthGuard)
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
        const requests: Friend[] = await this.userFriendsRepository.findAll({ where: {
            userId: user.id,
            status: FriendRequestStatus.REQUEST
        } })
        return requests
    }

    @Get('/requests/tome')
    @UseGuards(JwtAuthGuard)
    async getFriendshipRequestsToMe(
        @CurrentUser() user: UserFromRequest
    ): Promise<Friend[]> {
        const requests: Friend[] = await this.userFriendsRepository.findAll({ where: {
            friendId: user.id,
            status: FriendRequestStatus.REQUEST
        } })
        return requests
    }

    @Post('/:friendId')
    @UseGuards(JwtAuthGuard)
    async friendshipRequest(
        @Param('friendId') friendId: string,
        @CurrentUser() user: UserFromRequest,
        @Body('cancel') cancel: boolean
    ): Promise<string> {
        if (cancel) {
            await this.friendsService.cancelFriendshipRequest(friendId, user.id)
            return 'Friendship request canceled'
        }
        await this.friendsService.friendshipRequest(friendId, user.id)
        return 'Friendship requested'
    }

    @Put('/:requestedUserId')
    @UseGuards(JwtAuthGuard)
    async responseToFriendshipRequest(
        @Param('requestedUserId') requestedUserId: string,
        @CurrentUser() user: UserFromRequest,
        @Body() { isConfirm }: {isConfirm: boolean}
    ): Promise<string> {
        await this.friendsService.responseToFriendshipRequest(requestedUserId, user.id, isConfirm)
        if (!isConfirm) return 'Friendship declined'
        return 'Friendship comfirmed'
    }

    @Delete('/:friendId')
    @UseGuards(JwtAuthGuard)
    async removeFriend(
        @Param('friendId') friendId: string,
        @CurrentUser() user: UserFromRequest,
    ): Promise<string> {
        const userFriendRow: Friend = await this.friendsService.getUserFriendRow(friendId, user.id)
        if (!userFriendRow)
            throw new BadRequestException({ message: `User ID ${friendId} is not a friend to ID ${user.id}` })
        await userFriendRow.destroy()
        return 'Friend removed'
    }

}