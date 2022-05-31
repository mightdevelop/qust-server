import { usersToResponse } from 'src/users/utils/users-to-response.func'
import { LoggedAction } from '../models/logged-action.model'
import { LoggedActionToResponse } from '../types/logged-actions-to-response.class'

export const loggedActionsToResponse = (actions: LoggedAction[]): LoggedActionToResponse[] => actions
    .map(action => ({
        id: action.id,
        user: action.user? usersToResponse([ action.user ])[0] : undefined,
        body: action.body
    }))