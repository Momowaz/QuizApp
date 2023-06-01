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

// Get all quizzes
const getAllQuizzes = function () {
  return db
    .query(`
    SELECT * FROM quizzes
    WHERE is_private = FALSE
    ORDER BY id DESC;
    `)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.error('query error', err.stack);
    });
}

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

// Get my quizes
const getMyQuizes = function(userID) {
  // const userid = `SELECT id FROM users WHERE name = '${userID}'`;
  // console.log("my quiz list userid: ", userid);
  return db
    .query(`
    SELECT *
    FROM quizzes
    WHERE id = $1;
    `, [userid])
    .then((result) => {
      console.log("result: ", result);
      return result.rows[0];
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
  getMyQuizes
};
