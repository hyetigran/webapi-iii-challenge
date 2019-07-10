const express = require("express");

const userDb = require("./userDb");
const postsDb = require("../posts/postDb");
const router = express.Router();

router.post("/", validateUser, async (req, res) => {
  const user = req.body;
  await userDb
    .insert(user)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json({
        message: "Error adding the user"
      });
    });
});

router.post("/:id/posts", validatePost, async (req, res) => {
  const { params, body } = req;
  await userDb
    .getById(params.id)
    .then(result => {
      console.log(result[0].id);
      const postData = { ...body, user_id: params.id };
      const newPost = postsDb.insert(postData);
      res.status(201).json(newPost);
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Server errror" });
    });
});

router.get("/", (req, res) => {
  userDb
    .get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving users" });
    });
});

router.get("/:id", validateUserId, async (req, res) => {
  const { id } = req.params;
  //console.log("1. id", id);
  await userDb
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

router.get("/:id/posts", validateUserId, async (req, res) => {
  const { id } = req.params;
  await userDb
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

router.delete("/:id", validateUserId, async (req, res) => {
  const { id } = req.params;
  await userDb
    .remove(id)
    .then(user => {
      console.log("happy path");
      console.log("result", user);
      if (user) {
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

router.put("/:id", validateUserId, validateUser, async (req, res) => {
  const { id } = req.params.id;
  const user = req.body;
  await userDb
    .update(id, user)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json({
        message: "Error updating the post"
      });
    });
});
//custom middleware

async function validateUserId(req, res, next) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: 400,
      error: "Please provide a valid id"
    });
  } else {
    const user = await userDb.getById(id);
    if (user) {
      return next();
    } else {
      return res.status(404).json({
        status: 404,
        error: "User was not found"
      });
    }
  }
}

function validateUser(req, res, next) {
  const { body } = req;
  // status is true if request body is empty
  const status = Object.keys(body).length === 0;
  //const status = Object.keys(body).length === 0 && body.constructor === Object;
  if (status) {
    return res.status(400).json({
      status: 400,
      message: "missing user data"
    });
  } else {
    if (!body.name) {
      return res.status(400).json({
        status: 400,
        message: "missing required name field"
      });
    } else {
      return next();
    }
  }
}

async function validatePost(req, res, next) {
  const { body } = req;
  const status = Object.keys(body).length === 0;
  if (status) {
    return res.status(400).json({
      status: 400,
      message: "missing post data"
    });
  } else {
    if (!body.text) {
      return res.status(400).json({
        status: 400,
        message: "missing required text field"
      });
    } else {
      return next();
    }
  }
}

module.exports = router;
