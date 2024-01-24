const User = require("../models/MongoUser");
const userSockets = new Map();

const socketManager = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.user.username);
    if (socket.user && socket.user.id) {
      userSockets.set(socket.user.id.toString(), socket);
    }

    socket.on("disconnect", () => {
      userSockets.delete(socket.user.id.toString());
      console.log("User disconnected", socket.id, socket.user.username);
    });

    socket.on("chat message", (msg) => {
      console.log("Message from user:", socket.user.username, msg);
      io.emit("chat message", { user: socket.user.username, message: msg });
    });

    socket.on("post", async (msg) => {
      console.log("Post from user:", socket.user.username, msg);
      let user = await User.findById(socket.user.id);
      let userFollowersIds = user.followers.map((follower) =>
        follower.toString()
      );
      console.log(userFollowersIds);

      userFollowersIds.forEach((followerId) => {
        if (userSockets.has(followerId)) {
          const followerSocket = userSockets.get(followerId);
          followerSocket.emit("post", {
            from: socket.user.username,
          });
        }
      });
    });

    socket.on("ban", async (msg) => {
      let me = await User.findById(socket.user.id);
      let user = await User.findOne({ username: msg });

      console.log("Ban from user:", me.username, "to ", msg);

      let userId = user.id.toString();
      if (userSockets.has(userId)) {
        const userSocket = userSockets.get(userId);
        userSocket.emit("ban", {
          from: me.username,
          userId: me.id,
        });
      }
    });
  });
};

module.exports = socketManager;
