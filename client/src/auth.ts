import { User } from './types/User';
import * as jsonwebtoken from 'jsonwebtoken';
import { Role } from './types/globalTypes';

function convertRole(roleNumber: number): Role {
  if (roleNumber === 0) {
    return Role.USER;
  }
  if (roleNumber === 1) {
    return Role.STUDENT;
  }
  if (roleNumber === 2) {
    return Role.STAFF;
  }
  if (roleNumber === 3) {
    return Role.SCHOOLADMIN;
  }
  if (roleNumber === 4) {
    return Role.ADMIN;
  }
  return Role.USER;
}

export function getStoredUser() {
  const token = localStorage.getItem('token') ?? '';
  let storedUser: User | undefined = undefined;
  const payload = jsonwebtoken.decode(token);
  if (payload && Date.now() < payload['exp'] * 1000) {
    storedUser = {
      id: payload['id'],
      firstName: payload['firstName'],
      role: convertRole(payload['role']),
      avatarFileName: payload['avatarFileName'],
      token: token,
    };
  }
  return storedUser;
}
