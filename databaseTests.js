const Post = require("./models/post")
const Comment = require("./models/comment")
const Reply = require("./models/reply")
const comment = require("./models/comment")
const CommentLike = require("./models/commentLike")
const PostLike = require("./models/postLike")
const mongoose = require("mongoose")
require("dotenv").config()

mongoose.set("strictQuery", false)
const mongodb = process.env.MONGODB_URI
async function main() {
  await mongoose.connect(mongodb)
  console.log("Connection Successful. ")
// an id "640189b3c2dc3b9e1a4b2446"
  // const newReply = new Reply({
  //   author: {
  //     authorId: "640189b3c2dc3b9e1a4b2446",
  //     firstName: "Shusme",
  //     lastName: "Islam"
  //   },
  //   content: "Hello amr jaan",
  //   numLikes: "5000",
  // })

  // const savedReply = await newReply.save()

  // const newComment = new Comment({
  //   content: "Hello",
  //   author: {
  //     authorId: "640189b3c2dc3b9e1a4b2446",
  //     firstName: "Shirsho",
  //     lastName: "Dipto"
  //   },
  //   replies: [savedReply._id],
  //   numLikes: "1000",
  //   postId: "640189b3c2dc3b9e1a4b2446"
  // })

  // const savedComment = await newComment.save()
  // const comment = await Comment.findOne({}).populate("replies")
  // console.log(comment.replies[0].date_formatted)

  // const newCommentLike = new CommentLike({
  //   author: "640189b3c2dc3b9e1a4b2446",
  // })

  // const savedLikeComment = await newCommentLike.save()
  // console.log("comment like", savedLikeComment)

  // const newPostLike = new PostLike({
  //   author: "640189b3c2dc3b9e1a4b2446",
  // })

  // const savedLikePost = await newPostLike.save()
  // console.log("post like", savedLikePost)

  const newPost = new Post({
    title: "New title 2",
    content: "Hahahahahahahahahahahaha",
    author: {
      authorId: "640189b3c2dc3b9e1a4b2446",
      firstName: "Ahmad",
      lastName: "Nibras"
    },
    numLikes: "200",
    numComments: "100",
    isPublished: false
  })

  const savedPost = await newPost.save()

  console.log(savedPost)
}

main().catch(err => console.log(err))
