import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Includeable, Op } from 'sequelize'
import { CreateMentionsDto } from './dto/create-mentions.dto'
import { DeleteMentionsDto } from './dto/delete-mentions.dto'
import { Mention } from './models/mentions.model'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InternalMentionsCudEvent } from './events/internal-mentions.CUD.event'


@Injectable()
export class MentionsService {

    constructor(
        private eventEmitter: EventEmitter2,
        @InjectModel(Mention) private mentionRepository: typeof Mention,
    ) {}

    async getMentionById(
        mentionId: string,
        include?: Includeable | Includeable[],
        limit?: number,
        offset?: number,
    ): Promise<Mention> {
        return await this.mentionRepository.findByPk(mentionId, { include, limit, offset })
    }

    async getMentionsByIds(
        mentionsIds: string[],
        include?: Includeable | Includeable[],
        limit?: number,
        offset?: number,
    ): Promise<Mention[]> {
        return await this.mentionRepository.findAll({
            where: { [Op.or]: mentionsIds.map(id => ({ id })) }, include, limit, offset
        })
    }

    async getMentionsByUserId(
        userId: string,
        include?: Includeable | Includeable[],
        limit?: number,
        offset?: number,
    ): Promise<Mention[]> {
        return await this.mentionRepository.findAll({ where: { userId }, include, limit, offset })
    }

    async getMentionsByMessageId(
        messageId: string,
        include?: Includeable | Includeable[],
        limit?: number,
        offset?: number,
    ): Promise<Mention[]> {
        return await this.mentionRepository.findAll({ where: { messageId }, include, limit, offset })
    }

    async getMentionsByTextChannelId(
        textChannelId: string,
        include?: Includeable | Includeable[],
        limit?: number,
        offset?: number,
    ): Promise<Mention[]> {
        return await this.mentionRepository.findAll({ where: { textChannelId }, include, limit, offset })
    }

    async getMentionsByGroupId(
        groupId: string,
        include?: Includeable | Includeable[],
        limit?: number,
        offset?: number,
    ): Promise<Mention[]> {
        return await this.mentionRepository.findAll({ where: { groupId }, include, limit, offset })
    }

    async createMentions(
        { usersIds, groupId, messageId, textChannelId }: CreateMentionsDto
    ): Promise<Mention[]> {
        const mentions: Mention[] = await this.mentionRepository.bulkCreate(
            usersIds.map(userId => ({ groupId, messageId, textChannelId, userId })), { validate: true }
        )
        this.eventEmitter.emit(
            'internal-mentions.created',
            new InternalMentionsCudEvent({
                mentions,
                usersIds,
                action: 'delete'
            })
        )
        return mentions
    }

    async deleteMentions(
        { mentions, userId }: DeleteMentionsDto
    ): Promise<Mention[]> {
        await this.mentionRepository.destroy({
            where: { [Op.or]: mentions.map(mention => ({ id: mention.id })) }
        })
        this.eventEmitter.emit(
            'internal-mentions.deleted',
            new InternalMentionsCudEvent({
                mentions,
                usersIds: [ userId ] || mentions.map(mention => mention.userId),
                action: 'delete'
            })
        )
        return mentions
    }

}