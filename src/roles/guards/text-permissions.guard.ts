// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
// import { Reflector } from '@nestjs/core'
// import { Role } from 'src/roles/models/roles.model'
// import { RolePermissionsConstants } from 'src/roles/types/permissions'
// import { PERMISSIONS_KEY } from '../decorators/required-permissions.decorator'

// @Injectable()
// export class TextPermissionsGuard implements CanActivate {

//     constructor(
//         private reflector: Reflector,
//         private
//     ) {}

//     canActivate(context: ExecutionContext): boolean {
//         const requiredPermissions =
//             this.reflector.getAllAndOverride<RolePermissionsConstants>(PERMISSIONS_KEY, [
//                 context.getHandler(),
//                 context.getClass(),
//             ])
//         if (!requiredPermissions) {
//             return true
//         }
//         const { user } = context.switchToHttp().getRequest()
//         const userRolesInGroup: Role = await
//         // findAll userId roles
//         // return requiredPermissions.some((role) => user.roles?.includes(role))
//         return
//     }
// }