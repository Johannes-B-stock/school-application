import { getPublicUser, prisma } from '../../db';
import { gql, AuthenticationError } from 'apollo-server';
import { authenticateContext, IContext } from 'src/auth';
import { hashSalt, createToken } from 'src/auth/secrets';
import * as bcrypt from 'bcrypt';

const typeDefs = gql`
  extend type Query {
    " get a user's public data"
    getPublicUser(id: Int!): PublicUser
    getUser(id: Int): User
  }

  extend type Mutation {
    " register a new user "
    createAdmin(input: InputRegisterUser!): UserLogin!
    registerUser(input: InputRegisterUser!): UserLogin!
    " update User properties "
    updateUser(input: InputUpdateUser!): User
    " login as a user "
    loginUser(input: InputLogin!): UserLogin!
  }

  " used for logging in "
  input InputLogin {
    email: String!
    password: String!
  }

  " used for creating a new user "
  input InputRegisterUser {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  " used for updating an existing user "
  input InputUpdateUser {
    id: Int!
    firstName: String
    lastName: String
    gender: String
    marriage: String
    maritalStatusDate: Date
    spouseName: String
    children: Int
    birthday: Date
    website: String
    youtube: String
    facebook: String
    talents: String
    firstLanguage: String
    nativeLanguage: String
    secondLanguage: String
    secondLanguagePro: Int
    thirdLanguage: String
    thirdLanguagePro: Int
    otherLanguage: String
    otherLanguagePro: Int
    life: String
  }

  " a type defining a user's public data "
  type PublicUser {
    id: Int!
    fullName: String
    email: String!
  }

  " a type defining a user  "
  type User {
    id: Int!
    firstName: String
    lastName: String
    fullName: String
    gender: String
    role: Role
    marriage: String
    maritalStatusDate: Date
    spouseName: String
    children: Int
    birthday: Date
    email: String!
    website: String
    youtube: String
    facebook: String
    emailActivated: Boolean
    talents: String
    firstLanguage: String
    nativeLanguage: String
    secondLanguage: String
    secondLanguagePro: Int
    thirdLanguage: String
    thirdLanguagePro: Int
    otherLanguage: String
    otherLanguagePro: Int
    life: String
    addresses: [Address]
  }

  type UserLogin {
    id: Int!
    role: Role!
    firstName: String
    token: String!
  }

  enum Role {
    USER
    STUDENT
    STAFF
    SCHOOLADMIN
    ADMIN
  }
`;

export default {
  resolvers: {
    Query: {
      // get a user
      getPublicUser: async (
        _root: any,
        { id }: GQL.QueryToGetUserArgs,
        context: IContext
      ): Promise<GQL.PublicUser> => {
        const user = await authenticateContext(context);
        if (
          (user.role === GQL.Role.STUDENT || user.role === GQL.Role.USER) &&
          user.id !== id
        ) {
          throw new AuthenticationError(
            'user is not allowed to view information about this user.'
          );
        }
        return getPublicUser(id);
      },
      getUser: async (
        _root: any,
        { id }: GQL.QueryToGetUserArgs,
        context: IContext
      ): Promise<GQL.User> => {
        const user = await authenticateContext(context);
        if (id && user.id !== id && user.role !== GQL.Role.ADMIN) {
          throw new AuthenticationError(
            "user doesn't have the rights view this user"
          );
        }
        if (!id) {
          id = user.id;
        }
        const dbUser = await prisma.user.findOne({ where: { id } });
        return { ...dbUser, role: convertRole(dbUser.role) };
      },
    },
    Mutation: {
      createAdmin: async (
        _root: any,
        { input }: GQL.MutationToRegisterUserArgs
      ) => {
        const userCount = await prisma.user.count({ where: { role: 4 } });
        if (userCount > 0) {
          throw new Error(
            'admin exists already. Please use that admin account to create new admins.'
          );
        }
        const user = await registerUser(input);
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            role: 4,
          },
        });
        user.role = GQL.Role.ADMIN;
        return user;
      },
      // login
      loginUser: async (
        _root: any,
        { input }: GQL.MutationToLoginUserArgs
      ): Promise<GQL.UserLogin> => await loginUser(input),
      // register
      registerUser: (_root: any, { input }: GQL.MutationToRegisterUserArgs) =>
        registerUser(input),
    },
  },
  typeDefs: [typeDefs],
};

async function registerUser(
  userInput: GQL.InputRegisterUser,
  role: number = 0
): Promise<GQL.UserLogin> {
  const existingUser = await prisma.user.count({
    where: {
      email: userInput.email,
    },
  });

  if (existingUser > 0) {
    throw new Error('user already exist');
  }
  const hash = createPasswordHash(userInput.password);
  const newUser = await prisma.user.create({
    data: {
      ...userInput,
      password: hash,
      user_information: {
        create: {},
      },
    },
  });
  const token = createToken(newUser.id);
  const graphRole = convertRole(role);
  return { ...newUser, token, role: graphRole };
}

function createPasswordHash(password: string) {
  return bcrypt.hashSync(password, hashSalt);
}

// gets a user by its password and email.
export async function loginUser(input: GQL.InputLogin): Promise<GQL.UserLogin> {
  const { password, email } = input;
  const hash = bcrypt.hashSync(password, hashSalt);
  const users = await prisma.user.findMany({
    where: {
      email,
    },
    include: {
      address: true,
      user_information: true,
    },
  });
  if (users.length === 0) {
    throw new AuthenticationError("user doesn't exist, please register first.");
  }
  const foundUser = users[0];
  if (foundUser.password !== hash) {
    throw new AuthenticationError('wrong password!');
  }
  const token = createToken(foundUser);

  return {
    ...foundUser,
    ...foundUser.user_information,
    token,
    role: convertRole(foundUser.role),
  };
}

export function convertRole(role: number): GQL.Role {
  switch (role) {
    case 0:
      return GQL.Role.USER;
    case 1:
      return GQL.Role.STUDENT;
    case 2:
      return GQL.Role.STAFF;
    case 3:
      return GQL.Role.SCHOOLADMIN;
    case 4:
      return GQL.Role.ADMIN;
    default:
      return GQL.Role.USER;
  }
}
