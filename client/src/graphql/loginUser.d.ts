/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InputLogin, Role } from './../types/globalTypes';

// ====================================================
// GraphQL mutation operation: loginUser
// ====================================================

export interface loginUser_loginUser {
  __typename: 'UserLogin';
  id: number;
  firstName: string | null;
  token: string;
  role: Role;
}

export interface loginUser {
  /**
   *  login as a user
   */
  loginUser: loginUser_loginUser;
}

export interface loginUserVariables {
  input: InputLogin;
}
