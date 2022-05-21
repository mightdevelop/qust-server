import { User } from '../models/users.model'
import { UserToResponse } from '../types/user-to-response.class'

export const usersToResponse = async (users: User[]): Promise<UserToResponse[]> => users
    .map(({ id, username, info }) => ({ id, username, info }))