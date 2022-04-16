const { sendError } = require("../utils/helper");
const User = require("./../model/user");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) return sendError(res, "This Email is already taken", 401);

  const newUser = new User({
    name,
    email,
    password,
  });
  await newUser.save();
  res.send(newUser);
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email.trim() || !password.trim()) {
    return sendError(res, "Email or Password missing", 400);
  }
  const user = await User.findOne({ email });
  if (!user) return sendError(res, "User not found");

  const isMatched = await user.comparePassword(password);
  if (!isMatched) return sendError(res, "Email or Password doesn't match");

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({
    success: true,
    user: { name: user.name, email: user.email, id: user._id, token },
  });
};
