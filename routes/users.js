/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const bcrypt = require("bcrypt");
const database = require("../db/database");

const router  = express.Router();

// router.get('/', (req, res) => {
//   res.render('users');
// });


// Log a user in
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  database.getUserWithEmail(email).then((user) => {
    if (!user) {
      return res.send({ error: "no user with that id" });
    }
    if (!user.password) {
      console.log(error);
      return res.send({ error: "Please enter password" });
    }
    // set cookie
    req.session.userId = user.name;
    console.log("cookie session: ", req.session.userId);
    res.redirect('/');
  });
});


// Create a new user
router.post("/register", (req, res) => {
  const user = req.body;
  // user.password = bcrypt.hashSync(user.password, 12);
  database
    .addUser(user)
    .then((user) => {
      if (!user) {
        return res.send({ error: "error" });
      }
      // set cookie
      req.session.userId = user.name;
      res.redirect('/');
    })
    .catch((e) => res.send(e));
});

// Log a user out
router.post("/logout", (req, res) => {
  req.session.userId = null;
  res.redirect("/login");
});



module.exports = router;
