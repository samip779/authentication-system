const router = require("express").Router();
const { createUser } = require("../controllers/user.controllers");
const User = require("./../model/user");

router.post("/create", createUser);

module.exports = router;
