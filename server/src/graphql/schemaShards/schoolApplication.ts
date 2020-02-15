import {} from 'src/db';
import { gql } from 'apollo-server';
import { pubsub } from 'src/graphql/subscriptionManager';
import { authenticateContext } from 'src/auth';

const typeDefs = gql`
  extend type Query {
    " get all schoolApplications "
    getSchoolApplications: [SchoolApplication]
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
  }

  extend type Subscription {
    " called when a new schoolApplication is created "
    schoolApplicationCreated: SchoolApplication
  }

  " input to create a new schoolApplication "
  input InputCreateSchoolApplication {
    userId: ID
    schoolId: ID
  }

  " input to update an existing schoolApplication "
  input InputUpdateSchoolApplication {
    id: ID
  }

  " input to delete an existing schoolApplication "
  input InputDeleteSchoolApplication {
    id: ID
  }

  type SchoolApplication {
    id: ID
    applicationId: ID
    userId: ID
    timestamp: String
  }
`;

export default {
  resolvers: {
    // Query: {
    //   // get all schoolApplications
    //   getSchoolApplications: () => getSchoolApplications(),
    // },
    // Mutation: {
    //   // create a schoolApplication
    //   createSchoolApplication: async (
    //     root,
    //     { input }: GQL.MutationToCreateSchoolApplicationArgs,
    //     context
    //   ) => {
    //     // get the user from the context
    //     const user = await authenticateContext(context);
    //     // create a new schoolApplication in the database
    //     const schoolApplication = await createSchoolApplication(input);
    //     // publish the schoolApplication to the subscribers
    //     pubsub.publish('schoolApplicationCreated', {
    //       schoolApplicationCreated: schoolApplication,
    //     });
    //     return schoolApplication;
    //   },
    // },
    // Subscription: {
    //   schoolApplicationCreated: {
    //     subscribe: (root, args, context) => {
    //       return pubsub.asyncIterator('schoolApplicationCreated');
    //     },
    //   },
    // },
  },
  typeDefs: [typeDefs],
};
