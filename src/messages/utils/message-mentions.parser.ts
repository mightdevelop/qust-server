export const parseMessageMentions = (text: string) =>
    text
        .match(/<@[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}>/g)
        ?.map(mention => mention.substring(2, 38))