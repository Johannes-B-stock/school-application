/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Role } from "./../../../types/globalTypes";

// ====================================================
// GraphQL query operation: getUser
// ====================================================

export interface getUser_getUser {
  __typename: "User";
  id: number;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  avatarFileName: string | null;
  role: Role | null;
}

export interface getUser {
  getUser: getUser_getUser | null;
}
