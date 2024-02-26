import { UserRole } from '@magnetmlm/common';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const SetRoles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
