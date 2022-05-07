import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript'
import { User } from 'src/users/models/users.model'
import { GroupUser } from './group-user.model'
import { Role } from '../../roles/models/roles.model'
import { Category } from 'src/categories/models/categories.model'

@Table({ tableName: 'groups' })
export class Group extends Model<Group> {

    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @BelongsTo(() => User)
        owner: User

    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => User)
        ownerId: string

    @Column({ type: DataType.STRING, allowNull: false })
        name: string

    @BelongsToMany(() => User, () => GroupUser)
        users: User[]

    @HasMany(() => Role)
        roles: Role[]

    @HasMany(() => Category)
        categories: Category[]

    // @HasMany(() => InviteLink)
    //     inviteLinks: InviteLink[]

    // @HasMany(() => Emoji)
    //     emojis: Emoji[]

}

