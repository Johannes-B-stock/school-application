const graphql = require("graphql");

//for book type and book fields
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLDate,
  GraphQLNonNull,
} = graphql;

const School = require("../models/school");
const Student = require("../models/student");

//create a book type
const schoolType = new GraphQLObjectType({
  name: "School",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    type: { type: GraphQLString },
    start: { type: GraphQLString },
    end: { type: GraphQLString },
    students: {
      type: new GraphQLList(studentType),
      resolve(parent, args) {
        return Student.find({ schoolId: parent.id });
      },
    },
  }),
});

const studentType = new GraphQLObjectType({
  name: "Student",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    school: {
      type: schoolType,
      resolve(parent, args) {
        return School.findById(parent.schoolId);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    schools: {
      type: new GraphQLList(schoolType),
      resolve(parent, args) {
        return School.find({});
      },
    },
    school: {
      type: schoolType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return School.findById(args.id);
      },
    },
    students: {
      type: new GraphQLList(studentType),
      resolve(parent, args) {
        return Student.find({});
      },
    },
    student: {
      type: studentType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Student.findById(args.id);
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addSchool: {
      type: schoolType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        type: { type: new GraphQLNonNull(GraphQLString) },
        start: { type: new GraphQLNonNull(GraphQLString) },
        end: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        //mongoDB codes
        let school = new School({
          name: args.name,
          type: args.type,
          start: args.start,
          end: args.end,
        });
        return school.save();
      },
    },
    addStudent: {
      type: studentType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLString) },
        schoolId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let student = new Student({
          name: args.name,
          age: args.age,
          schoolId: args.schoolId,
        });
        return student.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
