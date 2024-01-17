const express = require("express");
const User = require("../models/MongoUser");
let router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");

const requeireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.status(403).json({
      timestamp: Date.now(),
      msg: "Access denied. Unauthorised user.",
      code: 403,
    });
  }
};

router.post("/register", async (req, res) => {
  if (req.isAuthenticated()) {
    req.logout();
  }

  try {
    const { username, email, password } = req.body;
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
        return res.status(400).json({
          timestamp: Date.now(),
          msg: "User with this email already exists",
          code: 400,
        });
      }

      console.error(new Error(error));
    }
  } catch (error) {
    console.log(error);
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
    console.log(`3 - passport authenticate cb ${JSON.stringify(user)}`);

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
    console.log("test");

    const user = await User.findById(req.user.id);
    console.log(user);
    if (!user)
      return res.status(404).json({
        timestamp: Date.now(),
        msg: "User not found",
        code: 404,
      });

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
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

module.exports = router;
