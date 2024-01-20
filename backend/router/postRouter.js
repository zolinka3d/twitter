const express = require("express");
let router = express.Router();
const requeireAuth = require("../middleware/requireAuth");
const Post = require("../models/MongoPost");
const User = require("../models/MongoUser");

router.get("/", requeireAuth, async (req, res) => {
  const { id } = req.user;

  try {
    let posts = await Post.find({ user_id: id });
    posts = posts.map((post) => {
      return {
        id: post.id,
        text: post.text,
        user_id: id,
        comments: post.comments,
        date: post.date,
        quote_id: post.quote_id,
        reference_id: post.reference_id,
      };
    });

    res.status(200).json({
      posts,
    });
  } catch (error) {
    console.error(new Error(error));
    res.status(500).json({
      error: error.message,
    });
  }
});

router.post("/", requeireAuth, async (req, res) => {
  const { text, quote_id, reference_id } = req.body;

  try {
    const post = new Post({
      text,
      quote_id,
      reference_id,
      user_id: req.user.id,
      date: new Date(),
    });

    await post.save();

    const user = await User.findById(req.user.id);
    user.posts.push(post);
    await user.save();

    res.status(200).json({
      post: {
        id: post.id,
        text: post.text,
        user_id: post.user_id,
        comments: post.comments,
        date: post.date,
        quote_id: post.quote_id,
        reference_id: post.reference_id,
      },
    });
  } catch (error) {
    console.error(new Error(error));
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = { postRouter: router };
