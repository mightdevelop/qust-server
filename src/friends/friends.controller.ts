import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { RequestResponseUser } from 'src/auth/types/request-response'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { FriendsService } from './friends.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { User } from 'src/users/models/users.model'
import { Friend } from './models/friends.model'
import { InjectModel } from '@nestjs/sequelize'
import { FriendRequestStatus } from './types/friend-request-status'
import { NotificationsService } from 'src/notifications/notifications.service'


@Controller('/friends')
export class FriendsController {

    constructor(
        private friendsService: FriendsService,
        private notificationsService: NotificationsService,
        @InjectModel(Friend) private userFriendsRepository: typeof Friend,
    ) {}

    @Get('/')
    @UseGuards(JwtAuthGuard)
    async getAllMyFriends(
        @CurrentUser() user: RequestResponseUser
    ): Promise<User[]> {
        const friends: User[] = await this.friendsService.getFriendsByUserId(user.id)
        return friends
    }

    @Get('/requests/fromme')
    @UseGuards(JwtAuthGuard)
    async getFriendshipRequestsFromMe(
        @CurrentUser() user: RequestResponseUser
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
        @CurrentUser() user: RequestResponseUser
    ): Promise<Friend[]> {
        const requests: Friend[] = await this.userFriendsRepository.findAll({ where: {
            friendId: user.id,
            status: FriendRequestStatus.REQUEST
        } })
        return requests
    }

    @Post('/:id')
    @UseGuards(JwtAuthGuard)
    async friendshipRequest(
        @Param('id') friendId: number,
        @CurrentUser() user: RequestResponseUser,
        @Body('cancel') cancel: boolean
    ): Promise<string> {
        if (cancel) {
            await this.friendsService.cancelFriendshipRequest(friendId, user.id)
            return 'Friendship request canceled'
        }
        await this.friendsService.friendshipRequest(friendId, user.id)
        await this.notificationsService.sendFriendshipRequestNotification(
            friendId, { requesterId: user.id }
        )
        return 'Friendship requested'
    }

    @Put('/:id')
    @UseGuards(JwtAuthGuard)
    async responseToFriendshipRequest(
        @Param('id') requestedUserId: number,
        @CurrentUser() user: RequestResponseUser,
        @Body('response') isConfirm: boolean
    ): Promise<string> {
        await this.friendsService.responseToFriendshipRequest(requestedUserId, user.id, isConfirm)
        if (!isConfirm) return 'Friendship declined'
        return 'Friendship comfirmed'
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    async removeFriend(
        @Param('id') friendId: number,
        @CurrentUser() user: RequestResponseUser,
    ): Promise<string> {
        const userFriendColumn: Friend = await this.friendsService.getUserFriendColumn(friendId, user.id)
        if (!userFriendColumn)
            throw new BadRequestException({ message: `User ID ${friendId} is not a friend to ID ${user.id}` })
        await userFriendColumn.destroy()
        return 'Friend removed'
    }

}