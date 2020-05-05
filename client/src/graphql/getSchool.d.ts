/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getSchool
// ====================================================

export interface getSchool_getSchoolInfoForApplication {
  __typename: "School";
  id: number;
  acronym: string;
  name: string;
  description: string | null;
  startDate: any | null;
  endDate: any | null;
  outreachStartDate: any | null;
  outreachEndDate: any | null;
  miniOutreachStartDate: any | null;
  miniOutreachEndDate: any | null;
  currency: string | null;
  applicationFee: number | null;
  schoolFee: number | null;
  miniOutreachFee: number | null;
  outreachFee: number | null;
  online: boolean | null;
}

export interface getSchool {
  getSchoolInfoForApplication: getSchool_getSchoolInfoForApplication | null;
}

export interface getSchoolVariables {
  schoolId: number;
}
