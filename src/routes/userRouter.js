//
// userRouter.js
//

const express = require("express");

const {
  loginUser,
  signUpUser,
  getAllUsers,
  getUserByEmail,
  deleteUserByEmail
} = require("../controllers/userController");

const app = express.Router();

// In our implementation the follwing paths stacks up to the mount path being defined 
// earlier via app.use("/user", userRouter);
// Example: http://localhost:PORT/user/login

// Login (POST)
// 
app.post("/login", loginUser);

// Signup (POST) = Add user
// 
app.post("/signup", signUpUser);

// getAllUsers (GET)
// 
app.get("/users", getAllUsers);

// getUserByEmail (GET)
// 
app.get("/users/:email", getUserByEmail);

// deleteUserByEmail (DELETE)
// 
app.delete("/users/:email", deleteUserByEmail);

module.exports = app;