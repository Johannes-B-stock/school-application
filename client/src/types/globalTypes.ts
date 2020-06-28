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

export interface InputCreateApplicationQuestionCollection {
  name: string;
  description?: string | null;
  type?: string | null;
  questions?: (string | null)[] | null;
}

/**
 *  input to create a new school 
 */
export interface InputCreateSchool {
  acronym: string;
  name: string;
  online?: boolean | null;
  hashtag?: string | null;
  description?: string | null;
  startDate?: any | null;
  endDate?: any | null;
  outreachStartDate?: any | null;
  outreachEndDate?: any | null;
  miniOutreachStartDate?: any | null;
  miniOutreachEndDate?: any | null;
  schoolEmail?: string | null;
  currency?: string | null;
  secondary?: boolean | null;
  applicationFee?: number | null;
  schoolFee?: number | null;
  miniOutreachFee?: number | null;
  outreachFee?: number | null;
  questionCollection?: number | null;
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

/**
 *  input to update an existing school 
 */
export interface InputUpdateSchool {
  id: number;
  acronym?: string | null;
  name?: string | null;
  online?: boolean | null;
  hashtag?: string | null;
  description?: string | null;
  startDate?: any | null;
  endDate?: any | null;
  outreachStartDate?: any | null;
  outreachEndDate?: any | null;
  miniOutreachStartDate?: any | null;
  miniOutreachEndDate?: any | null;
  schoolEmail?: string | null;
  currency?: string | null;
  secondary?: boolean | null;
  applicationFee?: number | null;
  schoolFee?: number | null;
  miniOutreachFee?: number | null;
  outreachFee?: number | null;
  questionCollection?: number | null;
}

/**
 *  used for updating an existing user 
 */
export interface InputUpdateUser {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  gender?: string | null;
  marriage?: string | null;
  maritalStatusDate?: any | null;
  spouseName?: string | null;
  children?: number | null;
  birthday?: any | null;
  website?: string | null;
  youtube?: string | null;
  facebook?: string | null;
  talents?: string | null;
  firstLanguage?: string | null;
  nativeLanguage?: string | null;
  secondLanguage?: string | null;
  secondLanguagePro?: number | null;
  thirdLanguage?: string | null;
  thirdLanguagePro?: number | null;
  otherLanguage?: string | null;
  otherLanguagePro?: number | null;
  life?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
