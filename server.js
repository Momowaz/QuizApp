// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require('./routes/users-api');
const widgetApiRoutes = require('./routes/widgets-api');
const usersRoutes = require('./routes/users');
const usersDatabase = require("./db/localDB.js");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/users', userApiRoutes);
app.use('/api/widgets', widgetApiRoutes);
app.use('/users', usersRoutes);
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).


const quizData = [
  {
    question: 'Question 1',
    options: ['Option 1', 'Option 2', 'Option 3', 'Option 4']
  }
];

const quizIntro = [
  {
    question: 'Quiz 1',
    options: ['User: Mohib']
  },
  {
    question: 'Quiz 2',
    options: ['User: Mitali']
  },
  {
    question: 'Quiz 3',
    options: ['User: Gurpreet']
  },
  // Add more box data as needed
];


app.get('/', (req, res) => {
  // const userId = req.session.userId;
  // const user = usersDatabase[userId] 
  res.render('home', { quizList: quizIntro });
  // if (user) {
  // } else {
  //   res.redirect("/login");
  //   return;
  // }
});

app.get('/quiz', (req, res) => {
  res.render('quiz', { quizQs: quizData });
});

app.post('/quiz', (req, res) => {
  res.render('quiz', { quizQs: quizData });
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
