import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { nanoid } from 'nanoid'
import { Op } from 'sequelize'
import { CreateInviteDto } from './dto/create-invite.dto'
import { Invite } from './models/invites.model'


@Injectable()
export class InvitesService {

    constructor(
        @InjectModel(Invite) private inviteRepository: typeof Invite
    ) {}

    async getInviteById(inviteId: string): Promise<Invite> {
        const invite: Invite = await this.inviteRepository.findByPk(inviteId)
        return invite
    }

    async getInvitesByGroupId(groupId: string): Promise<Invite[]> {
        const invites: Invite[] = await this.inviteRepository.findAll({ where: { groupId } })
        return invites
    }

    async createInvite(dto: CreateInviteDto): Promise<Invite> {
        const invite: Invite = await this.inviteRepository.create({
            id: nanoid(11),
            ...dto,
            ttl: dto.ttl || 1209600000
        })
        return invite
    }

    async useInvite(inviteId: string): Promise<Invite> {
        const invite: Invite = await this.inviteRepository.findByPk(inviteId)
        if (!invite)
            throw new NotFoundException({ message: 'Invite not found' })
        if (invite.remainingUsages === 1) {
            await invite.destroy()
            return invite
        }
        await invite.update({ remainingUsages: invite.remainingUsages - 1 })
        return invite
    }

    async deleteExpiredInvites(): Promise<void> {
        const invites: Invite[] = await this.inviteRepository.findAll()
        const expiredInvitesIds: { id: string }[] = invites
            .filter(inv => inv.createdAt < Date.now() - inv.ttl)
            .map(inv => ({ id: inv.id }))
        const a = await this.inviteRepository.destroy({ where: { [Op.or]: expiredInvitesIds } })
        console.log(a)
        return
    }

}