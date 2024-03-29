const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: { type: String, require: true, unique: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  avatar: { type: String, default: "" },
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  registrationDate: Date,
  posts: [{ type: Schema.Types.ObjectId, ref: "Post", sort: { date: -1 } }],
  banned: [{ type: Schema.Types.ObjectId, ref: "User" }],
  homePagePosts: [
    { type: Schema.Types.ObjectId, ref: "Post", sort: { date: -1 } },
  ],
});

module.exports = model("User", userSchema);
