import { getDbUser, prisma } from '../../db';
import { gql, AuthenticationError } from 'apollo-server-express';
import { authenticateContext, IContext } from 'src/auth';
import { hashSalt, createToken } from 'src/auth/secrets';
import * as bcrypt from 'bcrypt';
import { user } from '@prisma/client';
import { AuthorizationError } from 'src/auth/errors';
import { createWriteStream, unlink, existsSync, mkdirSync } from 'fs';
import { GraphQLUpload } from 'graphql-upload';
import path from 'path';

const typeDefs = gql`
  scalar Upload

  extend type Query {
    " get a user's public data"
    getPublicUser(id: Int!): PublicUser
    getUser(id: Int): User
    hasAdmin: Boolean
  }

  extend type Mutation {
    " register a new user "
    createAdmin(input: InputRegisterUser!): UserLogin!
    registerUser(input: InputRegisterUser!): UserLogin!
    " update User properties "
    updateUser(input: InputUpdateUser!): User
    " login as a user "
    loginUser(input: InputLogin!): UserLogin!
    avatarUpload(file: Upload!): String
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
    avatarFileName: String
    life: String
    addresses: [Address]
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type UserLogin {
    token: String!
    user: User!
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
    Upload: GraphQLUpload,
    Query: {
      // get a user
      getPublicUser: async (
        _root: any,
        { id }: GQL.QueryToGetUserArgs,
        context: IContext
      ): Promise<GQL.PublicUser> => {
        const userAuth = await authenticateContext(context);
        if (
          (userAuth.role === GQL.Role.STUDENT ||
            userAuth.role === GQL.Role.USER) &&
          userAuth.id !== id
        ) {
          throw new AuthorizationError(
            'user is not allowed to view information about this user.'
          );
        }
        return { ...getDbUser(id) };
      },
      getUser: async (
        _root: any,
        { id }: GQL.QueryToGetUserArgs,
        context: IContext
      ): Promise<GQL.User> => {
        const userAuth = await authenticateContext(context);
        let dbUser = await getDbUser(userAuth.id);
        if (id && dbUser.id !== id && dbUser.role !== 4) {
          throw new AuthorizationError(
            "user doesn't have the rights view this user"
          );
        }
        if (id && id !== userAuth.id) {
          dbUser = await getDbUser(id);
        }
        return { ...dbUser, role: convertRole(dbUser.role) };
      },
      hasAdmin: async (_root: any): Promise<boolean> => {
        const admins = await prisma.user.count({ where: { role: 4 } });
        return admins > 0;
      },
    },
    Mutation: {
      // use this for creating your first main admin!
      createAdmin: async (
        _root: any,
        { input }: GQL.MutationToCreateAdminArgs
      ): Promise<GQL.UserLogin> => {
        const userCount = await prisma.user.count({ where: { role: 4 } });
        if (userCount > 0) {
          throw new Error(
            'admin exists already. Please use existing admin account to create new admins.'
          );
        }
        return registerNewUser(input, 4);
      },
      // login
      loginUser: async (
        _root: any,
        { input }: GQL.MutationToLoginUserArgs
      ): Promise<GQL.UserLogin> => await loginUser(input),
      // register
      registerUser: async (
        _root: any,
        { input }: GQL.MutationToRegisterUserArgs
      ): Promise<GQL.UserLogin> => {
        return registerNewUser(input);
      },
      avatarUpload: async (_root, { file }, context: IContext) => {
        const userAuth = await authenticateContext(context);
        const { createReadStream, filename } = await file;
        const stream = createReadStream();
        const folder = 'images/avatars/';
        const imagePath = `./${folder}${userAuth.id}-${filename}`;
        const absolutePath = path.resolve(process.cwd(), folder);
        if (!existsSync(absolutePath)) {
          mkdirSync(absolutePath, { recursive: true });
        }
        // Store the file in the filesystem.
        await new Promise((resolve, reject) => {
          // Create a stream to which the upload will be written.
          const writeStream = createWriteStream(imagePath);

          // When the upload is fully written, resolve the promise.
          writeStream.on('finish', resolve);

          // If there's an error writing the file, remove the partially written file
          // and reject the promise.
          writeStream.on('error', error => {
            unlink(imagePath, () => {
              reject(error);
            });
          });

          // In node <= 13, errors are not automatically propagated between piped
          // streams. If there is an error receiving the upload, destroy the write
          // stream with the corresponding error.
          stream.on('error', error => writeStream.destroy(error));

          // Pipe the upload into the write stream.
          stream.pipe(writeStream);
        });
        const updatedUser = await prisma.user.update({
          where: { id: userAuth.id },
          data: { avatarFileName: `${userAuth.id}-${filename}` },
        });
        return updatedUser.avatarFileName;
      },
    },
  },
  typeDefs: [typeDefs],
};

async function registerNewUser(input: GQL.InputRegisterUser, role: number = 0) {
  const newUser = await createDbUser(input, role);
  const token = createToken(newUser);
  return { user: { ...newUser, role: convertRole(newUser.role) }, token };
}

async function createDbUser(
  userInput: GQL.InputRegisterUser,
  role: number = 0
): Promise<user> {
  const existingUser = await prisma.user.count({
    where: {
      email: userInput.email,
    },
  });

  if (existingUser > 0) {
    throw new Error('user exists already');
  }
  const hash = createPasswordHash(userInput.password);
  const newUser = await prisma.user.create({
    data: {
      ...userInput,
      password: hash,
      role,
      user_information: {
        create: {},
      },
    },
  });
  return newUser;
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
    user: {
      ...foundUser,
      ...foundUser.user_information,
      role: convertRole(foundUser.role),
    },
    token,
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
