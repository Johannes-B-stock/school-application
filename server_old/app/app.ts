// lib/app.ts
import express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("../schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");

// Create a new express application instance
const app: express.Application = express();

app.use(cors());

app.get("/", function(req, res) {
  res.send("Hello World!");
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

// const MongoClient = require('mongodb').MongoClient;
const uri =
  "mongodb+srv://user1_rw:XOwNdYfAluHKJoVt@cluster0-uicyq.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   //const collection = client.db("test").collection("devices");
//   console.log("Mongo connected");
//   // perform actions on the collection object
//   client.close();
// });

mongoose.connect(uri, { useNewUrlParser: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("mLab connection success");
});
