import { User } from '../models/users.model'
import { UserToResponse } from '../types/user-to-response.class'

export const usersToResponse = (users: User[]): UserToResponse[] => users
    .map(({ id, username, info }) => ({ id, username, info }))