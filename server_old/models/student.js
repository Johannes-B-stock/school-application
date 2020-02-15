//for mongoose tools
const mongoose = require("mongoose");

//for create mongoose schema
const Schema = mongoose.Schema;

//create schema
const studentSchema = new Schema({
  name: String,
  age: Number,
  schoolId: String
});

//export the schema
module.exports = mongoose.model("Student", studentSchema);
