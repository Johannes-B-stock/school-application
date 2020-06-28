/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getUserForProfile
// ====================================================

export interface getUserForProfile_getUser {
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

export interface getUserForProfile {
  getUser: getUserForProfile_getUser | null;
}
