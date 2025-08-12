const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("Mosh Store");
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
