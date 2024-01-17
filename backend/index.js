const express = require("express");
const router = require("./lib/router");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cookieSession = require("cookie-session");
require("dotenv").config();
const bcrypt = require("bcrypt");
const cors = require("cors");
const mongoose = require("mongoose");
const dbConnData = require("./config/db");
const User = require("./models/MongoUser");

const app = express();
app.use(
  cors({
    origin: process.env.FRONT_URL,
    credentials: true,
  })
);

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

passport.deserializeUser(async (id, done) => {
  console.log(`5 - deserializeUser ${id}`);

  const user = await User.findById(id);

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

      const user = await User.findOne({ username: username });
      console.log(user);
      if (!user) {
        return done(null, false);
      }

      // compare password to stored password false of true
      const result = await new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, result) => {
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

mongoose
  .connect(
    `mongodb://${dbConnData.host}:${dbConnData.port}/${dbConnData.database}`,
    {}
  )
  .then((response) => {
    console.log(
      `Connected to MongoDB. Database name: "${response.connections[0].name}"`
    );
    const port = process.env.PORT || 2137;
    const apiHost = process.env.API_HOST || "localhost";
    app.listen(port, () => {
      console.log(`API server available from: http://${apiHost}:${port}`);
    });
  })
  .catch((error) => console.error("Error connecting to MongoDB", error));
