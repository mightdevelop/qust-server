import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from './users/models/users.model'
import 'dotenv/config'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { MessagesModule } from './messages/messages.module'
import { ChatsModule } from './chats/chats.module'
import { Chat } from './chats/models/chats.model'
import { Message } from './messages/models/messages.model'
import { MessageContent } from './messages/models/message-content.model'
import { ChatUser } from './chats/models/chat-user.model'
import { ChatMessage } from './messages/models/chat-message.model'
import { Group } from './groups/models/groups.model'
import { GroupUser } from './groups/models/group-user.model'
import { TextChannel } from './text-channels/models/text-channels.model'
import { Category } from './categories/models/categories.model'
import { Role } from './roles/models/roles.model'
import { RoleUser } from './roles/models/role-user.model'
import { TextChannelRolePermissions } from './text-channels/models/text-channel-role-permissions.model'
import { CategoryRolePermissions } from './categories/models/category-role-permissions.model'
import { TextChannelsModule } from './text-channels/text-channels.module'
import { CategoriesModule } from './categories/categories.module'
import { GroupsModule } from './groups/groups.module'
import { Friend } from './friends/models/friends.model'
import { FriendsModule } from './friends/friends.module'
import { RolePermissions } from './permissions/models/role-permissions.model'
import { PermissionsModule } from './permissions/permissions.module'
import { RolesModule } from './roles/roles.module'
import { InvitesModule } from './invites/invites.module'
import { TextChannelMessage } from './messages/models/text-channel-message.model'
import { BannedUser } from './group-blacklists/models/banned-users.model'
import { GroupBlacklist } from './group-blacklists/models/group-blacklists.model'
import { GroupBlacklistsModule } from './group-blacklists/group-blacklists.module'
import { LoggedAction } from './group-audit-logs/models/logged-action.model'
import { GroupAuditLog } from './group-audit-logs/models/group-audit-logs.model'
import { GroupAuditLogsModule } from './group-audit-logs/group-audit-logs.module'
import { Mention } from './mentions/models/mentions.model'
import { MentionsModule } from './mentions/mentions.module'
import { UnreadMarksModule } from './unread-marks/unread-marks.module'
import { UnreadMark } from './unread-marks/models/read-marks.model'
import { UserSettingsModule } from './users-settings/users-settings.module'
import { UserSettings } from './users-settings/models/user-settings.model'


@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [ `@${process.env.NODE_ENV}.env`, '@.env' ]
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: +process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USER,
            password: String(process.env.POSTGRES_PASSWORD),
            database: process.env.POSTGRES_DB,
            models: [
                User,
                Friend,
                Chat,
                ChatUser,
                Message,
                MessageContent,
                ChatMessage,
                Group,
                GroupUser,
                Role,
                RoleUser,
                RolePermissions,
                TextChannel,
                TextChannelRolePermissions,
                TextChannelMessage,
                Category,
                CategoryRolePermissions,
                GroupBlacklist,
                BannedUser,
                GroupAuditLog,
                LoggedAction,
                Mention,
                UnreadMark,
                UserSettings,
            ],
            autoLoadModels: true,
            retryAttempts: 0
        }),
        forwardRef(() => UsersModule),
        forwardRef(() => AuthModule),
        forwardRef(() => FriendsModule),
        forwardRef(() => MessagesModule),
        forwardRef(() => ChatsModule),
        forwardRef(() => GroupsModule),
        forwardRef(() => RolesModule),
        forwardRef(() => PermissionsModule),
        forwardRef(() => CategoriesModule),
        forwardRef(() => TextChannelsModule),
        forwardRef(() => InvitesModule),
        forwardRef(() => GroupBlacklistsModule),
        forwardRef(() => GroupAuditLogsModule),
        forwardRef(() => MentionsModule),
        forwardRef(() => UnreadMarksModule),
        forwardRef(() => UserSettingsModule),
    ]
})
export class AppModule {}
