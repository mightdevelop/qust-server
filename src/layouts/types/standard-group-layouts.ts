import { GroupLayout } from './group-layout.class'

export const StandardGroupLayouts: { [key:string]: GroupLayout } = {

    DEFAULT: {
        categoryLayouts: [
            {
                name: 'Text channels',
                channelLayouts: [
                    {
                        name: 'chatting',
                    },
                    {
                        name: 'flood'
                    }
                ]
            }
        ]
    }

}