const express = require("express");
require("./db");

const userRouter = require("./routes/user.routes");

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());

app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
