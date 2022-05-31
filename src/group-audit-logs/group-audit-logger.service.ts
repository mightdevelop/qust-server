import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { InternalCategoriesCudEvent } from 'src/categories/events/internal-categories.CUD.event'
import { InternalTextChannelsCudEvent } from 'src/text-channels/events/internal-text-channels.CUD.event'
import { GroupAuditLogsService } from './group-audit-logs.service'
import { ActionBodyGenerator } from './utils/action-body-generator'


@Injectable()
export class GroupAuditLogger {

    constructor(
        private auditLogsService: GroupAuditLogsService,
        private actionBodyGenerator: ActionBodyGenerator,
    ) {}

    @OnEvent('internal-categories.created')
    async logCreateCategoryAction(
        { category, userIdWhoTriggered }: InternalCategoriesCudEvent
    ): Promise<void> {
        await this.auditLogsService.addActionToGroupAuditLog({
            userId: userIdWhoTriggered,
            body: await this.actionBodyGenerator.generateCategoryCudActionBody(
                userIdWhoTriggered, category.name, 'create'
            ),
            groupId: category.groupId
        })
    }

    @OnEvent('internal-categories.updated')
    async logUpdateCategoryAction(
        { category, userIdWhoTriggered }: InternalCategoriesCudEvent
    ): Promise<void> {
        await this.auditLogsService.addActionToGroupAuditLog({
            userId: userIdWhoTriggered,
            body: await this.actionBodyGenerator.generateCategoryCudActionBody(
                userIdWhoTriggered, category.name, 'update'
            ),
            groupId: category.groupId
        })
    }

    @OnEvent('internal-categories.deleted')
    async logDeleteCategoryAction(
        { category, userIdWhoTriggered }: InternalCategoriesCudEvent
    ): Promise<void> {
        await this.auditLogsService.addActionToGroupAuditLog({
            userId: userIdWhoTriggered,
            body: await this.actionBodyGenerator.generateCategoryCudActionBody(
                userIdWhoTriggered, category.name, 'delete'
            ),
            groupId: category.groupId
        })
    }

    @OnEvent('internal-text-channels.created')
    async logCreateTextChannelAction(
        { channel, userIdWhoTriggered, groupId }: InternalTextChannelsCudEvent
    ): Promise<void> {
        await this.auditLogsService.addActionToGroupAuditLog({
            userId: userIdWhoTriggered,
            body: await this.actionBodyGenerator.generateTextChannelCudActionBody(
                userIdWhoTriggered, channel.name, 'create'
            ),
            groupId
        })
    }

    @OnEvent('internal-text-channels.updated')
    async logUpdateTextChannelAction(
        { channel, userIdWhoTriggered, groupId }: InternalTextChannelsCudEvent
    ): Promise<void> {
        await this.auditLogsService.addActionToGroupAuditLog({
            userId: userIdWhoTriggered,
            body: await this.actionBodyGenerator.generateTextChannelCudActionBody(
                userIdWhoTriggered, channel.name, 'update'
            ),
            groupId
        })
    }

    @OnEvent('internal-text-channels.deleted')
    async logDeleteTextChannelAction(
        { channel, userIdWhoTriggered, groupId }: InternalTextChannelsCudEvent
    ): Promise<void> {
        await this.auditLogsService.addActionToGroupAuditLog({
            userId: userIdWhoTriggered,
            body: await this.actionBodyGenerator.generateTextChannelCudActionBody(
                userIdWhoTriggered, channel.name, 'delete'
            ),
            groupId
        })
    }

}