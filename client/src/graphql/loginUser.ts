/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InputLogin, Role } from "./../types/globalTypes";

// ====================================================
// GraphQL mutation operation: loginUser
// ====================================================

export interface loginUser_loginUser_user {
  __typename: "User";
  id: number;
  firstName: string | null;
  role: Role | null;
  avatarFileName: string | null;
}

export interface loginUser_loginUser {
  __typename: "UserLogin";
  user: loginUser_loginUser_user;
  token: string;
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
