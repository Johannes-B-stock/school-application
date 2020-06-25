/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InputRegisterUser, Role } from "./../types/globalTypes";

// ====================================================
// GraphQL mutation operation: registerUser
// ====================================================

export interface registerUser_registerUser_user {
  __typename: "User";
  id: number;
  firstName: string | null;
  role: Role | null;
  avatarFileName: string | null;
}

export interface registerUser_registerUser {
  __typename: "UserLogin";
  user: registerUser_registerUser_user;
  token: string;
}

export interface registerUser {
  registerUser: registerUser_registerUser;
}

export interface registerUserVariables {
  input: InputRegisterUser;
}
