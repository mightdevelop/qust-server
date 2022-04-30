// import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
// import { Channel } from 'src/channels/models/channels.model'
// import { Message } from './messages.model'

// @Table({ tableName: 'messages' })
// export class ChannelMessage extends Model<ChannelMessage> {

//     @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
//         id: number

//     @Column({ type: DataType.INTEGER, allowNull: false })
//     @ForeignKey(() => Message)
//         messageId: number

//     @Column({ type: DataType.INTEGER, allowNull: false })
//     @ForeignKey(() => Channel)
//         channelId: number

// }

