const db = require('./connection');

// Get a single user from the database given their email.
const getUserWithEmail = function (email) {
  return db
    .query(`
      SELECT * FROM users
      WHERE email = $1;
    `, [email])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.error('query error', err.stack);
    });
};
// Add a new user to the database.
const addUser = function (user) {
  return db
    .query(`
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [user.name, user.email, user.password])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.error('query error', err.stack);
    })
};

// Get all quizzes
const getAllQuizzes = function () {
  return db
    .query(`
    SELECT * FROM quizzes
    WHERE is_private = FALSE
    ORDER BY id;
    `)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.error('query error', err.stack);
    });
}



// Get my quizes
const getMyQuizes = function(userID) {
  return db
    .query(`
    SELECT *
    FROM quizzes
    WHERE user_id =
    (SELECT id FROM users WHERE name = $1);
    `, [userID])
    .then((result) => {
      console.log("result: ", result);
      return result.rows;
    })
    .catch((err) => {
      console.log(err);
      console.error('query error', err.stack);
    })
}

// Get quiz questions
const getQuiz = function(qid) {
  return db
    .query(`
    SELECT questions.*, answers.*
    FROM questions
    JOIN answers ON questions.id = answers.question_id
    WHERE questions.quiz_id = $1
    GROUP BY questions.id, answers.id;
    `, [qid])
    .then((result) => {
      console.log("result: ", result);
      return result.rows;
    })
    .catch((err) => {
      console.log(err);
      console.error('query error', err.stack);
    })
}

const getAnswers = function(qid) {
  return db
    .query(`
    SELECT answers.*
    FROM questions
    JOIN answers ON questions.id = answers.question_id
    WHERE questions.quiz_id = $1
    GROUP BY questions.id, answers.id;
    `, [qid])
    .then((result) => {
      console.log("result: ", result);
      return result.rows;
    })
    .catch((err) => {
      console.log(err);
      console.error('query error', err.stack);
    })
}



module.exports = {
  getUserWithEmail,
  getAllQuizzes,
  addUser,
  getMyQuizes,
  getQuiz,
  getAnswers
};
