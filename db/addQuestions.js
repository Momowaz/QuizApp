const db = require('./db/database');

// Function to insert the question and answers into the database
async function addQuestionToDatabase(question, options) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // Insert the question into the questions table
    const questionQuery = 'INSERT INTO questions (quiz_id, question) VALUES ($1, $2) RETURNING id';
    const questionValues = [quizId, question];
    const questionResult = await client.query(questionQuery, questionValues);
    const questionId = questionResult.rows[0].id;

    // Insert the answers into the answers table
    const answerQuery = 'INSERT INTO answers (question_id, answers, is_right) VALUES ($1, $2, $3)';
    const answerValues = options.map((option, index) => [questionId, option, index === 0]); // Assuming the first option is the correct one
    await Promise.all(answerValues.map(value => client.query(answerQuery, value)));

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Express route handler for the form submission
app.post('/create-quiz', (req, res) => {
  const question = req.body.question;
  const options = [
    req.body.option1,
    req.body.option2,
    req.body.option3,
    req.body.option4,
  ];

  addQuestionToDatabase(question, options)
    .then(() => {
      res.redirect('/myquizes'); // Redirect to the desired page after successful insertion
    })
    .catch(error => {
      console.error('Error inserting question:', error);
      res.status(500).send('Internal Server Error');
    });
});
