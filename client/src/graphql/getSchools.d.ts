/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getSchools
// ====================================================

export interface getSchools_getSchools {
  __typename: "School";
  id: number | null;
  name: string | null;
  description: string | null;
  startDate: any | null;
  endDate: any | null;
  acronym: string | null;
  schoolEmail: string | null;
  outreachStartDate: any | null;
  outreachEndDate: any | null;
}

export interface getSchools {
  /**
   *  get all schools 
   */
  getSchools: (getSchools_getSchools | null)[] | null;
}
