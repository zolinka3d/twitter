const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  text: { type: String, require: true },
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  comments: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  date: Date,
  quote_id: { type: Schema.Types.ObjectId, ref: "Post" },
  reference_id: { type: Schema.Types.ObjectId, ref: "Post" },
});

module.exports = model("Post", postSchema);
