/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InputCreateApplicationQuestionCollection } from "./../types/globalTypes";

// ====================================================
// GraphQL mutation operation: createCollection
// ====================================================

export interface createCollection_createApplicationQuestionCollection_questions {
  __typename: "ApplicationQuestion";
  id: number;
  question: string;
}

export interface createCollection_createApplicationQuestionCollection {
  __typename: "ApplicationQuestionCollection";
  id: number;
  name: string;
  description: string | null;
  type: string | null;
  questions: (createCollection_createApplicationQuestionCollection_questions | null)[] | null;
}

export interface createCollection {
  createApplicationQuestionCollection: createCollection_createApplicationQuestionCollection | null;
}

export interface createCollectionVariables {
  input?: InputCreateApplicationQuestionCollection | null;
}
