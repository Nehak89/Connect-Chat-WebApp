const mongoose = require("mongoose");
const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], //this is reference to the User model
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message", //this is reference to the message model
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //this is reference to the User model
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
