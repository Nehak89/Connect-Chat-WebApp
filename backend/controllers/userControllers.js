//before this installed express-async handler which handles all error that occurs here (i.e express files)
const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }
  const userExists = await User.findOne({ email }); // mongodb query this searchs if email is there in db or not
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  } // throw error if email already present

  const user = await User.create({
    // this is creating a new user
    name,
    email,
    password,
  });
  //when everything happens successfully just send a success code
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      // pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

const authuser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      // pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search // here search is from /app/user?search=gagan&lastname=sadhrush,search is query param
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }); //$ne is not equal to the current user who is searching, except him show everyone else data
  res.send(users); // for user._id part in the find , we need to authorize the user first before being able to find it and do $ne,so authMiddleware.js
});
module.exports = { registerUser, authuser, allUsers };
