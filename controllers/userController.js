const { body, validationResult } = require("express-validator")
const passport = require("passport")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const User = require("../models/user")

function generatePlainUserObject(user) {
  const userOb = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
    isBlogOwner: user.isBlogOwner,
  }

  return userOb
}

exports.signup = [
  body("firstName", "First Name must be specified. ")
  .trim()
  .isLength({min: 1})
  .escape(),

  body("lastName", "Last Name must be specified. ")
  .trim()
  .isLength({min: 1})
  .escape(),

  body("email")
  .trim()
  .isLength({min: 1})
  .withMessage("Email must be specifeid. ")
  .isEmail()
  .withMessage("Input has to be an email. ")
  .escape(),

  body("password", "password must be apecified and at least 8 characters long. ")
  .trim()
  .isLength({min: 8})
  .escape(),

  body("confirmPassword")
  .custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error("Password doesn't match. ")
    }
    return true
  }),

  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
      }
      if (await User.findOne({email: req.body.email})) {
        return res.status(400).json({ error: "User already exists. Try Logging in. " })
      }
      const hashedPassword = await bcrypt.hash(req.body.confirmPassword, 10)
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword
      })
      await user.save()

      const plainUserObject = generatePlainUserObject(user)
  
      const token = jwt.sign(plainUserObject, process.env.JWT_SECRET);
      return res.json({ user: plainUserObject, token });
      // req.login(user, { session: false }, (err) => {
      //   if (err) {
      //     return next(err)
      //   }
      // });
    } catch(err) {
      return next(err)
    }
  }
]

exports.login = [
  body("email")
  .trim()
  .isLength({min: 1})
  .withMessage("Email must be specified. ")
  .isEmail()
  .withMessage("Input has to be an email. ")
  .escape(),

  body("password", "Password field cannot be empty. ")
  .trim()
  .isLength({min: 1})
  .escape(),

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          info: info,
          user: user,
        });
      }
  
      req.login(user, { session: false }, (err) => {
        if (err) {
          return next(err);
        }
        const plainUserObject = generatePlainUserObject(user)
  
        const token = jwt.sign(plainUserObject, process.env.JWT_SECRET);
        return res.json({ user: plainUserObject, token });
      });
    })(req, res, next);
  }
]