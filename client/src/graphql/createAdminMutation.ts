/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InputRegisterUser, Role } from "./../types/globalTypes";

// ====================================================
// GraphQL mutation operation: createAdminMutation
// ====================================================

export interface createAdminMutation_createAdmin_user {
  __typename: "User";
  id: number;
  firstName: string | null;
  role: Role | null;
  avatarFileName: string | null;
}

export interface createAdminMutation_createAdmin {
  __typename: "UserLogin";
  user: createAdminMutation_createAdmin_user;
  token: string;
}

export interface createAdminMutation {
  /**
   *  register a new user 
   */
  createAdmin: createAdminMutation_createAdmin;
}

export interface createAdminMutationVariables {
  input: InputRegisterUser;
}
