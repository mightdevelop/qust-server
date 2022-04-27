const addUsersMessageContent = (
    usernameWhoAdded: string,
    chattersUsernames: string[]
) =>  `${usernameWhoAdded} added ${chattersUsernames.length} to the chat: ${chattersUsernames.join(', ')}`

export {
    addUsersMessageContent,
}