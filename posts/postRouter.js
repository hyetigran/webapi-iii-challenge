const express = require("express");

const router = express.Router();

const postsDb = require("./postDb");

router.get("/", (req, res) => {
  postsDb
    .get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving posts" });
    });
});

router.get("/:id", validatePostId, async (req, res) => {
  const { id } = req.params;
  //console.log("1. id", id);
  await postsDb
    .getById(id)
    .then(post => {
      //console.log("happy path");
      //console.log("2. post", post);
      res.status(200).json(post);
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving the post" });
    });
});

router.delete("/:id", validatePostId, async (req, res) => {
  const { id } = req.params;
  await postsDb
    .remove(id)
    .then(post => {
      console.log("happy path");
      console.log("result", post);
      if (post) {
        res.status(200).json({ message: "The post has been deleted" });
      } else {
        res.status(404).json({ message: "The post could not be found" });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ errorMessage: "There was an error removing the post" });
    });
});

router.put("/:id", validatePostId, async (req, res) => {
  const { id } = req.params.id;
  const post = req.body;
  await postsDb
    .update(id, post)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json({
        message: "Error updating the post"
      });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: 400,
      error: "Please provide a valid post id"
    });
  } else {
    const post = postsDb.getById(id);
    if (post) {
      return next();
    } else {
      return res.status(404).json({
        status: 404,
        error: "Post was not found"
      });
    }
  }
}

module.exports = router;
