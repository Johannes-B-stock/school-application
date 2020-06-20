import { User } from './types/User';
import * as jsonwebtoken from 'jsonwebtoken';

export function getStoredUser() {
  const token = localStorage.getItem('token') ?? '';
  let storedUser: User | undefined = undefined;
  const payload = jsonwebtoken.decode(token);
  if (payload && Date.now() < payload['exp'] * 1000) {
    storedUser = {
      id: payload['id'],
      firstName: payload['firstName'],
      role: payload['role'],
      token: token,
    };
  }
  return storedUser;
}
