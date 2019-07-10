// code away!
const express = require("express");
const userRoutes = require("./users/userRouter");

const server = express();

server.use(express.json());
server.use(express.json());

// Inital 'sanity check'
server.get("/", (req, res, next) => {
  res.send(`<h1>Hellow World! - Learning Middleware</h1>`);
});

server.use("/", userRoutes);

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get(
      "Origin"
    )}`
  );
  next();
}

server.listen(5000, () => {
  console.log("The magic is at 5000");
});
