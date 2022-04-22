import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Notification } from './models/notifications.model'


@Injectable()
export class NotificationsService {

    constructor(
        @InjectModel(Notification) private notificationRepository: typeof Notification,
    ) {}



}