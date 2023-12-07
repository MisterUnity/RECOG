require("dotenv").config();
// const createError = require("http-errors");
// const path = require("path");
// const cookieParser = require("cookie-parser");
// const logger = require('morgan');
// const session = require("express-session");
// const usersRouter = require('./routes/users');
const express = require("express");
const cors = require("cors");
const indexRouter = require("./routes/index");
const googlesheet = require("./routes/sheet");
const nodemailer = require(`./routes/email`);
const { requestStart, requestEnd } = require("./myMiddle"); // Middleware
const { errorResp } = require("./response");
const {
  logger,
  requestLoggerFormat,
  normalLoggerFormat,
} = require("./vendor/winston");
require("./vendor/googlesheet/index"); //googlesheet

const app = express();

// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");
app.use(cors());

// app.use(
//   session({
//     secret: "keyboard cat",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false },
//   })
// );

// app.use(logger('short'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

// === always logging request start ===
app.use(requestStart);

// === Enable API Route List ===
app.use("/", indexRouter);
app.use("/sheet", googlesheet);
app.use("/email", nodemailer);
// app.use('/users', usersRouter);
// === Enable API Route List ===

app.use(requestEnd);
// === always logging request end ===

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// catch all uncatched error
app.use(function (err, req, res, next) {
  // error logging
  logger.error(normalLoggerFormat("[Final Trigger]"));
  if (err) {
    logger.error(normalLoggerFormat(err));
  } else {
    logger.error(requestLoggerFormat(req, res));
  }
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  res.send(errorResp());
});

module.exports = app;
