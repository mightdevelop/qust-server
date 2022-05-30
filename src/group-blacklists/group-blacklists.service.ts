import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { BanUserInGroupDto } from './dto/ban-user-in-group.dto'
import { BannedUser } from './models/banned-users.model'
import { GroupBlacklist } from './models/group-blacklists.model'


@Injectable()
export class GroupBlacklistsService {

    constructor(
        @InjectModel(GroupBlacklist) private blacklistRepository: typeof GroupBlacklist,
        @InjectModel(BannedUser) private bannedUserRepository: typeof BannedUser,
    ) {}

    async getGroupBlacklistByGroupId(
        groupId: string,
    ): Promise<GroupBlacklist> {
        const blacklist: GroupBlacklist = await this.blacklistRepository.findOne({ where: { groupId } })
        return blacklist
    }

    async getGroupBlacklistById(
        blacklistId: string,
    ): Promise<GroupBlacklist> {
        const blacklist: GroupBlacklist = await this.blacklistRepository.findByPk(blacklistId)
        if (!blacklist)
            throw new NotFoundException({ message: 'Blacklist not found' })
        return blacklist
    }

    async getBannedUserRowByUserId(
        userId: string
    ): Promise<BannedUser> {
        return await this.bannedUserRepository.findOne({ where: { userId } })
    }

    async addUserToGroupBlacklist(
        { userId, groupId, banReason }: BanUserInGroupDto
    ): Promise<BannedUser> {
        const blacklist: GroupBlacklist = await this.blacklistRepository.findOne({ where: { groupId } })
        const bannedUserRow: BannedUser =
            await this.bannedUserRepository.findOne({ where: { userId, blacklistId: blacklist.id } })
        if (bannedUserRow)
            throw new BadRequestException({ message: 'User is already banned' })
        return await this.bannedUserRepository.create({ userId, blacklistId: blacklist.id, banReason })
    }

    async removeUserFromGroupBlacklist(
        bannedUserRow: BannedUser
    ): Promise<BannedUser> {
        await bannedUserRow.destroy()
        return bannedUserRow
    }

    async createGroupBlacklist(
        groupId: string
    ): Promise<GroupBlacklist> {
        return await this.blacklistRepository.create({ groupId })
    }

}