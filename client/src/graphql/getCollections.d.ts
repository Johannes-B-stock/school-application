/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getCollections
// ====================================================

export interface getCollections_getApplicationQuestionCollections_questions {
  __typename: "ApplicationQuestion";
  id: number;
  question: string;
}

export interface getCollections_getApplicationQuestionCollections {
  __typename: "ApplicationQuestionCollection";
  id: number;
  name: string;
  description: string | null;
  type: string | null;
  questions: (getCollections_getApplicationQuestionCollections_questions | null)[] | null;
}

export interface getCollections {
  getApplicationQuestionCollections: (getCollections_getApplicationQuestionCollections | null)[] | null;
}
