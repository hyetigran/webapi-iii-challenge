// code away!
const express = require("express");
const server = express();

server.get("/", (req, res, next) => {});

server.listen(5000, () => {
  console.log("The magic is at 5000");
});
