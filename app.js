const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const path = require("path")
require("dotenv").config()
require("passport")
const apiRouter = require("./api")

const app = express()
app.use(cors())  // going to change this later on. 
app.use("/api", apiRouter)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.set("strictQuery", false)
const mongodb = process.env.MONGODB_URI
async function main() {
  await mongoose.connect(mongodb)
  console.log("Connection Successful. ")
  app.listen(process.env.PORT, () => console.log(`Server listening on port ${process.env.PORT}`))
}

main().catch(err => console.log(err))
