// code away!
const express = require("express");
const userRoutes = require("./users/userRouter");

const server = express();

server.use(express.json());

//server.get("/", (req, res, next) => {});

server.use("/", userRoutes);

server.listen(5000, () => {
  console.log("The magic is at 5000");
});
