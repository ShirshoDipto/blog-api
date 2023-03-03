const express = require("express")
const router = express.Router()

router.get("/", (req, res, next) => {
  res.send("It is working. ")
})

module.exports = router;