# Qust
Qust is a Discord-like social media server application for text chatting

## Stack:
NestJS - Node.js framework
Typescript
PostgreSQL - main database
Redis - for refresh tokens
Swagger - API docs

## How to run
docker compose up --build

## Features
* Friend list
* User status (online/offline/invisible)
* Direct messages
* Chats
* Unread/read marks
* Servers/guilds (called *group* in the API)
* Text channels
* Categories of text channels
* User roles on servers
* Permissions, flexible to configure
* Audit journal for easier moderation on servers
* Mentions

## How to start chatting
There are 3 ways to chat with friends in the Qust application:
1. Add a friend into a friend list and send a DM
2. Add friends into a friend list, then add them to a chat, and send a message to the chat
3. Create a Qust server, invite friends, and send a message into a text channel

Note: "Qust server" is *group* in the Qust API
