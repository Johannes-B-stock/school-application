/* eslint-disable @typescript-eslint/camelcase */
import { loginUser_loginUser_user } from '../graphql/loginUser';

export interface User extends loginUser_loginUser_user {
  token: string;
}
