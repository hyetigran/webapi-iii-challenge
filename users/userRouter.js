const express = require("express");

const userDb = require("./userDb");
const router = express.Router();

// router.post("/", (req, res) => {});

// router.post("/:id/posts", (req, res) => {});

router.get("/", (req, res) => {
  userDb
    .get()
    .then(res => {
      res.status(200).json(res);
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving posts" });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  console.log("1. id", id);
  userDb
    .getById(id)
    .then(user => {
      console.log("happy path");
      console.log("2. user", user);
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving the user" });
    });
});

// router.get("/:id/posts", (req, res) => {});

// router.delete("/:id", (req, res) => {});

// router.put("/:id", (req, res) => {});

//custom middleware

// function validateUserId(req, res, next) {}

// function validateUser(req, res, next) {}

// function validatePost(req, res, next) {}

module.exports = router;
