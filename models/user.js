const mongoose = require("mongoose");
const { stringify } = require("querystring");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
    MobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  Password:{
    type: String,
    required: true,
    unique: true,
  },
});


module.exports = mongoose.model("User", userSchema);