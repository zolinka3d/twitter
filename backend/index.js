const express = require("express");
const { userRouter } = require("./router/userRouter");
const { followerRouter } = require("./router/followersRouter");
const { postRouter } = require("./router/postRouter");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cookieSession = require("cookie-session");
require("dotenv").config();
const bcrypt = require("bcrypt");
const cors = require("cors");
const mongoose = require("mongoose");
const dbConnData = require("./config/db");
const User = require("./models/MongoUser");

const sessionMiddleware = cookieSession({
  name: "app-auth",
  keys: ["secret-new", "secret-old"],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  secure: true,
  sameSite: "none",
});

const app = express();

app.use(
  cors({
    origin: process.env.FRONT_URL,
    credentials: true,
  })
);
app.use(sessionMiddleware);

// socket.io
const http = require("http");

const https = require("https");
const fs = require("fs");
const path = require("path");

const { Server } = require("socket.io");
// const server = http.createServer(app);
const server = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
  },
  app
);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use(async (socket, next) => {
  const session = socket.request.session;
  if (session && session.passport && session.passport.user) {
    const userId = session.passport.user;
    const user = await User.findById(userId);
    if (user) {
      socket.user = user;
      next();
    } else {
      next(new Error("User not found"));
    }
  } else {
    next(new Error("Unauthorized"));
  }
});

const socketManager = require("./listeners/socketManager");

socketManager(io);

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
      if (!user) {
        return done(null, false);
      }

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

app.use("/api/followers", followerRouter);
app.use("/api/posts", postRouter);
app.use("/api", userRouter);

app.use(express.static("public"));
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

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
    server.listen(port, () => {
      console.log(`API server available from: http://${apiHost}:${port}`);
    });
  })
  .catch((error) => console.error("Error connecting to MongoDB", error));
