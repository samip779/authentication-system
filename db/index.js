const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/auth-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => console.log(err));
