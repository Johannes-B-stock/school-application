import { prisma, getDbUser } from '../../db';
import { gql, AuthenticationError } from 'apollo-server-express';
import { authenticateContext, IContext } from 'src/auth';
import { AuthorizationError } from 'src/auth/errors';

const typeDefs = gql`
  extend type Query {
    getApplicationQuestionCollections: [ApplicationQuestionCollection!]
  }
  extend type Mutation {
    createApplicationQuestion(
      input: InputCreateApplicationQuestion!
    ): ApplicationQuestion!
    createApplicationQuestionCollection(
      input: InputCreateApplicationQuestionCollection!
    ): ApplicationQuestionCollection!
  }

  input InputCreateApplicationQuestion {
    questionCollection: Int!
    question: String
  }

  input InputCreateApplicationQuestionCollection {
    name: String!
    description: String
    type: String
    questions: [String]
  }

  input InputApplicationAnswer {
    answer: String!
    questionId: Int!
    question: String!
  }

  type ApplicationQuestionCollection {
    id: Int!
    name: String!
    description: String
    type: String
    questions: [ApplicationQuestion]
  }

  type ApplicationQuestion {
    id: Int!
    question: String!
    questionCollection: ApplicationQuestionCollection!
  }

  type ApplicationAnswer {
    id: Int!
    schoolApplication: SchoolApplication
    answer: String
    question: ApplicationQuestion
  }
`;

export default {
  resolvers: {
    Query: {
      getApplicationQuestionCollections: async (
        _root: any,
        {}: any,
        context: IContext
      ): Promise<GQL.ApplicationQuestionCollection[]> => {
        const tokenUser = await authenticateContext(context);
        if (!tokenUser) {
          throw new AuthenticationError('You need to log in to see this page.');
        }
        const user = await getDbUser(tokenUser.id);
        if (user.role < 3) {
          throw new AuthorizationError(
            'Only school admins or admins can see the questionCollections for schools'
          );
        }
        const questions = await prisma.application_question_collection.findMany();
        return questions;
      },
    },
    Mutation: {
      createApplicationQuestion: async (
        _root: any,
        { input }: GQL.MutationToCreateApplicationQuestionArgs,
        context: IContext
      ): Promise<GQL.ApplicationQuestion> => {
        const tokenUser = await authenticateContext(context);
        if (!tokenUser) {
          throw new AuthenticationError('You need to log in to see this page.');
        }
        const user = await getDbUser(tokenUser.id);
        if (user.role < 3) {
          throw new AuthorizationError(
            'Only school admins or admins can edit schools'
          );
        }
        const question = await prisma.application_question.create({
          data: {
            application_question_collection: {
              connect: { id: input.questionCollection },
            },
            question: input.question,
          },
          include: {
            application_question_collection: true,
          },
        });
        return {
          ...question,
          questionCollection: question.application_question_collection,
        };
      },
      createApplicationQuestionCollection: async (
        _root: any,
        { input }: GQL.MutationToCreateApplicationQuestionCollectionArgs,
        context: IContext
      ): Promise<GQL.ApplicationQuestionCollection> => {
        const tokenUser = await authenticateContext(context);
        if (!tokenUser) {
          throw new AuthenticationError('You need to log in to see this page.');
        }
        const user = await getDbUser(tokenUser.id);
        if (user.role < 3) {
          throw new AuthorizationError(
            'Only school admins or admins can edit application questions'
          );
        }
        const questionCollection = await prisma.application_question_collection.create(
          {
            data: {
              name: input.name,
              description: input.description,
              type: input.type,
              application_question: {
                create: input.questions.map(question => {
                  return { question };
                }),
              },
            },
            include: {
              application_question: true,
            },
          }
        );
        return {
          ...questionCollection,
          questions: questionCollection.application_question.map(q => {
            return { ...q, questionCollection };
          }),
        };
      },
    },
  },
  typeDefs: [typeDefs],
};
