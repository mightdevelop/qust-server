import { CategoryLayout } from './category-layout.class'

export const StandardCategoryLayouts: { [key:string]: CategoryLayout[] } = {
    DEFAULT: [
        {
            name: 'Text channels',
            channels: [
                {
                    name: 'chatting'
                },
                {
                    name: 'flood'
                }
            ]
        }
    ]
}