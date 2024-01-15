const express = require("express");
const router = require("./lib/router");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cookieSession = require("cookie-session");

const app = express();

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
  console.log(`4 - serializeUser ${JSON.stringify(user)}`);
  return done(null, user.id);
});

passport.use(
  "local",
  new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
      console.log("2 - local strategy verify cb!!!!");
      // this is where we call db
      // to verify the user
      return done(null, { id: "test" });
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
