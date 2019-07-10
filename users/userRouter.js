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
  //console.log("1. id", id);
  userDb
    .getById(id)
    .then(user => {
      //console.log("happy path");
      //console.log("2. user", user);
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving the user" });
    });
});

router.get("/:id/posts", (req, res) => {
  const { id } = req.params;
  userDb
    .getById(id)
    .then(userData => {
      //console.log(userData);
      userDb
        .getUserPosts(userData.id)
        .then(result => {
          //console.log("happy path");
          res.status(200).json(result);
        })
        .catch(err => {
          console.log(err);
          res.status(404).json({ errorMessage: "Can't find that id!" });
        });
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ errorMessage: "Can't find the posts for the user" });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  userDb
    .remove(id)
    .then(res => {
      console.log("happy path");
      console.log("result", res);
      if (res) {
        res.status(200).json({ message: "The user has been deleted" });
      } else {
        res.status(404).json({ message: "The user could not be found" });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ errorMessage: "There was an error removing the user" });
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params.id;
  const user = req.body;
  userDb.update(id, user).then(result => {
    res.status(200).json(result);
  }).catch(err => {
    res.status(500).json({
      message: "Error updating the post"
    });
});

//custom middleware

// function validateUserId(req, res, next) {}

// function validateUser(req, res, next) {}

// function validatePost(req, res, next) {}

module.exports = router;
