import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common'
import { UserFromRequest } from 'src/auth/types/request-response'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { FriendsService } from './friends.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { User } from 'src/users/models/users.model'
import { Friend } from './models/friends.model'
import { UsersService } from 'src/users/users.service'
import { UserModelInterceptor } from 'src/users/interceptors/users-model.interceptor'
import { CancelDto } from './dto/cancel.dto'
import { IsConfirmDto } from './dto/is-confirm.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { FriendIdDto } from './dto/friend-id.dto'
import { RequestedUserIdDto } from './dto/requested-user-id.dto'
import { PartialOffsetDto } from 'src/users/dto/partial-offset.dto'


@ApiTags('friends')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
@Controller('/friends')
export class FriendsController {

    constructor(
        private friendsService: FriendsService,
        private usersService: UsersService,
    ) {}

    @Get('/')
    @UseInterceptors(UserModelInterceptor)
    async getMyFriends(
        @CurrentUser() user: UserFromRequest,
        @Query() { offset }: PartialOffsetDto
    ): Promise<User[]> {
        const friends: User[] = await this.usersService.getFriendsByUserId(
            user.id, 30, offset ? Number(offset) : undefined
        )
        return friends
    }

    @Get('/requests/fromme')
    async getFriendshipRequestsFromMe(
        @CurrentUser() user: UserFromRequest
    ): Promise<Friend[]> {
        const requests: Friend[] = await this.friendsService.getRequestsFromUserId(user.id)
        return requests
    }

    @Get('/requests/tome')
    async getFriendshipRequestsToMe(
        @CurrentUser() user: UserFromRequest
    ): Promise<Friend[]> {
        const requests: Friend[] = await this.friendsService.getRequestsToUserId(user.id)
        return requests
    }

    @Post('/:friendId')
    async friendshipRequest(
        @Param() { friendId }: FriendIdDto,
        @CurrentUser() user: UserFromRequest,
        @Body() { cancel }: CancelDto
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
    async responseToFriendshipRequest(
        @Param() { requestedUserId }: RequestedUserIdDto,
        @CurrentUser() user: UserFromRequest,
        @Body() { isConfirm }: IsConfirmDto
    ): Promise<Friend> {
        const request: Friend =
            await this.friendsService.responseToFriendshipRequest(requestedUserId, user.id, isConfirm)
        return request
    }

    @Delete('/:friendId')
    async removeFriend(
        @Param() { friendId }: FriendIdDto,
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