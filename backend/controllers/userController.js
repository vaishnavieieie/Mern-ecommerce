import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";

//@desc Auth user and get Token
//@route POST /api/users/login
//@acc Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && user.matchPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

//@desc Get user profile
//@route GET /api/users/profile
//@acc Public
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    // console.log(user);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//@desc Register
//@route POST /api/users
//@acc Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user Data");
  }
});

//@desc Update user profile
//@route PUT /api/users/profile
//@acc Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    // console.log(user);
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      isAdmin: updated.isAdmin,
      token: generateToken(updated._id),
    });
  } else {
    res.status(404);
    throw new Error("Profile Update Error");
  }
});

//@desc Get all users
//@route GET /api/users
//@acc Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  if (users) {
    res.json(users);
  } else {
    res.status(404);
    throw new Error("Users not found");
  }
});

//@desc Delete user
//@route DELETE /api/users/:id
//@acc Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//@desc Get user by id
//@route GET /api/users/:id
//@acc Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//@desc Update user by admin
//@route PUT /api/users/:id
//@acc Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    // console.log(user);
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      isAdmin: updated.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User Update Error");
  }
});

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
