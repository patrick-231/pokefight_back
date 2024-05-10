//
// userRouter.js
//

const express = require("express");

const { loginUser, signUpUser } = require("../controllers/userController");

const app = express.Router();

// Login
// 
// In our implementation this stacks up to the mount path being defined 
// earlier via app.use("/user", userRouter);
// http://localhost:PORT/user/login
// 
app.post("/login", loginUser);

// Signup
// 
// In our implementation this stacks up to the mount path being defined 
// earlier via app.use("/user", userRouter);
// http://localhost:PORT/user/signup
// 
app.post("/signup", signUpUser);

module.exports = app;