const friendshipRequestNotificationBody = (username: string) =>
    `${username} has requested your friendship`
const createChatNotificationBody = (username: string) =>
    `${username} created chat with you`

export {
    friendshipRequestNotificationBody,
    createChatNotificationBody
}