export class MessageLocation {

    location: MessageTextChannelLocation | MessageChatLocation

}

export class MessageTextChannelLocation {
    groupId: string
    textChannelId: string
}
export class MessageChatLocation {
    chatId: string
}