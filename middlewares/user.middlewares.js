const { sendError } = require("../utils/helper");
const { isValidObjectId } = require("mongoose");
const User = require("../model/user");
const ResetToken = require("../model/resetToken");

exports.isResetTokenValid = async (req, res, next) => {
  const { token, id } = req.query;
  if (!token || !id) return sendError(res, "Invalid Request");

  if (!isValidObjectId(id)) return sendError(res, "Invalid User");

  const user = await User.findById(id);
  if (!user) return sendError(res, "User not found");

  const resetToken = await ResetToken.findOne({ owner: user._id });
  if (!resetToken) return sendError(res, "Token not found");

  const isMatched = await resetToken.compareToken(token);
  if (!isMatched) return sendError(res, "This token is invalid");

  req.user = user;
  next();
};
