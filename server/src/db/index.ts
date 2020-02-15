import * as lowdb from 'lowdb';
import * as FileSync from 'lowdb/adapters/FileSync';
import * as jsonwebtoken from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { v4 as createUUID } from 'uuid';

/*
 * NOTICE! these secrets are here for simplicity,
 * please don't save secrets inside your code,
 * but in environment variables or config files that will not be in the repository
 *
 * this entire file is only to mock a local database. it is not ment to act as a real database.
 */
// some salt for hashing the password
const hashSalt = '$2a$10$7h/0SQ4FXRG5eX3602o3/.aO.RYkxKuhGkzvIXHLUiMJlFt1P.6Pe';
// a secret for signing with jwt
const jwtSecret = 'oCDSF$#%$#%dfsvdgfd#@$3f';

// our database
const adapter = new FileSync('db.json');
const db = lowdb(adapter);

db.defaults({
  posts: [],
  users: [],
  schools: [],
}).write();

// get a user's public data by it's id.
export async function getPublicUser(id: string): Promise<GQL.PublicUser> {
  const user = db
    .get('users')
    .find({ id })
    .value();
  return user;
}

// gets a user by its password and email.
export async function getUserByPasswordAndEmail(
  input: GQL.InputLogin
): Promise<GQL.User> {
  const { password, email } = input;
  const hash = bcrypt.hashSync(password, hashSalt);
  const user = db
    .get('users')
    .find({ email, password: hash })
    .value();
  return user;
}

// get a user by its token
export async function getUserByToken(token: string): Promise<GQL.User> {
  const user = db
    .get('users')
    .find({ token })
    .value();
  return user;
}

export async function registerUser(userInput: GQL.InputLogin) {
  const { email, password } = userInput;
  const existingUser = db
    .get('users')
    .find({ email })
    .value();

  if (existingUser) {
    throw new Error('user already exist');
  }

  const id = createUUID();
  const hash = bcrypt.hashSync(password, hashSalt);
  const token = jsonwebtoken.sign({ id }, jwtSecret);

  const user = {
    ...userInput,
    id,
    token,
    password: hash,
  };

  db.get('users')
    .push(user)
    .write();
  return user;
}

// get all the posts of a user
export async function getPosts(): Promise<GQL.Post[]> {
  return db.get('posts').value();
}

// create a new post
export async function createPost(
  postInput: GQL.InputCreatePost,
  userId: string
): Promise<Partial<GQL.Post>> {
  const post = {
    userId,
    ...postInput,
    id: createUUID(),
    timestamp: new Date().toUTCString(),
  };
  db.get('posts')
    .push(post)
    .write();
  return post;
}

export async function getSchools(): Promise<GQL.School[]> {
  return db.get('schools').value();
}

export async function createSchool(
  schoolInput: GQL.InputCreateSchool
): Promise<Partial<GQL.School>> {
  const school = {
    ...schoolInput,
    id: createUUID(),
    timestamp: new Date().toUTCString(),
  };
  db.get('schools')
    .push(school)
    .write();
  return school;
}

export async function updateSchool(
  schoolInput: GQL.InputUpdateSchool
): Promise<Partial<GQL.School>> {
  return db
    .get('schools')
    .find({ id: schoolInput.id })
    .assign({
      abbreviation: schoolInput.abbreviation,
      name: schoolInput.name,
      description: schoolInput.description,
      startDateTimestamp: schoolInput.startDateTimestamp,
      endDateTimestamp: schoolInput.endDateTimestamp,
      summary: schoolInput.summary,
    }).value;
}

export async function addStudent(
  input: GQL.InputAddStudent
): Promise<GQL.School> {
  const newStudent = await getPublicUser(input.userId);
  const school = db.get('schools').find({ id: input.schoolId });
  const students = school.get('students').value();

  students.push({ newStudent });
  school.assign({ students }).write();
  return school;
}

export async function addStaff(input: GQL.InputAddStaff): Promise<GQL.School> {
  const newStaff = await getPublicUser(input.userId);
  // check if newStaff is actually a staff member

  const school = db.get('schools').find({ id: input.schoolId });
  const staff = school.get('staffs').value();

  staff.push({ newStaff });
  school.assign({ staff }).write();
  return school;
}

export async function removeStudent(
  input: GQL.InputRemoveStudent
): Promise<GQL.School> {
  const newStaff = await getPublicUser(input.userId);
  // check if newStaff is actually a staff member

  const school = db.get('schools').find({ id: input.schoolId });
  school
    .get('students')
    .remove({ id: input.userId })
    .write();

  return school;
}

export async function removeStaff(
  input: GQL.InputAddStaff
): Promise<GQL.School> {
  const newStaff = await getPublicUser(input.userId);
  // check if newStaff is actually a staff member
  const school = db.get('schools').find({ id: input.schoolId });
  school
    .get('staffs')
    .remove({ id: input.userId })
    .write();

  return school;
}
