const express = require("express");
let router = express.Router();
const requeireAuth = require("../middleware/requireAuth");
const User = require("../models/MongoUser");
const Post = require("../models/MongoPost");
const { fetchPostDetails } = require("../utils/postDetails");
const { fetchQuoteData } = require("../utils/postDetails");

router.get("/", requeireAuth, async (req, res) => {
  const { id } = req.user;

  try {
    let user = await User.findById(id).populate("followers");
    let followers = user.followers.map((user) => {
      return {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
      };
    });

    user = await User.findById(id).populate("following");
    const following = user.following.map((user) => {
      return {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
      };
    });

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        followers: followers,
        following: following,
      },
    });
  } catch (error) {
    console.error(new Error(error));
  }
});

router.get("/following", requeireAuth, async (req, res) => {
  const { id } = req.user;

  try {
    const user = await User.findById(id).populate("following");
    const following = user.following.map((user) => {
      return {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
      };
    });

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        following: following,
      },
    });
  } catch (error) {
    console.error(new Error(error));
  }
});

router.post("/:username", requeireAuth, async (req, res) => {
  const { username } = req.params;

  try {
    const me = await User.findById(req.user.id);
    const requestedUser = await User.findOne({ username: username });
    if (!requestedUser) {
      return res.status(400).json({
        timestamp: Date.now(),
        msg: "User not found",
        code: 400,
      });
    }
    if (me.following.includes(requestedUser.id)) {
      return res.status(400).json({
        timestamp: Date.now(),
        msg: "Already following",
        code: 400,
      });
    }
    me.following.push(requestedUser.id);
    requestedUser.followers.push(me.id);

    await me.save();
    await requestedUser.save();

    console.log(me);
    console.log(requestedUser);

    res.json({
      msg: "Followed",
    });
  } catch (error) {
    console.error(new Error(error));
  }
});

router.delete("/:username", requeireAuth, async (req, res) => {
  const { username } = req.params;

  try {
    const me = await User.findById(req.user.id);
    const requestedUser = await User.findOne({ username: username });

    if (!requestedUser) {
      return res.status(400).json({
        timestamp: Date.now(),
        msg: "User not found",
        code: 400,
      });
    }
    if (!me.following.includes(requestedUser.id)) {
      return res.status(400).json({
        timestamp: Date.now(),
        msg: "Not following",
        code: 400,
      });
    }
    me.following.pull(requestedUser.id);
    requestedUser.followers.pull(me.id);

    await me.save();
    await requestedUser.save();

    console.log(me.following);
    console.log(requestedUser.followers);

    res.json({
      msg: "Unfollowed",
    });
  } catch (error) {
    console.error(new Error(error));

    res.status(400).json({
      msg: "Error",
    });
  }
});

// find users by name
router.get("/search", async (req, res) => {
  const { username } = req.query;

  try {
    const users = await User.find({
      username: { $regex: username, $options: "i" },
    });
    const usersList = users.map((user) => {
      return {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
      };
    });
    res.status(200).json({
      users: usersList,
    });
  } catch (error) {
    console.error(new Error(error));
    res.status(400).json({
      msg: "Error",
    });
  }
});

// find user by username
router.get("/profile/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json({
        timestamp: Date.now(),
        msg: "User not found",
        code: 400,
      });
    } else {
      const isFollowingMe = user.following.includes(req.user.id);
      const amIFollowing = user.followers.includes(req.user.id);
      const posts = await Post.find({ user_id: user.id }).sort({ date: -1 });
      const postDetails = await fetchPostDetails(posts);
      console.log(postDetails);

      res.status(200).json({
        user: {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
          followersLength: user.followers.length,
          followingLength: user.following.length,
          isFollowingMe: isFollowingMe,
          amIFollowing: amIFollowing,
          posts: postDetails,
        },
      });
    }
  } catch (error) {
    console.error(new Error(error));
    res.status(400).json({
      msg: "Error",
    });
  }
});

module.exports = { followerRouter: router };
