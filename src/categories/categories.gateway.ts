import { UseGuards } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { JwtService } from '@nestjs/jwt'
import {
    ConnectedSocket,
    MessageBody, OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { SocketIoJwtAuthGuard } from 'src/auth/guards/socket.io-jwt.guard'
import { TokenPayload } from 'src/auth/types/tokenPayload'
import { InternalCategoriesCreatedEvent } from 'src/categories/events/internal-categories-created.event'
import { InternalCategoriesUpdatedEvent } from 'src/categories/events/internal-categories-updated.event'
import { SocketIoService } from 'src/socketio/socketio.service'
import { User } from 'src/users/models/users.model'
import { UsersService } from 'src/users/users.service'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { InternalCategoriesDeletedEvent } from './events/internal-categories-deleted.event'
import { Category } from './models/categories.model'

@WebSocketGateway(8080, { cors: { origin: '*' }, namespace: '/categories' })
export class CategoriesGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private categoriesService: CategoriesService,
        private socketIoService: SocketIoService,
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    @WebSocketServer()
        server: Server

    async handleConnection(@ConnectedSocket() socket: Socket) {
        const { id } = this.jwtService.decode(
            socket.handshake.query['access_token'].toString()
        ) as TokenPayload
        await this.socketIoService.pushSocket({ userId: id, socket })
        socket.emit('200', socket.id)
    }
    async handleDisconnect(@ConnectedSocket() socket: Socket) {
        await this.socketIoService.popSocket(socket)
    }

    @SubscribeMessage('create-category')
    @UseGuards(SocketIoJwtAuthGuard)
    async createCategory(
        @ConnectedSocket() socket: Socket,
        @MessageBody() dto: CreateCategoryDto
    ): Promise<void> {
        const category: Category = await this.categoriesService.createCategory(dto)
        const groupUsers: User[] = await this.usersService.getUsersByGroupId(dto.groupId)
        const socketsOfGroupUsers = (await this.socketIoService.getConnectedSockets())
            .filter(user => groupUsers.some(groupUser => groupUser.id === user.id))
            .map(user => user.socket)
        socketsOfGroupUsers.forEach(socket => socket.join('group:' + category.groupId))

        socket.emit('200', category)
    }

    @SubscribeMessage('update-category')
    @UseGuards(SocketIoJwtAuthGuard)
    async updateCategory(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { name, categoryId }: { name: string, categoryId: string}
    ): Promise<void> {
        const category: Category = await this.categoriesService.getCategoryById(categoryId)
        await this.categoriesService.updateCategory({ name, category })
        socket.emit('200', category)
    }

    @SubscribeMessage('delete-category')
    @UseGuards(SocketIoJwtAuthGuard)
    async deleteCategory(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { categoryId }: { categoryId: string}
    ): Promise<void> {
        const category: Category = await this.categoriesService.getCategoryById(categoryId)
        await this.categoriesService.deleteCategory({ category })
        socket.emit('200', category)
    }

    @OnEvent('internal-categories.created')
    async showToSocketsNewCategory(event: InternalCategoriesCreatedEvent): Promise<void>  {
        const socketsOfGroupUsers = (await this.socketIoService.getConnectedSockets())
            .filter(user => event.usersIds.some(userId => userId === user.id))
            .map(user => user.socket)
        this.server
            .to(socketsOfGroupUsers.map(socket => socket.id))
            .emit('category-created', event.category)
    }

    @OnEvent('internal-categories.updated')
    async showToSocketsUpdatedCategory(event: InternalCategoriesUpdatedEvent): Promise<void>  {
        const socketsOfGroupUsers = (await this.socketIoService.getConnectedSockets())
            .filter(user => event.usersIds.some(userId => userId === user.id))
            .map(user => user.socket)
        this.server
            .to(socketsOfGroupUsers.map(socket => socket.id))
            .emit('category-updated', event.category)
    }

    @OnEvent('internal-categories.deleted')
    async hideFromSocketsDeletedCategory(event: InternalCategoriesDeletedEvent): Promise<void>  {
        const socketsOfGroupUsers = (await this.socketIoService.getConnectedSockets())
            .filter(user => event.usersIds.some(userId => userId === user.id))
            .map(user => user.socket)
        this.server
            .to(socketsOfGroupUsers.map(socket => socket.id))
            .emit('category-deleted', event.categoryId)
    }

}