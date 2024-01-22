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
  });
};

module.exports = socketManager;
