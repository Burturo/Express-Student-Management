var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {sequelize}=require('./models/model')
const session = require('express-session');
const passport = require('./config/passport');

//var indexRouter = require('./routes/indexRoute');
var usersRouter = require('./routes/usersRoute');
var authRouter = require('./routes/authRoute');
var travauxRouter = require('./routes/travauxRoute');
var dashboardRouter = require('./routes/dashboardRoute');
var coursesRouter = require('./routes/coursesRoute');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configurer la session
app.use(session({
  secret: 'your_secret_key', // Changez cette clé secrète
  resave: false,
  saveUninitialized: false
}));

// Initialiser Passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRouter);
app.use('/register', authRouter);
//app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/dashboard', dashboardRouter);
app.use('/courses', coursesRouter);
app.use('/travaux', travauxRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;



