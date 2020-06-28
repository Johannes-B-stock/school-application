/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InputUpdateUser } from "./../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: updateUser
// ====================================================

export interface updateUser_updateUser {
  __typename: "User";
  id: number;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  avatarFileName: string | null;
  gender: string | null;
  birthday: any | null;
  email: string;
}

export interface updateUser {
  /**
   *  update User properties 
   */
  updateUser: updateUser_updateUser | null;
}

export interface updateUserVariables {
  input: InputUpdateUser;
}
