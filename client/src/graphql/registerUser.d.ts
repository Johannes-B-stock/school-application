/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InputRegisterUser, Role } from './../types/globalTypes';

// ====================================================
// GraphQL mutation operation: registerUser
// ====================================================

export interface registerUser_registerUser {
  __typename: 'UserLogin';
  id: number;
  token: string;
  firstName: string | null;
  role: Role;
}

export interface registerUser {
  registerUser: registerUser_registerUser;
}

export interface registerUserVariables {
  input: InputRegisterUser;
}
