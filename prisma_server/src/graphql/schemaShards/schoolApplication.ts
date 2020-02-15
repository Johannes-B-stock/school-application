import { prisma } from '../../db';
import { gql, AuthenticationError } from 'apollo-server';
import { pubsub } from '../subscriptionManager';
import { authenticateContext, IContext } from 'src/auth';
import { application, application_answer } from '@prisma/client';
import { AuthorizationError } from 'src/auth/errors';

const typeDefs = gql`
  extend type Query {
    " get all schoolApplications "
    getSchoolApplications: [SchoolApplication]
    getApplications(schoolId: Int!): [SchoolApplication]
    getMyApplications: [SchoolApplication]
  }

  extend type Mutation {
    " create a new schoolApplication "
    createSchoolApplication(
      input: InputCreateSchoolApplication!
    ): SchoolApplication
    updateSchoolApplication(
      input: InputUpdateSchoolApplication!
    ): SchoolApplication
    deleteSchoolApplication(input: InputDeleteSchoolApplication!): Boolean
    cancelSchoolApplication(
      input: InputDeleteSchoolApplication!
    ): SchoolApplication
    acceptApplication(appId: Int!): SchoolApplication
  }

  extend type Subscription {
    " called when a new schoolApplication is created "
    schoolApplicationCreated: SchoolApplication
  }

  " input to create a new schoolApplication "
  input InputCreateSchoolApplication {
    userId: Int!
    schoolId: Int!
    answers: [InputApplicationAnswer]
  }

  " input to update an existing schoolApplication "
  input InputUpdateSchoolApplication {
    id: Int
    status: String
    progress: String
    answers: [InputApplicationAnswer]
  }

  " input to delete an existing schoolApplication "
  input InputDeleteSchoolApplication {
    id: Int
  }

  type SchoolApplication {
    id: Int
    status: String
    progress: String
    accepted: Boolean
    acceptedDate: Date
    school: School
    transferredFrom: School
    answers: [ApplicationAnswer]
    user: PublicUser
    created: Date
    submitted: Date
  }
`;

export default {
  resolvers: {
    Query: {
      // get all schoolApplications
      getSchoolApplications: async (root: any, context: IContext) => {
        const user = await authenticateContext(context);
        if (user.role !== GQL.Role.ADMIN) {
          throw new AuthenticationError('only admins can see all applications');
        }
        return getSchoolApplications();
      },
      getApplications: async (
        root: any,
        { schoolId }: GQL.QueryToGetApplicationsArgs,
        context: IContext
      ): Promise<GQL.SchoolApplication[]> => {
        const user = await authenticateContext(context);
        if (!user) {
          throw new AuthenticationError(
            'you have to be logged in to create an Application'
          );
        }
        if (
          user.role !== GQL.Role.ADMIN &&
          user.role !== GQL.Role.SCHOOLADMIN
        ) {
          throw new AuthenticationError(
            'only admins or school admins can see all applications'
          );
        }
        const applications = await prisma.application.findMany({
          where: {
            school: {
              id: schoolId,
            },
          },
        });
        return applications;
      },
      getMyApplications: async (
        root: any,
        {},
        context: IContext
      ): Promise<GQL.SchoolApplication[]> => {
        const user = await authenticateContext(context);
        if (!user) {
          throw new AuthenticationError(
            'you have to be logged in to see your Applications'
          );
        }
        const applications = await prisma.application.findMany({
          where: {
            user: {
              id: user.id,
            },
          },
          include: {
            application_answer: {
              include: {
                application_question: true,
              },
            },
          },
        });
        const schoolApplications: GQL.SchoolApplication[] = applications.map(
          app => {
            return {
              ...app,
              answers: app.application_answer.map(dbAnswer => {
                return {
                  answer: dbAnswer.answer,
                  id: dbAnswer.id,
                  question: {
                    id: Number(dbAnswer.questionId),
                    question: dbAnswer.question,
                  },
                } as GQL.ApplicationAnswer;
              }),
            };
          }
        );
        return schoolApplications;
      },
    },
    Mutation: {
      // create a schoolApplication
      createSchoolApplication: async (
        root: any,
        { input }: GQL.MutationToCreateSchoolApplicationArgs,
        context: IContext
      ): Promise<GQL.SchoolApplication> => {
        // get the user from the context
        const user = await authenticateContext(context);
        if (!user) {
          throw new AuthenticationError(
            'you have to be logged in to create an Application'
          );
        }
        if (user.id !== input.userId && user.role !== GQL.Role.ADMIN) {
          throw new AuthenticationError(
            'only admins can create applications for other users'
          );
        }
        // create a new schoolApplication in the database
        const schoolApplication = await createSchoolApplication(input);
        // publish the schoolApplication to the subscribers
        pubsub.publish('schoolApplicationCreated', {
          schoolApplicationCreated: schoolApplication,
        });
        return schoolApplication;
      },
      updateSchoolApplication: async (
        root: any,
        { input }: GQL.MutationToUpdateSchoolApplicationArgs,
        context: IContext
      ) => {
        // get the user from the context
        const user = await authenticateContext(context);
        if (!user) {
          throw new AuthenticationError(
            'you have to be logged in to create an Application'
          );
        }
        const foundApplication = await prisma.application.findOne({
          where: {
            id: input.id,
          },
        });

        if (
          user.id !== foundApplication.userId &&
          user.role !== GQL.Role.ADMIN &&
          user.role !== GQL.Role.SCHOOLADMIN
        ) {
          throw new AuthenticationError(
            'only admins or school admins can update applications'
          );
        }
        // create a new schoolApplication in the database
        const schoolApplication = prisma.application.update({
          where: {
            id: input.id,
          },
          data: {
            ...input,
          },
        });
        return schoolApplication;
      },
      deleteSchoolApplication: async (
        root: any,
        { input }: GQL.MutationToDeleteSchoolApplicationArgs,
        context: IContext
      ) => {
        const applicationId = input.id;
        const user = await authenticateContext(context);
        const foundApplication = await prisma.application.findOne({
          where: {
            id: applicationId,
          },
        });
        if (foundApplication === undefined || foundApplication === null) {
          throw new Error("Application doesn't exist.");
        }
        if (
          user.id !== foundApplication.userId &&
          user.role !== GQL.Role.ADMIN
        ) {
          throw new AuthenticationError(
            'You can only delete your own application, or you have to be admin.'
          );
        }
        await prisma.application.delete({
          where: {
            id: applicationId,
          },
        });
        return true;
      },
      cancelSchoolApplication: async (
        root: any,
        { input }: GQL.MutationToDeleteSchoolApplicationArgs,
        context: IContext
      ) => {
        const applicationId = input.id;
        const user = await authenticateContext(context);
        const app = await prisma.application.findOne({
          where: {
            id: applicationId,
          },
        });
        if (app === undefined || app === null) {
          throw new Error("Application doesn't exist.");
        }
        if (
          user.id !== app.userId &&
          user.role !== GQL.Role.ADMIN &&
          user.role !== GQL.Role.SCHOOLADMIN
        ) {
          throw new AuthorizationError(
            'You can only cancel your own application, or you have to be admin.'
          );
        }
        const canceledApplication = await prisma.application.update({
          data: {
            canceledDate: new Date(),
          },
          where: {
            id: applicationId,
          },
        });
        return canceledApplication;
      },

      acceptApplication: async (
        root: any,
        { input }: GQL.MutationToDeleteSchoolApplicationArgs,
        context: IContext
      ) => {
        const applicationId = input.id;
        const user = await authenticateContext(context);
        const appCount = await prisma.application.count({
          where: {
            id: applicationId,
          },
        });
        if (appCount === 0) {
          throw new Error("Application doesn't exist.");
        }
        if (
          user.role !== GQL.Role.ADMIN &&
          user.role !== GQL.Role.SCHOOLADMIN
        ) {
          throw new AuthorizationError(
            'You can only accept applications if you are school admin or admin.'
          );
        }
        const canceledApplication = await prisma.application.update({
          data: {
            acceptedDate: new Date(),
            accepted: true,
          },
          where: {
            id: applicationId,
          },
        });
        return canceledApplication;
      },
    },
    Subscription: {
      schoolApplicationCreated: {
        subscribe: (root: any, args: any, context: any) => {
          return pubsub.asyncIterator('schoolApplicationCreated');
        },
      },
    },
  },
  typeDefs: [typeDefs],
};

async function getSchoolApplications(): Promise<GQL.SchoolApplication[]> {
  const applications = await prisma.application.findMany({
    include: {},
  });
  return applications;
}

export async function createSchoolApplication(
  input: GQL.InputCreateSchoolApplication
): Promise<GQL.SchoolApplication> {
  const newApp = await prisma.application.create({
    data: {
      status: 'created',
      school: {
        connect: {
          id: input.schoolId,
        },
      },
      user: {
        connect: {
          id: input.userId,
        },
      },
      application_answer: {
        create: input.answers.map(inputAnswer => {
          return {
            answer: inputAnswer.answer,
            application_question: {
              connect: {
                id: inputAnswer.questionId,
              },
            },
            question: inputAnswer.question,
          };
        }),
      },
    },
    include: {
      school: {
        include: {
          application_question_collection: {
            include: {
              application_question: true,
            },
          },
        },
      },
      user: true,
    },
  });

  const allQuestions =
    newApp.school.application_question_collection.application_question;
  if (input.answers.length <= allQuestions.length) {
    allQuestions
      .filter(q => !input.answers.map(a => a.questionId).includes(q.id))
      .forEach(question => {
        prisma.application_answer.create({
          data: {
            application: {
              connect: {
                id: newApp.id,
              },
            },
            answer: '',
            question: question.question,
          },
        });
      });
  }
  return {
    ...newApp,
    user: newApp.user,
    school: { ...newApp.school },
  };
}
