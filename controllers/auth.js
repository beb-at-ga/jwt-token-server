require('dotenv').config();
const router = require('express').Router();
const db = require('../models');
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
  res.send(req.body);
});

router.post('/signup', (req, res) => {
  // res.send(req.body);
  db.User.findOne({
    email: req.body.email
  })
    .then(user => {
      // if user exists, do not let them create a duplicate account
      if (user) {
        return res.status(409).send({
          message: 'Email address already in use.'
        });
      } else {
        db.User.create(req.body)
          .then(newUser => {
            // assing user a JWT
            let token = jwt.sign(newUser.toJSON(), process.env.JWT_SECRET, {
              expiresIn: 60 * 60 // expiration in seconds.
            });

            res.send({
              token
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).send({
              message: 'Error creating new customer record.'
            });
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(503).send({
        message: 'Error accessing database. Please try again.'
      });
    });
});

router.get('/current/user', (req, res) => {
  res.send('on /current/user');
});

module.exports = router;
