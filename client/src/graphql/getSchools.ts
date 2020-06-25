/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getSchools
// ====================================================

export interface getSchools_getSchools {
  __typename: "School";
  id: number;
  name: string;
  description: string | null;
  startDate: any | null;
  endDate: any | null;
  acronym: string;
  schoolEmail: string | null;
  outreachStartDate: any | null;
  outreachEndDate: any | null;
}

export interface getSchools {
  /**
   *  get all schools 
   */
  getSchools: getSchools_getSchools[] | null;
}

export interface getSchoolsVariables {
  online?: boolean | null;
}
