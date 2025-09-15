var createError = require('http-errors');
const express = require("express");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session");
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;

// Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// ✅ Import your user model (not the router)
const userModel = require("./routes/users");


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Session setup
app.use(session({
  secret: "hey hey",   // 👉 change this to process.env.SECRET in production
  resave: false,
  saveUninitialized: false
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// ✅ Passport config with userModel
passport.use(new LocalStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/profile', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// ✅ Start the server
app.listen(3000, () => {
  console.log("✅ Server started on http://localhost:3000");
});

module.exports = app;
