const generateAddUsersMessageContent = (
    usernameWhoAdded: string,
    chattersUsernames: string[]
) =>  `${usernameWhoAdded} added ${chattersUsernames.length} users to the chat: ${chattersUsernames.join(', ')}`

export {
    generateAddUsersMessageContent,
}