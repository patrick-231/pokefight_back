//
// userController.js
//

const UserSchema = require("../schemas/UserSchema");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "2d" });
};

// Login user
// 
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserSchema.login(email, password);

    //create token
    const token = createToken(user._id);

    res.status(200).json({ email, token });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Sign up user
//
// So if testing the POST request (Postman etc.), 
// place these values in the BODY, not as a query!! 
// 
const signUpUser = async (req, res) => {
  const { email, password } = req.body; 

  try {
    const user = await UserSchema.signup(email, password);
  
    // Create token
    const token = createToken(user._id);   
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginUser, signUpUser };