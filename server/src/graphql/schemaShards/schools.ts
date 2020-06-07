import {
  prisma,
  getSchools,
  addStudent,
  addStaff,
  removeStudent,
  removeStaff,
  getDbUser,
} from '../../db';
import { gql, AuthenticationError } from 'apollo-server-express';
import { pubsub } from '../subscriptionManager';
import { authenticateContext, IContext } from '../../auth';

import { GraphQLDateTime } from 'graphql-iso-date';
import { AuthorizationError } from 'src/auth/errors';

const typeDefs = gql`
  scalar Date

  extend type Query {
    " get all schools "
    getSchools(online: Boolean): [School!]
    getSchoolInfoForApplication(schoolId: Int!): School
  }

  extend type Mutation {
    " create a new school "
    createSchool(input: InputCreateSchool!): School
    updateSchool(input: InputUpdateSchool!): School
    deleteSchool(input: InputDeleteSchool!): Boolean
    addStudent(input: InputAddStudent!): School
    addStaff(input: InputAddStaff): School
    removeStudent(input: InputRemoveStudent!): School
    removeStaff(input: InputRemoveStaff): School
  }

  extend type Subscription {
    " called when a new school is created "
    schoolCreated: School
  }

  " input to create a new school "
  input InputCreateSchool {
    acronym: String!
    name: String!
    online: Boolean
    hashtag: String
    description: String
    startDate: Date
    endDate: Date
    outreachStartDate: Date
    outreachEndDate: Date
    miniOutreachStartDate: Date
    miniOutreachEndDate: Date
    schoolEmail: String
    currency: String
    secondary: Boolean
    applicationFee: Int
    schoolFee: Int
    miniOutreachFee: Int
    outreachFee: Int
    questionCollection: Int
  }

  " input to update an existing school "
  input InputUpdateSchool {
    id: Int!
    acronym: String
    name: String
    online: Boolean
    hashtag: String
    description: String
    startDate: Date
    endDate: Date
    outreachStartDate: Date
    outreachEndDate: Date
    miniOutreachStartDate: Date
    miniOutreachEndDate: Date
    schoolEmail: String
    currency: String
    secondary: Boolean
    applicationFee: Int
    schoolFee: Int
    miniOutreachFee: Int
    outreachFee: Int
    questionCollection: Int
  }

  " input to delete an existing school "
  input InputDeleteSchool {
    id: Int
  }

  " input to add a student "
  input InputAddStudent {
    schoolId: Int
    userId: Int
  }

  " input to add a staff "
  input InputAddStaff {
    schoolId: Int
    userId: Int
    admin: Boolean
  }

  " input to add a student "
  input InputRemoveStudent {
    schoolId: Int
    userId: Int
  }

  " input to add a staff "
  input InputRemoveStaff {
    schoolId: Int
    userId: Int
  }

  type School {
    id: Int!
    acronym: String!
    name: String!
    online: Boolean
    hashtag: String
    description: String
    students: [PublicUser!]
    staffs: [PublicUser!]
    applications: [SchoolApplication!]
    questions: [ApplicationQuestion!]
    startDate: Date
    endDate: Date
    outreachStartDate: Date
    outreachEndDate: Date
    miniOutreachStartDate: Date
    miniOutreachEndDate: Date
    schoolEmail: String
    timestamp: String
    currency: String
    secondary: Boolean
    applicationFee: Int
    schoolFee: Int
    miniOutreachFee: Int
    outreachFee: Int
  }
`;

export default {
  resolvers: {
    Date: GraphQLDateTime,
    Query: {
      // get all schools
      getSchools: async (
        root: any,
        { online = true }: { online: boolean },
        context: IContext
      ) => {
        if (!online) {
          const user = await authenticateContext(context);
          const dbUser = await getDbUser(user.id);
          if (dbUser.role < 3) {
            throw new AuthorizationError(
              'Only admins or school admins are allowed to see schools that are not online!'
            );
          }
        }
        return getSchools(online);
      },
      getSchoolInfoForApplication: async (
        root: any,
        { schoolId }: { schoolId: number },
        context: IContext
      ): Promise<GQL.School> => {
        const user = await authenticateContext(context);
        if (user === undefined || user === null) {
          throw new AuthenticationError(
            'You have to be signed in to apply for a school.'
          );
        }
        const school = await prisma.school.findOne({
          where: {
            id: schoolId,
          },
          include: {
            application_question_collection: {
              include: {
                application_question: true,
              },
            },
          },
        });
        const questions: GQL.ApplicationQuestion[] = school.application_question_collection?.application_question?.map(
          dbQuestion => {
            return {
              ...dbQuestion,
              questionCollection: school.application_question_collection,
            };
          }
        );
        return {
          ...school,
          questions,
        };
      },
    },
    Mutation: {
      // create a school
      createSchool: async (
        root: any,
        { input }: GQL.MutationToCreateSchoolArgs,
        context: IContext
      ) => {
        // get the user from the context
        const user = await authenticateContext(context);
        if (
          user.role !== GQL.Role.ADMIN &&
          user.role !== GQL.Role.SCHOOLADMIN
        ) {
          throw new AuthenticationError(
            "user doesn't have the rights to create schools"
          );
        }
        // create a new school in the database
        const school = await createSchool(input);
        // publish the school to the subscribers
        pubsub.publish('schoolCreated', {
          schoolCreated: school,
        });
        return school;
      },
      updateSchool: async (
        root: any,
        { input }: GQL.MutationToUpdateSchoolArgs,
        context: IContext
      ) => {
        // get the user from the context
        const authUser = await authenticateContext(context);
        const user = await getDbUser(authUser.id);
        if (user.role < 3) {
          throw new AuthorizationError(
            "user doesn't have the rights to update schools"
          );
        }
        // create a new school in the database
        const school = await updateSchool(input);
        return school;
      },

      deleteSchool: async (
        root: any,
        { input }: GQL.MutationToDeleteSchoolArgs,
        context: IContext
      ) => {
        // get the user from the context
        const user = await authenticateContext(context);
        const dbUser = await getDbUser(user.id);
        if (dbUser.role < 3) {
          throw new AuthorizationError(
            "user doesn't have the rights to update schools"
          );
        }
        // create a new school in the database
        const school = await prisma.school.delete({ where: { id: input.id } });
        return school !== null;
      },
      addStudent: async (
        { input }: GQL.MutationToAddStudentArgs,
        context: IContext
      ) => {
        // get the user from the context
        const user = await authenticateContext(context);
        if (
          user.role !== GQL.Role.ADMIN &&
          user.role !== GQL.Role.SCHOOLADMIN
        ) {
          throw new AuthenticationError(
            "user doesn't have the rights to update schools"
          );
        }
        const student = await addStudent(input);
        return student;
      },
      addStaff: async (
        { input }: GQL.MutationToAddStaffArgs,
        context: IContext
      ) => {
        // get the user from the context
        const user = await authenticateContext(context);
        if (
          user.role !== GQL.Role.ADMIN &&
          user.role !== GQL.Role.SCHOOLADMIN
        ) {
          throw new AuthenticationError(
            "user doesn't have the rights to update schools"
          );
        }
        const school = await addStaff(input);
        return school;
      },
      removeStudent: async (
        { input }: GQL.MutationToRemoveStudentArgs,
        context: IContext
      ) => {
        // get the user from the context
        const user = await authenticateContext(context);
        if (
          user.role !== GQL.Role.ADMIN &&
          user.role !== GQL.Role.SCHOOLADMIN
        ) {
          throw new AuthenticationError(
            "user doesn't have the rights to update schools"
          );
        }
        const school = await removeStudent(input);
        return school;
      },
      removeStaff: async (
        { input }: GQL.MutationToRemoveStaffArgs,
        context: IContext
      ) => {
        // get the user from the context
        const user = await authenticateContext(context);
        if (
          user.role !== GQL.Role.ADMIN &&
          user.role !== GQL.Role.SCHOOLADMIN
        ) {
          throw new AuthenticationError(
            "user doesn't have the rights to update schools"
          );
        }
        const school = await removeStaff(input);
        return school;
      },
    },
    Subscription: {
      schoolCreated: {
        subscribe: (root: any, args: any, context: any) => {
          return pubsub.asyncIterator('schoolCreated');
        },
      },
    },
  },
  typeDefs: [typeDefs],
};

async function createSchool(
  schoolInput: GQL.InputCreateSchool
): Promise<Partial<GQL.School>> {
  let dbSchool = null;
  const { questionCollection, ...cleanSchoolInput } = {
    ...schoolInput,
    startDate: new Date(schoolInput.startDate ?? 0),
    endDate: new Date(schoolInput.endDate ?? 0),
    outreachEndDate: new Date(schoolInput.outreachEndDate ?? 0),
    outreachStartDate: new Date(schoolInput.outreachStartDate ?? 0),
  };
  if (questionCollection) {
    dbSchool = await prisma.school.create({
      data: {
        ...cleanSchoolInput,
        application_question_collection: {
          connect: {
            id: questionCollection,
          },
        },
      },
    });
  } else {
    dbSchool = await prisma.school.create({
      data: {
        ...cleanSchoolInput,
      },
    });
  }
  return { ...dbSchool };
}

async function updateSchool(
  schoolInput: GQL.InputUpdateSchool
): Promise<Partial<GQL.School>> {
  const collectionId = schoolInput.questionCollection;
  const { questionCollection, ...cleanInput } = schoolInput;
  let dbSchool = await prisma.school.update({
    where: {
      id: schoolInput.id,
    },
    data: {
      ...cleanInput,
      startDate: new Date(schoolInput.startDate ?? 0),
      endDate: new Date(schoolInput.endDate ?? 0),
      outreachEndDate: new Date(schoolInput.outreachEndDate ?? 0),
      outreachStartDate: new Date(schoolInput.outreachStartDate ?? 0),
    },
  });
  if (collectionId) {
    dbSchool = await prisma.school.update({
      where: {
        id: schoolInput.id,
      },
      data: {
        application_question_collection: {
          connect: {
            id: collectionId,
          },
        },
      },
    });
  }
  return { ...dbSchool };
}
