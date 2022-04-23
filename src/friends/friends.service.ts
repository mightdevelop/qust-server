import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { User } from 'src/users/models/users.model'
import { Friend } from './models/friends.model'
import { FriendRequestStatus } from './types/friend-request-status'


@Injectable()
export class FriendsService {

    constructor(
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(Friend) private userFriendsRepository: typeof Friend,
    ) {}

    async getFriendsByUserId(
        userId: number
    ): Promise<User[]> {
        const userFriendColumns: Friend[] = await this.userFriendsRepository.findAll(
            { where: { userId, status: FriendRequestStatus.CONFIRM } }
        )
        const friends: User[] = []
        for (const column of userFriendColumns) {
            const friend: User = await this.userRepository.findByPk(column.friendId)
            friends.push(friend)
        }
        return friends
    }

    async getUserFriendColumn(
        friendId: number,
        userId: number
    ): Promise<Friend> {
        const friend: User = await this.userRepository.findByPk(friendId)
        if (!friend)
            throw new NotFoundException({ message: 'Friend not found' })
        const userFriendColumn: Friend = await this.userFriendsRepository.findOne(
            { where: { userId, friendId } }
        )
        return userFriendColumn
    }

    async friendshipRequest(
        friendId: number,
        userId: number
    ): Promise<void> {
        if (friendId === userId)
            throw new BadRequestException({ message: 'You can`t request friendship from yourself' })
        const requestRecipient: User = await this.userRepository.findByPk(friendId)
        if (!requestRecipient)
            throw new BadRequestException({ message: 'User doesn`t exists' })
        const friendColumn: Friend = await this.userFriendsRepository.findOne(
            { where: { userId, friendId } }
        )
        if (friendColumn)
            throw new BadRequestException(
                { message:
                    friendColumn.status === FriendRequestStatus.CONFIRM
                        ? 'User is already a friend'
                        : 'Already requested'
                }
            )
        await this.userFriendsRepository.create({
            userId,
            friendId,
            status: FriendRequestStatus.REQUEST
        })
        return
    }

    async cancelFriendshipRequest(
        friendId: number,
        userId: number
    ): Promise<void> {
        const request: Friend = await this.userFriendsRepository.findOne(
            { where: { userId, friendId, status: FriendRequestStatus.REQUEST } }
        )
        if (!request)
            throw new BadRequestException({ message: 'No request' })
        await request.destroy()
        return
    }

    async responseToFriendshipRequest(
        requestedUserId: number,
        respondingUserId: number,
        isConfirm: boolean
    ): Promise<void> {
        const friendColumn: Friend = await this.userFriendsRepository.findOne({ where: {
            userId: requestedUserId,
            friendId: respondingUserId,
            status: FriendRequestStatus.REQUEST
        } })
        if (!friendColumn)
            throw new BadRequestException({ message: 'Not requested' })
        if (!isConfirm) {
            await friendColumn.destroy()
            return
        }
        await friendColumn.update({ status: FriendRequestStatus.CONFIRM })
        await this.userFriendsRepository.create({
            userId: respondingUserId,
            friendId: requestedUserId,
            status: FriendRequestStatus.CONFIRM
        })
        return
    }

    async removeFriend(
        friendId: number,
        userId: number
    ): Promise<void> {
        const isFriend = !!await this.userFriendsRepository.findOne( { where: { userId, friendId } })
        if (!isFriend)
            throw new BadRequestException({ message: 'User is not a friend' })
        await this.userFriendsRepository.destroy({ where: {
            userId,
            friendId,
            status: FriendRequestStatus.REQUEST
        } })
        return
    }

}