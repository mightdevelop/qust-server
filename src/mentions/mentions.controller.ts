import { Body, Controller, Delete, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { UserFromRequest } from 'src/auth/types/request-response'
import { PartialOffsetDto } from 'src/users/dto/partial-offset.dto'
import { DeleteMentionsBody } from './dto/delete-mentions.body'
import { MentionsService } from './mentions.service'
import { Mention } from './models/mentions.model'


@ApiTags('mentions')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('/mentions')
export class MentionsController {

    constructor(
        private mentionsService: MentionsService,
    ) {}

    @Get('/')
    async getMentionsByUserId(
        @CurrentUser() user: UserFromRequest,
        @Query() { offset }: PartialOffsetDto
    ): Promise<Mention[]> {
        return await this.mentionsService.getMentionsByUserId(
            user.id, undefined, 30, offset ? Number(offset) : undefined
        )
    }

    @Delete('/')
    async deleteMentionsByIds(
        @CurrentUser() user: UserFromRequest,
        @Body() { mentionsIds }: DeleteMentionsBody,
    ): Promise<void> {
        const mentions: Mention[] = await this.mentionsService.getMentionsByIds(mentionsIds)
        await this.mentionsService.deleteMentions({ mentions, userId: user.id })
    }

}