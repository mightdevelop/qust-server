import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { AddActionToAuditLogDto } from './dto/add-action-to-audit-log.dto'
import { LoggedAction } from './models/logged-action.model'
import { GroupAuditLog } from './models/group-audit-logs.model'
import { Includeable } from 'sequelize/types'


@Injectable()
export class GroupAuditLogsService {

    constructor(
        @InjectModel(GroupAuditLog) private auditLogRepository: typeof GroupAuditLog,
        @InjectModel(LoggedAction) private actionsRepository: typeof LoggedAction,
    ) {}

    async getGroupAuditLogByGroupId(
        groupId: string,
    ): Promise<GroupAuditLog> {
        return await this.auditLogRepository.findOne({ where: { groupId } })
    }

    async getGroupAuditLogById(
        auditLogId: string,
    ): Promise<GroupAuditLog> {
        return await this.auditLogRepository.findByPk(auditLogId)
    }

    async getActionsByGroupId(
        groupId: string,
        include?: Includeable | Includeable[],
        limit?: number,
        offset?: number,
    ): Promise<LoggedAction[]> {
        const auditLog: GroupAuditLog = await this.auditLogRepository.findOne({ where: { groupId } })
        return await this.actionsRepository.findAll(
            { where: { auditLogId: auditLog.id }, include, limit, offset }
        )
    }

    async getActionsByAuditLogId(
        auditLogId: string,
        include?: Includeable | Includeable[],
        limit?: number,
        offset?: number,
    ): Promise<LoggedAction[]> {
        return await this.actionsRepository.findAll({ where: { id: auditLogId }, include, limit, offset })
    }

    async addActionToGroupAuditLog(
        { userId, groupId, body }: AddActionToAuditLogDto
    ): Promise<LoggedAction> {
        const auditLog: GroupAuditLog = await this.auditLogRepository.findOne({ where: { groupId } })
        return await this.actionsRepository.create({ userId, auditLogId: auditLog.id, body })
    }

}