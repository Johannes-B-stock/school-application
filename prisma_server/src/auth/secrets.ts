import * as jsonwebtoken from 'jsonwebtoken';

// some salt for hashing the password
export const hashSalt = process.env.HASH_SALT;
// a secret for signing with jwt
export const jwtSecret = process.env.JWT_SECRET;

export function createToken(id: any) {
  return jsonwebtoken.sign(id, jwtSecret, { expiresIn: '1 day' });
}
