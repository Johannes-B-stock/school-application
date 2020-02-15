import {
  createSchool,
  getSchools,
  addStudent,
  addStaff,
  removeStudent,
  updateSchool,
  removeStaff,
} from 'src/db';
import { gql } from 'apollo-server';
import { pubsub } from 'src/graphql/subscriptionManager';
import { authenticateContext } from 'src/auth';

const typeDefs = gql`
  extend type Query {
    " get all schools "
    getSchools: [School]
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
    abbreviation: String!
    name: String!
    summary: String
    description: String
    startDateTimestamp: String
    endDateTimestamp: String
  }

  " input to update an existing school "
  input InputUpdateSchool {
    id: Int
    abbreviation: String!
    name: String!
    summary: String
    description: String
    startDateTimestamp: String
    endDateTimestamp: String
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
    id: Int
    abbreviation: String
    name: String
    summary: String
    description: String
    students: [PublicUser]
    staffs: [PublicUser]
    startDateTimestamp: String
    endDateTimestamp: String
    timestamp: String
  }
`;

export default {
  resolvers: {
    Query: {
      // get all schools
      getSchools: () => getSchools(),
    },
    Mutation: {
      // create a school
      createSchool: async (
        root,
        { input }: GQL.MutationToCreateSchoolArgs,
        context
      ) => {
        // get the user from the context
        const user = await authenticateContext(context);
        // create a new school in the database
        const school = await createSchool(input);
        // publish the school to the subscribers
        pubsub.publish('schoolCreated', {
          schoolCreated: school,
        });
        return school;
      },
      updateSchool: async (
        root,
        { input }: GQL.MutationToUpdateSchoolArgs,
        context
      ) => {
        // get the user from the context
        const user = await authenticateContext(context);
        // create a new school in the database
        const school = await updateSchool(input);
        return school;
      },
      addStudent: async ({ input }: GQL.MutationToAddStudentArgs, context) => {
        // get the user from the context
        const user = await authenticateContext(context);
        const school = await addStudent(input);
        return school;
      },
      addStaff: async ({ input }: GQL.MutationToAddStaffArgs, context) => {
        // get the user from the context
        const user = await authenticateContext(context);
        const school = await addStaff(input);
        return school;
      },
      removeStudent: async (
        { input }: GQL.MutationToRemoveStudentArgs,
        context
      ) => {
        // get the user from the context
        const user = await authenticateContext(context);
        const school = await removeStudent(input);
        return school;
      },
      removeStaff: async (
        { input }: GQL.MutationToRemoveStaffArgs,
        context
      ) => {
        // get the user from the context
        const user = await authenticateContext(context);
        const school = await removeStaff(input);
        return school;
      },
    },
    Subscription: {
      schoolCreated: {
        subscribe: (root, args, context) => {
          return pubsub.asyncIterator('schoolCreated');
        },
      },
    },
  },
  typeDefs: [typeDefs],
};
