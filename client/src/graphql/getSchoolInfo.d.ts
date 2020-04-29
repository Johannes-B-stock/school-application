/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getSchoolInfo
// ====================================================

export interface getSchoolInfo_getSchoolInfoForApplication_questions {
  __typename: "ApplicationQuestion";
  id: number;
  question: string;
}

export interface getSchoolInfo_getSchoolInfoForApplication {
  __typename: "School";
  id: number;
  acronym: string;
  name: string;
  online: boolean | null;
  description: string | null;
  questions: getSchoolInfo_getSchoolInfoForApplication_questions[] | null;
}

export interface getSchoolInfo {
  getSchoolInfoForApplication: getSchoolInfo_getSchoolInfoForApplication | null;
}

export interface getSchoolInfoVariables {
  schoolId: number;
}
