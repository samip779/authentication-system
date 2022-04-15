const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("<h2>Hello express </h2>");
});

app.listen(8000, () => {
  console.log("app is running");
});
