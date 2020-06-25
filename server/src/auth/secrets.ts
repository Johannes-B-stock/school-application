import * as jsonwebtoken from 'jsonwebtoken';
import { user } from '@prisma/client';

// some salt for hashing the password
export const hashSalt = process.env.HASH_SALT;
// a secret for signing with jwt
export const jwtSecret = process.env.JWT_SECRET;

// tslint:disable-next-line: no-shadowed-variable
export function createToken(user: user) {
  return jsonwebtoken.sign(
    {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarFileName: user.avatarFileName,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: '1 day' }
  );
}
