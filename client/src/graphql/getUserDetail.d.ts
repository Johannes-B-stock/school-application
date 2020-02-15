/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Role } from "./../types/globalTypes";

// ====================================================
// GraphQL query operation: getUserDetail
// ====================================================

export interface getUserDetail_getUser {
  __typename: "User";
  id: number;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  role: Role | null;
}

export interface getUserDetail {
  getUser: getUserDetail_getUser | null;
}
