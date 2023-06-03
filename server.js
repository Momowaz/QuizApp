// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const cookieSession = require("cookie-session");
const database = require('./db/database.js');

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
app.use(cookieSession({
  name: "session",
  keys: ["key1"]
}));


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
    title: 'Quiz 1',
    user: ['User: Mohib']
  },
  {
    title: 'Quiz 2',
    user: ['User: Mitali']
  },
  {
    title: 'Quiz 3',
    user: ['User: Gurpreet']
  },
  {
    title: 'Quiz 4',
    user: ['User: David']
  },
  {
    title: 'Quiz 5',
    user: ['User: Lucy']
  }
  // Add more box data as needed
];

const myQuizes = [
  {
    title: 'Quiz 1',
    user: ['User: Mohib']
  },
  {
    title: 'Quiz 2',
    user: ['User: Mohib']
  },
  {
    title: 'Quiz 3',
    user: ['User: Mohib']
  },
  // Add more box data as needed
];


app.get('/quiz/:id', (req, res) => {
  const quizID = req.params.id
  console.log("quizID in server ", quizID);

  database
    .getQuiz(quizID)
    .then((quiz) => {
      const templateVars = {
        quizQs: quiz,
        user: req.session.userId
      }
      console.log("quiz promise:", quiz);
      res.render('quiz', templateVars);
    })
    .catch((e) => {
      console.log(e);
      console.error(e);
      res.send(e);
    });
});

app.get('/', (req, res) => {
  database
    .getAllQuizzes()
    .then((quizzes) => {
      const templateVars = {
          quizList: quizzes,
          user: req.session.userId
        }
      res.render('home', templateVars);
    })
    .catch((e) => {
      console.error(e);
      res.send(e);
    });

  // // previous code
  // const templateVars = {
  //   quizList: quizIntro,
  //   user: req.session.userId
  // }
  // res.render('home', templateVars);

});

// app.get('/quiz', (req, res) => {
//   database
//     .getQuiz()
//     .then((quiz) => {
//       const templateVars = {
//         quizQs: quiz,
//         user: req.session.userId
//       }
//       res.render('quiz', templateVars);
//     })
//     .catch((e) => {
//       console.error(e);
//       res.send(e);
//     });


  // const templateVars = {
  //   quizQs: quizData,
  //   user: req.session.userId
  // }
  // res.render('quiz', templateVars);
// });



app.post('/quiz', (req, res) => {
  const templateVars = {
    quizQs: quizData,
    user: req.session.userId
  }
  res.render('quiz', templateVars);
});

app.get('/myquizes', (req, res) => {
  database
    .getMyQuizes(req.session.userId)
    .then((quizzes) => {
      const templateVars = {
          myQuizesList: quizzes,
          user: req.session.userId
        }
      res.render('myquizes', templateVars);
    })
    .catch((e) => {
      console.error(e);
      res.send(e);
    });


  // previous code
  // const templateVars = {
  //   myQuizesList: myQuizes,
  //   user: req.session.userId
  // }
  // res.render('myquizes', templateVars);
});

const getMyQuizes = function(userID) {
  return db
    .query(`
    SELECT *
    FROM quizzes
    WHERE user_id =
    (SELECT id FROM users WHERE name = $1`
    , [userID])
    .then((result) => {
      console.log("result: ", result);
      return result.rows;
    })
    .catch((err) => {
      console.log(err);
      console.error('query error', err.stack);
    })
}

app.get("/login", (req, res) => {
  const templateVars = {
    user: req.session.userId
  }
  res.render('login', templateVars);

  // --- Mohib code ---
  // res.render("login");
});

app.get("/register", (req, res) => {
  const templateVars = {
    user: req.session.userId
  }
  res.render('register', templateVars);

  // --- Mohib code ---
  // res.render("register");
});

app.get("/createQuiz", (req, res) => {
  const templateVars = {
    user: req.session.userId
  }
  res.render("createQuiz", templateVars);
});

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// Endpoint to handle the quiz data submission
app.post('/createQuiz', (req, res) => {
  const { id, question, options, answer } = req.body;

  // Insert quiz data into the PostgreSQL database
  const questionQuery = 'INSERT INTO questions (quiz_id, question) VALUES ($1, $2)';
  const questionValues = [id, question];

  const optionQuery = 'INSERT INTO answers (question_id, answers, its_right) VALUES ($1, $2, $3)';
  const optionValues = [id, options, ];

  pool.query(questionQuery, questionValues, optionQuery,  optionValues, (err, result) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      console.log('Quiz data inserted successfully');
      res.status(200).json({ message: 'Quiz data inserted successfully' });
    }
  });
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
