import { UseGuards } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import {
    ConnectedSocket,
    MessageBody, SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { SocketIoCurrentUser } from 'src/auth/decorators/socket.io-current-user.decorator'
import { SocketIoJwtAuthGuard } from 'src/auth/guards/socket.io-jwt.guard'
import { UserFromRequest } from 'src/auth/types/request-response'
import { RequiredGroupPermissions } from 'src/permissions/decorators/required-group-permissions.decorator'
import { SocketIoGroupPermissionsGuard } from 'src/permissions/guards/socket.io-group-permissions.guard'
import { RolePermissions } from 'src/permissions/models/role-permissions.model'
import { RolePermissionsListClass } from 'src/permissions/types/permissions/role-permissions-list.class'
import { RolePermissionsEnum } from 'src/permissions/types/permissions/role-permissions.enum'
import { SocketIoService } from 'src/socketio/socketio.service'
import { User } from 'src/users/models/users.model'
import { UsersService } from 'src/users/users.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { InternalRolesCudEvent } from './events/internal-roles.CUD.event'
import { Role } from './models/roles.model'
import { RolesService } from './roles.service'

@WebSocketGateway(8080, { cors: { origin: '*' }, namespace: '/roles' })
export class RolesGateway {

    constructor(
        private rolesService: RolesService,
        private socketIoService: SocketIoService,
        private usersService: UsersService,
    ) {}

    @WebSocketServer()
        server: Server

    @SubscribeMessage('create-role')
    @RequiredGroupPermissions([ RolePermissionsEnum.manageRoles ])
    @UseGuards(SocketIoJwtAuthGuard, SocketIoGroupPermissionsGuard)
    async createRole(
        @ConnectedSocket() socket: Socket,
        @MessageBody() dto: CreateRoleDto
    ): Promise<void> {
        const role: Role = await this.rolesService.createRole(dto)
        const groupUsers: User[] = await this.usersService.getUsersByGroupId(dto.groupId)
        const sockets = await this.server.fetchSockets()
        const socketsOfGroupUsers = (await this.socketIoService.getClients())
            .filter(client => groupUsers.some(groupUser => groupUser.id === client.userId))
            .map(client => sockets.find(socket => socket.id === client.socketId))
        socketsOfGroupUsers.forEach(socket => socket.join('group:' + role.groupId))

        socket.emit('200', role)
    }

    @SubscribeMessage('update-role')
    @RequiredGroupPermissions([ RolePermissionsEnum.manageRoles ])
    @UseGuards(SocketIoJwtAuthGuard, SocketIoGroupPermissionsGuard)
    async updateRole(
        @SocketIoCurrentUser() user: UserFromRequest,
        @ConnectedSocket() socket: Socket,
        @MessageBody() { name, color, roleId, permissions }: {
            name?: string
            color?: string
            roleId: string
            permissions?: RolePermissionsListClass
        }
    ): Promise<void> {
        const role: Role = await this.rolesService.getRoleById(roleId, RolePermissions)
        if (!role) {
            socket.emit('404', 'Role not found')
            return
        }
        await this.rolesService.updateRole({ name, color, role, permissions, userId: user.id })
        socket.emit('200', role)
    }

    @SubscribeMessage('delete-role')
    @RequiredGroupPermissions([ RolePermissionsEnum.manageRoles ])
    @UseGuards(SocketIoJwtAuthGuard, SocketIoGroupPermissionsGuard)
    async deleteRole(
        @SocketIoCurrentUser() user: UserFromRequest,
        @ConnectedSocket() socket: Socket,
        @MessageBody() { roleId }: { roleId: string }
    ): Promise<void> {
        const role: Role = await this.rolesService.getRoleById(roleId)
        if (!role) {
            socket.emit('404', 'Role not found')
            return
        }
        await this.rolesService.deleteRole({ role, userId: user.id })
        socket.emit('200', role)
    }

    @OnEvent('internal-roles.created')
    async showToSocketsNewRole(event: InternalRolesCudEvent): Promise<void> {
        this.server
            .to('group:' + event.groupId)
            .emit('role-created', event.role)
    }

    @OnEvent('internal-roles.updated')
    async showToSocketsUpdatedRole(event: InternalRolesCudEvent): Promise<void> {
        this.server
            .to('group:' + event.groupId)
            .emit('role-updated', event.role)
    }

    @OnEvent('internal-roles.deleted')
    async hideFromSocketsDeletedRole(event: InternalRolesCudEvent): Promise<void> {
        this.server
            .to('group:' + event.groupId)
            .emit('role-deleted', event.role)
    }

}