const Post = require("./models/post")
const mongoose = require("mongoose")
require("dotenv").config()

mongoose.set("strictQuery", false)
const mongodb = process.env.MONGODB_URI
async function main() {
  await mongoose.connect(mongodb)
  console.log("Connection Successful. ")

  const newPost = new Post({
    title: "hello",
    content: "Text content",
    author: {
    author1: {
      authorId: "63f6e1a67b38768ca361679f",
      firstName: "Shirsho",
      lastName: "Dipto"
    },
    author2: {
      authorId: "63f6e1a67b38768ca361679f",
      firstName: "Shirsho",
      lastName: "Dipto"
    },
  }
  })

  const savedPost = await newPost.save()
  console.log(savedPost)
}

main().catch(err => console.log(err))