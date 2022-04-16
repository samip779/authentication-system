const router = require("express").Router();
const { createUser, signIn } = require("../controllers/user.controllers");
const { validateUser, validate } = require("../middlewares/validator");

router.post("/create", validateUser, validate, createUser);

router.post("/signin", signIn);

module.exports = router;
