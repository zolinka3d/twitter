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
    await user.save();

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
  ///
  const page = parseInt(req.query.page) || 1; // Domyślnie strona 1
  const limit = parseInt(req.query.limit) || 10; // Domyślnie 10 postów
  const skip = (page - 1) * limit;

  console.log(id);
  try {
    let user = await User.findById(id).populate("following");
    let userIds = [id, ...user.following.map((user) => user.id)];
    let posts = await Post.find({ user_id: { $in: userIds } })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const postsDetails = await fetchPostDetails(posts);
    res.status(200).json({
      posts: postsDetails,
    });
  } catch (error) {
    console.error(new Error(error));
    res.status(500).json({
      error: error.message,
    });
  }
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

    // res.status(200).json({
    //   post: {
    //     id: post.id,
    //     text: post.text,
    //     user_id: post.user_id,
    //     comments: post.comments,
    //     date: post.date,
    //     quote_id: post.quote_id,
    //     reference_id: post.reference_id,
    //   },
    // });
  } catch (error) {
    console.error(new Error(error));
    res.status(500).json({
      error: error.message,
    });
  }
});

// try {
//   let posts = await Post.find({ user_id: { $in: following } }).sort({
//     date: -1,
//   });
//   const postDetails = await Promise.all(
//     posts.map(async (post) => {
//       let userData = await User.findById(post.user_id);
//       let quoteData = post.quote_id
//         ? await Post.findById(post.quote_id)
//         : null;
//       let referenceData = post.reference_id
//         ? await Post.findById(post.reference_id)
//         : null;

//       return {
//         id: post.id,
//         text: post.text,
//         user: {
//           id: userData.id,
//           username: userData.username,
//           avatar: userData.avatar,
//         },
//         comments: post.comments,
//         date: post.date,
//         quote: quoteData,
//         reference: referenceData,
//       };
//     })
//   );
//   res.status(200).json({
//     posts: postDetails,
//   });
// } catch (error) {
//   console.error(new Error(error));
//   res.status(500).json({
//     error: error.message,
//   });
// }

module.exports = { postRouter: router };
