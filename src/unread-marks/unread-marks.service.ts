import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Includeable, Op } from 'sequelize'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { UnreadMark } from './models/unread-marks.model'
import { InternalUnreadMarksCudEvent } from './events/internal-read-marks.CUD.event'
import { CreateUnreadMarksDto } from './dto/create-read-marks.dto'
import { DeleteUnreadMarksDto } from './dto/delete-read-marks.dto'
import { TextChannelsService } from 'src/text-channels/text-channels.service'
import { MessageLocation } from './types/message-location'
import { UpdateUnreadMarksDto } from './dto/update-read-marks.dto'


@Injectable()
export class UnreadMarksService {

    constructor(
        private eventEmitter: EventEmitter2,
        private textChannelsService: TextChannelsService,
        @InjectModel(UnreadMark) private unreadMarksRepository: typeof UnreadMark,
    ) {}

    async getUnreadMarksById(
        markId: string,
        include?: Includeable | Includeable[],
        limit?: number,
        offset?: number,
    ): Promise<UnreadMark> {
        return await this.unreadMarksRepository.findByPk(markId, { include, limit, offset })
    }

    async getUnreadMarksByIds(
        marksIds: string[],
        include?: Includeable | Includeable[],
        limit?: number,
        offset?: number,
    ): Promise<UnreadMark[]> {
        return await this.unreadMarksRepository.findAll({
            where: { [Op.or]: marksIds.map(id => ({ id })) }, include, limit, offset
        })
    }

    async getUnreadMarksByUserId(
        userId: string,
        include?: Includeable | Includeable[],
        limit?: number,
        offset?: number,
    ): Promise<UnreadMark[]> {
        return await this.unreadMarksRepository.findAll({ where: { userId }, include, limit, offset })
    }

    async getUnreadMarkByUserIdAndLocations(
        userId: string,
        messagesLocations: MessageLocation[],
        include?: Includeable | Includeable[],
        limit?: number,
        offset?: number,
    ): Promise<UnreadMark[]> {
        return await this.unreadMarksRepository.findAll({
            where: { [Op.or]: messagesLocations.map(messageLocation => ({ userId, messageLocation })) }, include,
            limit,
            offset
        })
    }

    async getUnreadMarksByLocations(
        messagesLocations: MessageLocation[],
        include?: Includeable | Includeable[],
        limit?: number,
        offset?: number,
    ): Promise<UnreadMark[]> {
        return await this.unreadMarksRepository.findAll({
            where: { [Op.or]: messagesLocations.map(messageLocation => ({ messageLocation })) }, include,
            limit,
            offset
        })
    }

    async getUnreadMarksByMessageId(
        messageId: string,
        include?: Includeable | Includeable[],
        limit?: number,
        offset?: number,
    ): Promise<UnreadMark[]> {
        return await this.unreadMarksRepository.findAll({ where: { messageId }, include, limit, offset })
    }

    async getUnreadMarksByTextChannelId(
        textChannelId: string,
        include?: Includeable | Includeable[],
        limit?: number,
        offset?: number,
    ): Promise<UnreadMark[]> {
        const groupId: string = await this.textChannelsService.getGroupIdByTextChannelId(textChannelId)
        return await this.unreadMarksRepository.findAll(
            { where: { messageLocation: { textChannelId, groupId } }, include, limit, offset }
        )
    }

    async createUnreadMarks(
        { usersIds, messageId, messageLocation }: CreateUnreadMarksDto
    ): Promise<UnreadMark[]> {
        const unreadMarks: UnreadMark[] = await this.unreadMarksRepository.bulkCreate(
            usersIds.map(userId => ({ userId, messageId, messageLocation })), { validate: true }
        )
        this.eventEmitter.emit(
            'internal-unread-marks.created',
            new InternalUnreadMarksCudEvent({
                unreadMarks,
                usersIds,
                action: 'create'
            })
        )
        return unreadMarks
    }

    async updateUnreadMarks(
        { usersIds, messageId, newMessageId }: UpdateUnreadMarksDto
    ): Promise<UnreadMark[]> {
        const unreadMarks: UnreadMark[] = await this.unreadMarksRepository.findAll({
            where: { [Op.or]: usersIds.map(userId => ({ userId, messageId })) }
        })
        await this.unreadMarksRepository.update({
            messageId: newMessageId
        }, {
            where: { [Op.or]: unreadMarks.map(mark => ({ id: mark.id })) }
        } )
        this.eventEmitter.emit(
            'internal-unread-marks.updated',
            new InternalUnreadMarksCudEvent({
                unreadMarks,
                usersIds: unreadMarks.map(mark => mark.userId),
                action: 'update'
            })
        )
        return unreadMarks
    }

    async deleteUnreadMarks(
        { unreadMarks }: DeleteUnreadMarksDto
    ): Promise<UnreadMark[]> {
        await this.unreadMarksRepository.destroy({
            where: { [Op.or]: unreadMarks.map(mark => ({ id: mark.id })) }
        })
        this.eventEmitter.emit(
            'internal-unread-marks.deleted',
            new InternalUnreadMarksCudEvent({
                unreadMarks,
                usersIds: unreadMarks.map(mark => mark.userId),
                action: 'delete'
            })
        )
        return unreadMarks
    }

}