const Post = require("../models/post")
const Comment = require("../models/comment")
const Reply = require("../models/reply")
const { body, validationResult } = require("express-validator")
const { deleteMany } = require("../models/post")

exports.getAllPosts = async (req, res, next) => {
  try {
    const allPosts = await Post.find({}).sort({ date: -1 })
    res.json({ user: res.currentUser, allPosts, success: "All posts fetched successfully." })
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

async function deleteAllReplies(comments) {
  try {
    for (let comment of comments) {
      await Reply.deleteMany({ commentId: comment._id })
    }
  } catch(err) {
    throw new Error(err)
  }
}

async function deleteAllComments(id) {
  try {
    const allComments = await Comment.find({ postId: id })
    await Promise.all([
      Comment.deleteMany({ postId: id }),
      deleteAllReplies(allComments)
    ])
  } catch(err) {
    throw new Error(err)
  }
}

exports.deletePost = async (req, res, next) => {
  try {
    await Promise.all([
      Post.findByIdAndRemove(req.params.postId),
      deleteAllComments(req.params.postId)
    ]).then(results => {
      return res.json({ success: "Post deleted successfully. "})
    })
  } catch(err) {
    return next(err)
  }
}
