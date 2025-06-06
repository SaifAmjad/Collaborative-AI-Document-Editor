const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  documents: [{ type: String, ref: "document" }],
});

module.exports = model("User", userSchema);
