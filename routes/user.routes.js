const router = require("express").Router();
const {
  createUser,
  signIn,
  verifyEmail,
  forgotPassword,
} = require("../controllers/user.controllers");

const { validateUser, validate } = require("../middlewares/validator");

router.post("/create", validateUser, validate, createUser);

router.post("/signin", signIn);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

module.exports = router;
