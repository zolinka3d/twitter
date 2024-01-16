const express = require("express");
const router = require("./lib/router");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cookieSession = require("cookie-session");
const DB = require("./lib/db");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
const port = process.env.PORT || 2137;

app.use(
  cookieSession({
    name: "app-auth",
    keys: ["secret-new", "secret-old"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  console.log(`4 - serializeUser ${JSON.stringify(user.id)}`);
  return done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log(`5 - deserializeUser ${id}`);
  let user = DB.findOne(id);
  if (user) {
    return done(null, { id: user.id, email: user.email });
  } else {
    return done(new Error("User not found"));
    // return done(null, false);
  }
});

passport.use(
  "local",
  new LocalStrategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {
      console.log(`2 - local strategy verify cb ${JSON.stringify(username)}`);

      let user = DB.findByEmail(username);

      if (!user) {
        return done(null, false);
      }

      // compare password to stored password false of true
      const result = await new Promise((resolve, reject) => {
        bcrypt.compare(password, user.security.passwordHash, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });

      if (result) {
        return done(null, user);
      } else {
        return done("password or username incorrect. please try again", null);
      }
    }
  )
);

app.use("/api", router);

try {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
  });
} catch (error) {
  console.log("Server is not running.");
  console.log(error);
}
