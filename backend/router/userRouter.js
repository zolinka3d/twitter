const express = require("express");
const User = require("../models/MongoUser");
const Post = require("../models/MongoPost");
let router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const yup = require("yup");
const {
  userSchema,
  usernameSchema,
  emailSchema,
  passwordSchema,
} = require("../validation/validationSchema");
const requeireAuth = require("../middleware/requireAuth");
const { fetchPostDetails } = require("../utils/postDetails");

router.post("/register", async (req, res) => {
  if (req.isAuthenticated()) {
    req.logout();
  }

  try {
    const { username, email, password } = req.body;

    await userSchema.validate({ username, email, password });

    const passwordHash = await bcrypt.hash(password, 10);
    try {
      const user = await User.create({
        username,
        email,
        password: passwordHash,
      });

      res.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      if (error.code === 11000) {
        if (error.keyValue.username) {
          return res.status(400).json({
            timestamp: Date.now(),
            msg: "Username already exists",
            code: 400,
          });
        } else if (error.keyValue.email) {
          return res.status(400).json({
            timestamp: Date.now(),
            msg: "Email already exists",
            code: 400,
          });
        }
      }

      console.error(new Error(error));
    }
  } catch (error) {
    console.log(error);
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({
        timestamp: Date.now(),
        msg: error.message,
        code: 400,
      });
    }
    res.status(500).json({
      timestamp: Date.now(),
      message: "Failed to register user. Internal server error",
      code: 500,
    });
  }
});

router.post("/login", (req, res, next) => {
  console.log(`1 - login handler)`);

  passport.authenticate("local", (err, user) => {
    // console.log(`3 - passport authenticate cb ${JSON.stringify(user)}`);
    console.log(`3 - passport authenticate cb`);

    if (err) {
      return res.status(401).json({
        timestamp: Date.now(),
        msg: "Access denied. Username or password is incorrect.",
        code: 401,
      });
    }

    if (!user) {
      return res.status(401).json({
        timestamp: Date.now(),
        msg: "Access denied. Unauthorised user.",
        code: 401,
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        redirectTo: "/profile",
      });
    });
  })(req, res, next);
});

router.get("/user", requeireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user)
      return res.status(404).json({
        timestamp: Date.now(),
        msg: "User not found",
        code: 404,
      });
    let posts = await Post.find({ user_id: user.id }).sort({ date: -1 });
    const postDetails = await fetchPostDetails(posts);
    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        posts: postDetails,
      },
    });
  } catch (error) {
    console.error(new Error(error));
    res.status(500).json({
      timestamp: Date.now(),
      msg: "Falided to get user, Internal server error",
      code: 500,
    });
  }
});

router.delete("/logout", async (req, res, next) => {
  try {
    req.logout();

    res.status(200).json({
      timestamp: Date.now(),
      msg: "User logged out successfully",
      code: 200,
    });
  } catch (error) {
    throw new Error(error);
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error(new Error(error));
    res.status(500).json({
      timestamp: Date.now(),
      msg: "Failed to get users. Internal server error",
      code: 500,
    });
  }
});

router.put("/profile", requeireAuth, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const updates = {};

    if (username !== "") {
      await usernameSchema.validate({ username });
      updates.username = username;
    }
    if (email !== "") {
      await emailSchema.validate({ email });
      updates.email = email;
    }
    if (password !== "") {
      await passwordSchema.validate({ password });
      const passwordHash = await bcrypt.hash(password, 10);
      updates.password = passwordHash;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    });

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({
        timestamp: Date.now(),
        msg: error.message,
        code: 400,
      });
    }

    console.error(new Error(error));

    res.status(500).json({
      timestamp: Date.now(),
      msg: "Failed to update user. Internal server error",
      code: 500,
    });
  }
});

router.put("/profile/avatar", requeireAuth, async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        avatar,
      },
      { new: true }
    );

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error(new Error(error));
    res.status(500).json({
      timestamp: Date.now(),
      msg: "Failed to update user. Internal server error",
      code: 500,
    });
  }
});

router.all("*", async (req, res) => {
  try {
    res.status(404).json({
      timestamp: Date.now(),
      msg: "Not found",
      code: 404,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { userRouter: router };
