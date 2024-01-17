const express = require("express");
let router = express.Router();
const requeireAuth = require("../middleware/requireAuth");
const User = require("../models/MongoUser");

router.get("/", requeireAuth, async (req, res) => {
  const { id } = req.user;

  try {
    const user = await User.findById(id).populate("followers");
    const followers = user.followers.map((user) => {
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

router.post("/", requeireAuth, async (req, res) => {
  const { username } = req.body;

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

module.exports = { followerRouter: router };
