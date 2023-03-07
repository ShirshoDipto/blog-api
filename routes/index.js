const express = require("express")
const router = express.Router()
const passport = require("passport")
const userController = require("../controllers/userController")
const postController = require("../controllers/postController")
const commentController = require("../controllers/commentController")
const replyController = require("../controllers/replyController")

/** Login and Signup routes.  */
router.post("/login", userController.login)

router.post("/signup", userController.signup)

/** Post related routes.  */
router.get("/posts", postController.getAllPosts)

router.post("/posts", passport.authenticate("jwt", { session: false }), postController.createPost)

router.get("/posts/:postId", postController.getSinglePost)

router.put("/posts/:postId", passport.authenticate("jwt", { session: false }), postController.updatePost)

router.delete("/posts/:postId", passport.authenticate("jwt", { session: false }), postController.deletePost)

// /** Comment related routes. */
router.get("/posts/:postId/comments", commentController.getAllComments)

router.post("/posts/:postId/comments", passport.authenticate("jwt", { session: false }), commentController.createComment)

router.get("/posts/:postId/comments/:commentId", commentController.getSingleComment)

router.put("/posts/:postId/comments/:commentId", passport.authenticate("jwt", { session: false }), commentController.updateComment)

router.delete("/posts/:postId/comments/:commentId", passport.authenticate("jwt", { session: false }), commentController.deleteComment)

// /** Reply related routes. */
// router.get("/posts/:postId/comments/:commentId/replies", replyController.getAllReplies)

// router.post("/posts/:postId/comments/:commentId/replies", passport.authenticate("jwt", { session: false }), replyController.createReply)

// router.get("/posts/:postId/comments/:commentId/replies/:reply", replyController.getSingleReply)

// router.put("/posts/:postId/comments/:commentId/replies/:reply", passport.authenticate("jwt", { session: false }), replyController.updateReply)

// router.delete("/posts/:postId/comments/:commentId/replies/:reply", passport.authenticate("jwt", { session: false }), replyController.deleteReply)

// /** Likes related routes. */




// router.get("/:userId", passport.authenticate("jwt", { session: false }), (req, res, next) => {
//   res.send("Get request for user information. ")
// })

module.exports = router;
