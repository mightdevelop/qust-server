import { Body, Controller, Delete, Get, Query, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { UserFromRequest } from 'src/auth/types/request-response'
import { MentionsService } from './mentions.service'
import { Mention } from './models/mentions.model'


@Controller('/mentions')
export class MentionsController {

    constructor(
        private mentionsService: MentionsService,
    ) {}

    @Get('/')
    @UseGuards(JwtAuthGuard)
    async getMentionsByUserId(
        @CurrentUser() user: UserFromRequest,
        @Query('offset') offset: number,
    ): Promise<Mention[]> {
        return await this.mentionsService.getMentionsByUserId(user.id, undefined, 30, offset )
    }

    @Delete('/')
    @UseGuards(JwtAuthGuard)
    async deleteMentionsByIds(
        @CurrentUser() user: UserFromRequest,
        @Body() { mentionsIds }: { mentionsIds: string[] },
    ): Promise<void> {
        const mentions: Mention[] = await this.mentionsService.getMentionsByIds(mentionsIds)
        await this.mentionsService.deleteMentions({ mentions, userId: user.id })
    }

}