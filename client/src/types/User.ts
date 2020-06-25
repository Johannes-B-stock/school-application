import { Role } from './globalTypes';

export interface User {
  id: number;
  firstName: string | null;
  role: Role | null;
  avatarFileName: string | null;
  token: string;
}
