const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

function connectDB() {
  mongoose
    .connect(process.env.MONGODB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "GDD",
      ssl: true,
      sslValidate: true,
      sslCA: path.join(__dirname, "mongo.caroot.crt"),
    })
    .then((db) =>
      console.log(
        `Mongo database is connected from ${db.connection.host}:${db.connection.port}`
      )
    )
    .catch((err) => console.error(err));
}

module.exports = { connectDB };
