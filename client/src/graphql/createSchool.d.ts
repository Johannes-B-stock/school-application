/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InputCreateSchool } from "./../types/globalTypes";

// ====================================================
// GraphQL mutation operation: createSchool
// ====================================================

export interface createSchool_createSchool {
  __typename: "School";
  id: number;
  acronym: string;
  name: string;
  description: string | null;
  startDate: any | null;
  endDate: any | null;
}

export interface createSchool {
  /**
   *  create a new school 
   */
  createSchool: createSchool_createSchool | null;
}

export interface createSchoolVariables {
  input: InputCreateSchool;
}
