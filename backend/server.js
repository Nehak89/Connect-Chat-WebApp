const express = require("express");
const { chats } = require("./data/data");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoute");
const chatRoutes = require("./routes/chatRoutes");
const cors = require("cors");
const path = require("path");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const MessageRoutes = require("./routes/MessageRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); // tells the server to accept json data

const PORT = process.env.PORT || 5002;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/app/chat", (req, res) => {
  res.send(chats);
});
app.use("/app/user", userRoutes);
app.use("/app/chat", chatRoutes);
app.use("/app/message", MessageRoutes);

//----------------------Deployement-------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running successfully..");
  });
}

//----------------------Deployement-------------------------

app.get("/app/chat/:id", (req, res) => {
  const singlechat = chats.find((c) => c._id == req.params.id);
  res.send(singlechat);
});
app.use(errorHandler);
app.use(notFound);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});
io.on("connection", (socket) => {
  console.log("connection to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.to(user._id).emit("message recieved", newMessageRecieved);
    });
  });
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
