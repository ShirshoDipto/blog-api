const express = require("express")
const router = express.Router()
const passport = require("passport")
const userController = require("../controllers/userController")
const postController = require("../controllers/postController")
const commentController = require("../controllers/commentController")
const replyController = require("../controllers/replyController")

router.get("/:userId", passport.authenticate("jwt", { session: false }), (req, res, next) => {
  res.send("Get request for user information. ")
})

router.post("/login", userController.login)

// router.get("/:userId", (req, res, next) => {
//   res.send("Get request for user information. ")
// })

// router.get("/:userId", (req, res, next) => {
//   res.send("Get request for user information. ")
// })

// router.get("/:userId", (req, res, next) => {
//   res.send("Get request for user information. ")
// })

// router.get("/:userId", (req, res, next) => {
//   res.send("Get request for user information. ")
// })

module.exports = router;
