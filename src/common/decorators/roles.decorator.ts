import { SetMetadata } from '@nestjs/common';
import { ROLES } from 'common/constants/enums';

export const ROLE_KEY = 'role';
export const Roles = (...roles: ROLES[]) => SetMetadata(ROLE_KEY, roles);
