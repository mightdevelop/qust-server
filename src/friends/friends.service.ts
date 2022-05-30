import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { User } from 'src/users/models/users.model'
import { UsersService } from 'src/users/users.service'
import { UserIdAndFriendIdDto } from './dto/user-id-and-friend-id.dto'
import { Friend } from './models/friends.model'
import { FriendRequestStatus } from './types/friend-request-status'


@Injectable()
export class FriendsService {

    constructor(
        private usersService: UsersService,
        @InjectModel(Friend) private userFriendsRepository: typeof Friend,
    ) {}

    async getUserFriendRow(
        friendId: string,
        userId: string
    ): Promise<Friend> {
        const friend: User = await this.usersService.getUserById(friendId)
        if (!friend)
            throw new NotFoundException({ message: 'Friend not found' })
        const userFriendRow: Friend = await this.userFriendsRepository.findOne(
            { where: { userId, friendId } }
        )
        return userFriendRow
    }

    async getRequestsToUserId(
        userId: string
    ): Promise<Friend[]> {
        return await this.userFriendsRepository.findAll({ where: { friendId: userId } })
    }

    async getRequestsFromUserId(
        userId: string
    ): Promise<Friend[]> {
        return await this.userFriendsRepository.findAll({ where: { userId } })
    }

    async friendshipRequest(
        { friendId, userId }: UserIdAndFriendIdDto
    ): Promise<Friend> {
        if (friendId === userId)
            throw new BadRequestException({ message: 'You can`t request friendship from yourself' })
        const requestRecipient: User = await this.usersService.getUserById(friendId)
        if (!requestRecipient)
            throw new BadRequestException({ message: 'User doesn`t exists' })
        const friendRow: Friend = await this.userFriendsRepository.findOne(
            { where: { userId, friendId } }
        )
        if (friendRow)
            throw new BadRequestException(
                { message:
                    friendRow.status === FriendRequestStatus.CONFIRM
                        ? 'User is already a friend'
                        : 'Already requested'
                }
            )
        const request: Friend = await this.userFriendsRepository.create({
            userId,
            friendId,
            status: FriendRequestStatus.REQUEST
        })
        return request
    }

    async cancelFriendshipRequest(
        { friendId, userId }: UserIdAndFriendIdDto
    ): Promise<Friend> {
        const request: Friend = await this.userFriendsRepository.findOne(
            { where: { userId, friendId, status: FriendRequestStatus.REQUEST } }
        )
        if (!request)
            throw new BadRequestException({ message: 'No request' })
        await request.destroy()
        return request
    }

    async responseToFriendshipRequest(
        requestedUserId: string,
        respondingUserId: string,
        isConfirm: boolean
    ): Promise<Friend> {
        const friendRow: Friend = await this.userFriendsRepository.findOne({ where: {
            userId: requestedUserId,
            friendId: respondingUserId,
            status: FriendRequestStatus.REQUEST
        } })
        if (!friendRow)
            throw new BadRequestException({ message: 'Not requested' })
        if (!isConfirm) {
            await friendRow.destroy()
            return
        }
        await friendRow.update({ status: FriendRequestStatus.CONFIRM })
        const request: Friend = await this.userFriendsRepository.create({
            userId: respondingUserId,
            friendId: requestedUserId,
            status: FriendRequestStatus.CONFIRM
        })
        return request
    }

    async removeFriend(
        { friendId, userId }: UserIdAndFriendIdDto
    ): Promise<Friend> {
        const request: Friend = await this.userFriendsRepository.findOne( { where: { userId, friendId } })
        if (!request)
            throw new BadRequestException({ message: 'User is not a friend' })
        await this.userFriendsRepository.destroy({ where: {
            userId,
            friendId,
            status: FriendRequestStatus.REQUEST
        } })
        return request
    }

}