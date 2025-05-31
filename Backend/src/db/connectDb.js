const Mongoose = require("mongoose");

const connectDb = (urlString) => {
  Mongoose.connect(urlString)
    .then(() => {
      console.log("DB connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDb;
