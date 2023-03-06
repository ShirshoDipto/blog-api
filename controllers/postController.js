const Post = require("../models/post")
const Comment = require("../models/comment")
const Reply = require("../models/reply")
const { body, validationResult } = require("express-validator")

exports.getAllPosts = async (req, res, next) => {
  try {
    const allPosts = await Post.find({}).sort({ date: -1 })
    console.log(res.currentUser)
    res.json({ user: res.currentUser, allPosts })
  } catch(err) {
    return next(err)
  }
}

exports.createPost = [
  body("title", "Title must be specified. ")
  .trim()
  .isLength({min: 1})
  .escape(),
  
  body("content", "Content field cannot be empty. ")
  .trim()
  .isLength({min: 1})
  .escape(),
  
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
        
      }
      if (!req.user.isBlogOwner) {
        return res.status(403).json({ error: "This user is not allowed to create post. " })
      }
  
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        author: {
          authorId: req.user._id,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
        },
        isPublished: req.body.isPublished,
        numLikes: req.body.numLikes,
        numComments: req.body.numComments
      })
  
      const savedPost = await post.save()
  
      return res.json({ post: savedPost, success: "Post created successfully. " })
    } catch(err) {
      return next(err)
    }
  }
]

exports.getSinglePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId)
    if (!post) {
      return res.status(404).json({ error: "Post not found. " })
    }
    return res.json({ post, success: "Post fetched successfully. " })
  } catch(err) {
    return next(err)
  }
}

exports.updatePost = [
  body("title", "Title must be specified. ")
  .trim()
  .isLength({min: 1})
  .escape(),
  
  body("content", "Content field cannot be empty. ")
  .trim()
  .isLength({min: 1})
  .escape(),
  
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }
      if (!req.user.isBlogOwner) {
        return res.status(403).json({ error: "This user is not allowed to update post. " })
      }

      const post = await Post.findById(req.params.postId)
      post.title = req.body.title
      post.content = req.body.content
      post.isPublished = req.body.isPublished
  
      const savedPost = await post.save()
  
      return res.json({ post: savedPost, success: "Post updated successfully. " })
    } catch(err) {
      return next(err)
    }
  }
]

exports.deletePost = async (req, res, next) => {
  try {
    const allComments = await Comment.find({ postId: req.params.postId })
    for (let comment of allComments) {
      await Reply.deleteMany({ commentId: comment._id })
    }
    await Comment.deleteMany({ postId: req.params.postId })
    await Post.findByIdAndRemove(req.params.postId)
    return res.json({ success: "Post deleted successfully. "})
  } catch(err) {
    return next(err)
  }
}