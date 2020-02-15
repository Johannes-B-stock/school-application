const mongoose = require("mongoose");

//for create mongoose schema
const Schema = mongoose.Schema;

//create schema
const schoolSchema = new Schema({
  name: String,
  type: String,
  start: String,
  end: String
});

//export the schema
module.exports = mongoose.model("School", schoolSchema);
