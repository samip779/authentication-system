const router = require("express").Router();
const {
  createUser,
  signIn,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/user.controllers");
const { isResetTokenValid } = require("../middlewares/user.middlewares");

const { validateUser, validate } = require("../middlewares/validator");

router.post("/create", validateUser, validate, createUser);

router.post("/signin", signIn);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", isResetTokenValid, resetPassword);

module.exports = router;
