var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const compression = require("compression");
const helmet = require("helmet");
require("dotenv").config();

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function (email, password, cb) {
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          return cb(null, false, {
            message: "Email does not exist. Sign Up instead. ",
          });
        }

        const res = await bcrypt.compare(password, user.password);

        if (res) {
          return cb(null, user);
        } else {
          return cb(null, false, { message: "Incorrect Password. " });
        }
      } catch (err) {
        console.log(err);
        return cb(err);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async function (jwtPayload, cb) {
      try {
        return cb(null, jwtPayload.user);
      } catch (err) {
        console.log(err);
        return cb(err);
      }
    }
  )
);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();
app.use(
  cors({
    origin: ["https://shirsho-blog.netlify.app", "http://localhost:3000"],
  })
);
app.use(compression());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  console.log(err);
  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;
