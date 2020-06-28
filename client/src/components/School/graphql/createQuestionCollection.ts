/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InputCreateApplicationQuestionCollection } from "./../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: createQuestionCollection
// ====================================================

export interface createQuestionCollection_createApplicationQuestionCollection_questions {
  __typename: "ApplicationQuestion";
  id: number;
  question: string;
}

export interface createQuestionCollection_createApplicationQuestionCollection {
  __typename: "ApplicationQuestionCollection";
  id: number;
  name: string;
  description: string | null;
  type: string | null;
  questions: (createQuestionCollection_createApplicationQuestionCollection_questions | null)[] | null;
}

export interface createQuestionCollection {
  createApplicationQuestionCollection: createQuestionCollection_createApplicationQuestionCollection;
}

export interface createQuestionCollectionVariables {
  input: InputCreateApplicationQuestionCollection;
}
