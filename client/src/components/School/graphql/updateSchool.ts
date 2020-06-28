/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InputUpdateSchool } from "./../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: updateSchool
// ====================================================

export interface updateSchool_updateSchool {
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

export interface updateSchool {
  updateSchool: updateSchool_updateSchool | null;
}

export interface updateSchoolVariables {
  input: InputUpdateSchool;
}
