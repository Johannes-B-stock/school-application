import * as jsonwebtoken from 'jsonwebtoken';
import { user } from '@prisma/client';

// some salt for hashing the password
export const hashSalt = process.env.HASH_SALT;
// a secret for signing with jwt
export const jwtSecret = process.env.JWT_SECRET;

export function createToken(obj: user) {
  return jsonwebtoken.sign(
    {
      id: obj.id,
      firstName: obj.firstName,
      lastName: obj.lastName,
      role: obj.role,
    },
    jwtSecret,
    { expiresIn: '1 day' }
  );
}
