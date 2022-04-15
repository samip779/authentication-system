const User = require("./../model/user");

exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    res.status(400).json({
      success: false,
      error: "This email is already taken",
    });
  } else {
    const newUser = new User({
      name,
      email,
      password,
    });
    await newUser.save();
    res.send(newUser);
  }
};
