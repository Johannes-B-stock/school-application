//for mongoose tools
const mongoose = require("mongoose");

//for create mongoose schema
const Schema = mongoose.Schema;

//create schema
const userSchema = new Schema({
  name: String,
  age: Number,
  email: String,
  
});

//export the schema
module.exports = mongoose.model("User", userSchema);
