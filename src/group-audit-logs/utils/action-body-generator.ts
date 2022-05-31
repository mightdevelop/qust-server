import { CreateUpdateDelete } from 'src/utils/create-update-delete.enum'

export class ActionBodyGenerator {

    async generateCategoryCudActionBody(
        userId: string,
        categoryName: string,
        action: CreateUpdateDelete
    ): Promise<string> {
        return [ userId, action + 'd', 'category', categoryName ].join(' ')
    }

    async generateTextChannelCudActionBody(
        userId: string,
        channelName: string,
        action: CreateUpdateDelete
    ): Promise<string> {
        return [ userId, action + 'd', 'text channel', channelName ].join(' ')
    }

}
