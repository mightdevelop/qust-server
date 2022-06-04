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
import { SocketIoCurrentUser } from 'src/auth/decorators/socket.io-current-user.decorator'
import { SocketIoJwtAuthGuard } from 'src/auth/guards/socket.io-jwt.guard'
import { UserFromRequest } from 'src/auth/types/request-response'
import { TokenPayload } from 'src/auth/types/tokenPayload'
import { InternalCategoriesCudEvent } from 'src/categories/events/internal-categories.CUD.event'
import { SocketIoService } from 'src/socketio/socketio.service'
import { User } from 'src/users/models/users.model'
import { UsersService } from 'src/users/users.service'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
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
        await this.socketIoService.pushClient({ userId: id, socketId: socket.id })
        socket.emit('200', socket.id)
    }
    async handleDisconnect(@ConnectedSocket() socket: Socket) {
        await this.socketIoService.removeClient(socket.id)
    }

    @SubscribeMessage('create-category')
    @UseGuards(SocketIoJwtAuthGuard)
    async createCategory(
        @ConnectedSocket() socket: Socket,
        @MessageBody() dto: CreateCategoryDto
    ): Promise<void> {
        const category: Category = await this.categoriesService.createCategory(dto)
        const groupUsers: User[] = await this.usersService.getUsersByGroupId(dto.groupId)
        const socketsOfGroupUsers = (await this.socketIoService.getSocketsByUsersIds(
            (await this.server.fetchSockets()),
            groupUsers.map(user => user.id)
        ))
        socketsOfGroupUsers.forEach(socket => socket.join('group:' + category.groupId))

        socket.emit('200', category)
    }

    @SubscribeMessage('update-category')
    @UseGuards(SocketIoJwtAuthGuard)
    async updateCategory(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { name, categoryId }: { name: string, categoryId: string},
        @SocketIoCurrentUser() user: UserFromRequest,
    ): Promise<void> {
        const category: Category = await this.categoriesService.getCategoryById(categoryId)
        await this.categoriesService.updateCategory({ name, category, userId: user.id })
        socket.emit('200', category)
    }

    @SubscribeMessage('delete-category')
    @UseGuards(SocketIoJwtAuthGuard)
    async deleteCategory(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { categoryId }: { categoryId: string},
        @SocketIoCurrentUser() user: UserFromRequest,
    ): Promise<void> {
        const category: Category = await this.categoriesService.getCategoryById(categoryId)
        await this.categoriesService.deleteCategory({ category, userId: user.id })
        socket.emit('200', category)
    }

    @OnEvent('internal-categories.created')
    @OnEvent('internal-categories.updated')
    @OnEvent('internal-categories.deleted')
    async showToSocketsNewCategory(event: InternalCategoriesCudEvent): Promise<void> {
        this.server
            .to('group:' + event.category.groupId)
            .emit(`category-${event.action}d`, event.category)
    }

}