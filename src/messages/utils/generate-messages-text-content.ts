const generateAddUsersMessageContent = (
    userIdWhoAdded: string,
    chattersIds: string[]
) => `<@${userIdWhoAdded}> added ${chattersIds.length} users to the chat: ${chattersIds
    .map(id => `<@${id}>`)
    .join(', ')}`

export {
    generateAddUsersMessageContent,
}