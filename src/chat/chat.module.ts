import { Module } from '@nestjs/common'
import { AuthModule } from 'src/auth/auth.module'
import { ChatService } from './chat.service'

@Module({
    providers: [ ChatService ],
    imports: [ AuthModule ]
})
export class ChatModule {}
