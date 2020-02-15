/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InputCreateSchoolApplication } from "./../types/globalTypes";

// ====================================================
// GraphQL mutation operation: createApplication
// ====================================================

export interface createApplication_createSchoolApplication {
  __typename: "SchoolApplication";
  id: number | null;
}

export interface createApplication {
  /**
   *  create a new schoolApplication 
   */
  createSchoolApplication: createApplication_createSchoolApplication | null;
}

export interface createApplicationVariables {
  input: InputCreateSchoolApplication;
}
