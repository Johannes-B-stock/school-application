import { prisma } from '../../db';
import { gql, AuthenticationError } from 'apollo-server-express';
import { authenticateContext, IContext } from 'src/auth';
import { AuthorizationError } from 'src/auth/errors';

const typeDefs = gql`
  extend type Query {
    getMyAddresses: [Address]
  }

  extend type Mutation {
    updateAddress(input: InputUpdateAddress!): Address
    createAddress(input: InputCreateAddress!): Address
    deleteAddress(id: Int!): Address
  }

  input InputCreateAddress {
    street: String
    city: String
    state: String
    zip: String
    nation: Int!
    phone: String
    phone2: String
  }

  input InputUpdateAddress {
    id: Int!
    street: String
    city: String
    state: String
    zip: String
    nation: Int!
    phone: String
    phone2: String
  }

  type Address {
    id: Int!
    user: User
    street: String
    city: String
    state: String
    zip: String
    country: String
    nation: String
    phone: String
    phone2: String
  }
`;

export default {
  resolvers: {
    Query: {
      // get a user
      getMyAddresses: async (
        _root: any,
        {}: any,
        context: IContext
      ): Promise<GQL.Address[]> => {
        const user = await authenticateContext(context);
        const addresses = prisma.address.findMany({
          where: {
            userId: user.id,
          },
        });
        return addresses;
      },
    },
    Mutation: {
      createAddress: async (
        _root,
        { input }: GQL.MutationToCreateAddressArgs,
        context: IContext
      ): Promise<GQL.Address> => {
        const user = await authenticateContext(context);
        const address = await prisma.address.create({
          data: {
            ...input,
            nation: {
              connect: {
                id: input.nation,
              },
            },
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        });
        return address;
      },
      updateAddress: async (
        _root,
        { input }: GQL.MutationToUpdateAddressArgs,
        context: IContext
      ) => {
        const user = await authenticateContext(context);
        const foundAddress = await prisma.address.findOne({
          where: {
            id: input.id,
          },
        });
        if (foundAddress.userId !== user.id && user.role !== GQL.Role.ADMIN) {
          throw new AuthorizationError(
            'You can only update your own addresses'
          );
        }
        const address = await prisma.address.update({
          data: {
            ...input,
            nation: {
              connect: {
                id: input.nation,
              },
            },
          },
          where: {
            id: input.id,
          },
        });
        return address;
      },
      deleteAddress: async (
        _root,
        { id }: { id: number },
        context: IContext
      ) => {
        const user = await authenticateContext(context);
        if (!user) {
          throw new AuthenticationError(
            'You have to be logged in to be able to do this!'
          );
        }
        const foundAddress = await prisma.address.findOne({
          where: {
            id,
          },
        });
        if (foundAddress.userId !== user.id && user.role !== GQL.Role.ADMIN) {
          throw new Error('Only Admins can delete addresses from other users!');
        }
        const deletedAddress = await prisma.address.delete({
          where: {
            id,
          },
        });
        return deletedAddress;
      },
    },
  },
  typeDefs: [typeDefs],
};
