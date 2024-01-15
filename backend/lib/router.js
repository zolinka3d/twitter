const express = require("express");
const User = require("../models/user");
let router = express.Router();
const passport = require("passport");

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    let user = new User();
    let msg = false;
    msg = user.setFirstName(firstName);
    if (msg)
      return res.status(400).json({
        type: "firstName",
        message: msg,
        code: 400,
      });

    msg = user.setLastName(lastName);
    if (msg)
      return res.status(400).json({
        type: "lastName",
        message: msg,
        code: 400,
      });

    msg = user.setEmail(email);
    if (msg)
      return res.status(400).json({
        type: "email",
        message: msg,
        code: 400,
      });

    msg = await user.setPassword(password);
    if (msg)
      return res.status(400).json({
        type: "password",
        message: msg,
        code: 400,
      });

    // everything is ok
    user.save();
    res.status(201).json(user);
  } catch (error) {
    throw new Error(error);
  }
});

// router.post("/login", async (req, res) => {
//   try {
//     res.status(200).json({
//       timestamp: Date.now(),
//       msg: "User logged in successfully",
//       code: 200,
//     });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

router.post("/login", (req, res, next) => {
  console.log(`1 - login handler ${JSON.stringify(req.body)}`);

  passport.authenticate("local", (err, user) => {
    console.log(`3 - passport authenticate cb ${JSON.stringify(user)}`);

    if (err) {
      //   return next(err);
    }

    if (!user) {
      //   return res.status(401).json({
      //     timestamp: Date.now(),
      //     msg: "Unauthorized",
      //     code: 401,
      //   });
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

router.delete("/logout", async (req, res) => {
  try {
    res.status(200).json({
      timestamp: Date.now(),
      msg: "User logged out successfully",
      code: 200,
    });
  } catch (error) {
    throw new Error(error);
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
