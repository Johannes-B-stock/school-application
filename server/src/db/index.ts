import { PrismaClient, user } from '@prisma/client';

export const prisma = new PrismaClient({
  errorFormat: 'minimal',
});

export async function getDbUser(id: number): Promise<user> {
  const foundUser = await prisma.user.findOne({
    where: {
      id,
    },
  });
  return foundUser;
}

export async function getSchools(
  online: boolean | undefined = true
): Promise<GQL.School[]> {
  const dbSchools = await prisma.school.findMany({
    where: {
      online,
    },
  });
  return dbSchools;
}

export async function addStudent(
  input: GQL.InputAddStudent
): Promise<GQL.PublicUser> {
  const dbStudent = await prisma.student.create({
    data: {
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
    },
    include: {
      user: true,
    },
  });
  return { ...dbStudent, ...dbStudent.user };
}

export async function addStaff(
  input: GQL.InputAddStaff
): Promise<GQL.PublicUser> {
  const dbStaff = await prisma.staff.create({
    data: {
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
    },
    include: {
      user: true,
    },
  });
  return { ...dbStaff, ...dbStaff.user };
}

export async function removeStudent(
  input: GQL.InputRemoveStudent
): Promise<GQL.School> {
  const updatedSchool = await prisma.school.update({
    where: {
      id: input.schoolId,
    },
    data: {
      student: {
        delete: {
          id: input.userId,
        },
      },
    },
  });
  return {
    ...updatedSchool,
  };
}

export async function removeStaff(
  input: GQL.InputRemoveStaff
): Promise<GQL.School> {
  const updatedSchool = await prisma.school.update({
    where: {
      id: input.schoolId,
    },
    data: {
      staff: {
        delete: {
          id: input.userId,
        },
      },
    },
  });
  return {
    ...updatedSchool,
  };
}
