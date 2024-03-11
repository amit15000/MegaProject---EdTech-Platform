const mongoose = require("mongoose");
require("dotenv").config();
exports.dbConnection = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      console.log("Database Connection : Successful");
    })
    .catch((error) => {
      console.log("Database Connection : Failed");
      console.error(error);
      process.exit(1);
    });
};
