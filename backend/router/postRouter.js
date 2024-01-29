const express = require("express");
let router = express.Router();
const requeireAuth = require("../middleware/requireAuth");
const Post = require("../models/MongoPost");
const User = require("../models/MongoUser");
const { fetchPostDetails } = require("../utils/postDetails");
const { fetchQuoteData } = require("../utils/postDetails");

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
    user.homePagePosts.push(post);
    await user.save();

    const followersId = user.followers;
    const followers = await User.find({ _id: { $in: followersId } });
    followers.map(async (follower) => {
      follower.homePagePosts.push(post);
      await follower.save();
    });

    let reference = null;

    if (reference_id) {
      const reference_post = await Post.findById(reference_id);
      reference_post.comments.push(post);
      await reference_post.save();
      reference = await fetchQuoteData(reference_id);
    }
    let quote = null;
    if (quote_id) {
      quote = await fetchQuoteData(quote_id);
    }

    res.status(200).json({
      post: {
        id: post.id,
        text: post.text,
        user: {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
        },
        comments: post.comments,
        date: post.date,
        quote: quote,
        reference: reference,
      },
    });
  } catch (error) {
    console.error(new Error(error));
    res.status(500).json({
      error: error.message,
    });
  }
});

router.get("/home", requeireAuth, async (req, res) => {
  const { id } = req.user;
  const firstDate = req.query.firstDate;

  let me = await User.findById(id);
  let posts = [];
  if (!firstDate) {
    posts = await Post.find({
      _id: { $in: me.homePagePosts },
    })
      .sort({
        date: -1,
      })
      .limit(5);
  } else {
    posts = await Post.find({
      _id: { $in: me.homePagePosts },
      date: { $lt: firstDate },
    })
      .sort({
        date: -1,
      })
      .limit(5);
  }

  const postsDetails = await fetchPostDetails(posts);
  res.status(200).json({
    posts: postsDetails,
  });
});

router.get("/home/after", requeireAuth, async (req, res) => {
  const { id } = req.user;
  const lastDate = req.query.lastDate;
  let me = await User.findById(id);
  let posts = await Post.find({
    _id: { $in: me.homePagePosts },
    date: { $gt: lastDate },
  })
    .sort({
      date: 1,
    })
    .limit(5);

  const postSorted = posts.sort((a, b) => {
    return b.date - a.date;
  });

  const postsDetails = await fetchPostDetails(postSorted);
  res.status(200).json({
    posts: postsDetails,
  });
});

router.get("/:id", requeireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    let post = await Post.findById(id);
    let user = await User.findById(post.user_id);
    let postsDetails = await fetchPostDetails([post]);

    let comments = [];
    for (const comment_id of post.comments) {
      const comment = await Post.findById(comment_id);
      const user = await User.findById(comment.user_id);
      let comment_details = {
        id: comment.id,
        text: comment.text,
        user: {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
        },
        comments: comment.comments,
        date: comment.date,
        quote_id: comment.quote_id,
        reference_id: comment.reference_id,
      };
      comments.push(comment_details);
    }

    let posts = [postsDetails[0]];
    while (post.reference_id) {
      const reference_post = await Post.findById(post.reference_id);
      const user = await User.findById(reference_post.user_id);
      let reference_post_details = {
        id: reference_post.id,
        text: reference_post.text,
        user: {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
        },
        comments: reference_post.comments,
        date: reference_post.date,
        quote_id: reference_post.quote_id,
        reference_id: reference_post.reference_id,
      };
      posts.push(reference_post_details);
      post = reference_post;
    }

    res.status(200).json({
      posts: posts.reverse(),
      comments: comments.sort((a, b) => {
        return b.date - a.date;
      }),
    });
  } catch (error) {
    console.error(new Error(error));
    res.status(500).json({
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error(new Error(error));
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = { postRouter: router };
