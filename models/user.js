const mongoose = require("mongoose")

const Schema = mongoose.Schema

const UserSchema = new Schema({
  firstName: {type: String, require: true},
  lastName: {type: String, required: true},
  email: {type: String, require: true},
  password: {type: String, required: true},
  isBlogOwner: {type: Boolean, default: false}
})

// There will be a url virtual as well. 

module.exports = mongoose.model("User", UserSchema)