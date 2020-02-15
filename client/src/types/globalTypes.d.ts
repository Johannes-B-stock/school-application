/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum Role {
  ADMIN = "ADMIN",
  SCHOOLADMIN = "SCHOOLADMIN",
  STAFF = "STAFF",
  STUDENT = "STUDENT",
  USER = "USER",
}

export interface InputApplicationAnswer {
  answer: string;
  questionId: number;
  question: string;
}

/**
 *  input to create a new schoolApplication 
 */
export interface InputCreateSchoolApplication {
  userId: number;
  schoolId: number;
  answers?: (InputApplicationAnswer | null)[] | null;
}

/**
 *  used for logging in 
 */
export interface InputLogin {
  email: string;
  password: string;
}

/**
 *  used for creating a new user 
 */
export interface InputRegisterUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
