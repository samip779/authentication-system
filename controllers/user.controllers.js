const { sendError, createRandomBytes } = require("../utils/helper");
const User = require("./../model/user");
const VerificationToken = require("./../model/verificationToken");
const ResetToken = require("../model/resetToken");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const {
  generateOTP,
  mailTransport,
  generateEmailTemplate,
} = require("../utils/mail");
const { isValidObjectId } = require("mongoose");

exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) return sendError(res, "This Email is already taken", 401);

  const newUser = new User({
    name,
    email,
    password,
  });

  const OTP = generateOTP();
  const verificationToken = new VerificationToken({
    owner: newUser._id,
    token: OTP,
  });

  await verificationToken.save();
  await newUser.save();

  mailTransport().sendMail({
    from: "emailverification@email.com",
    to: newUser.email,
    subject: "Verify Your Email Address",
    html: generateEmailTemplate(OTP),
  });

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

exports.verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp.trim())
    return sendError(res, "Invalid request, missing parameters");

  if (!isValidObjectId(userId)) return sendError(res, "Invalid user id");

  const user = await User.findById(userId);
  if (!user) return sendError(res, "User not found");
  if (user.verified) return sendError(res, "This account is already verified");

  const token = await VerificationToken.findOne({ owner: user._id });
  if (!token) return sendError(res, "User not found");

  const isMatched = await token.compareToken(otp);
  if (!isMatched) return sendError(res, "Plears provide a valid token");

  user.verified = true;

  await VerificationToken.findByIdAndDelete(token._id);
  await user.save();

  mailTransport().sendMail({
    from: "emailverification@email.com",
    to: user.email,
    subject: "Welcome Email",
    html: "<h1>Email Verified Successfully </h1>",
  });

  res.json({
    success: true,
    message: "your email is verified",
    user: { name: user.name, email: user.email, id: user._id },
  });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return sendError(res, "Email Missing");

  const user = await User.findOne({ email });
  if (!user) return sendError(res, "User not found");

  const token = await ResetToken.findOne({ owner: user._id });
  if (token) return sendError(res, "You can get another token after 1 hour");

  const randomBytes = await createRandomBytes();
  const resetToken = new ResetToken({ owner: user._id, token: randomBytes });
  await resetToken.save();

  mailTransport().sendMail({
    from: "security@email.com",
    to: user.email,
    subject: "Password Reset",
    html: `<h1> 
              <a href="http://localhost:3000/reset-password?token=${randomBytes}&id=${user._id}">
              Click Here </a> 
              </h1>`,
  });

  res.json({
    success: true,
    message: "Password reset link is sent to your email.",
  });
};

exports.resetPassword = async (req, res) => {
  const { password } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) return sendError(res, "User not found");

  const isSamePassword = await user.comparePassword(password);
  if (isSamePassword)
    return sendError(res, "New password must be different from previous one");

  if (password.trim().length < 8 || password.trim().length > 20)
    return sendError(res, "Password must be 8-20 characters long");

  user.password = password.trim();

  await user.save();

  await ResetToken.findOneAndDelete({ owner: user._id });

  mailTransport().sendMail({
    from: "security@email.com",
    to: user.email,
    subject: "Password Reset Successfully",
    html: "<h1>password reset successfully </h1>",
  });

  res.json({ success: true, message: "password reset successfully" });
};
