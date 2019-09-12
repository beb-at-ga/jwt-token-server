require("dotenv").config();
const router = require("express").Router();
const db = require("../models");
const jwt = require("jsonwebtoken");

// POST /auth/login (find and validate user and send password)
router.post("/login", (req, res) => {
  // Find the user by their email address
  db.User.findOne({
    email: req.body.email
  })
    .then(user => {
      if (!user || !user.password) {
        return res.status(406).send({
          message: "Invalid Credentials"
        });
      }

      if (!user.isAuthenticated(req.body.password)) {
        // password did not match
        return res.status(406).send({
          message: "Invalid credentials"
        });
      }

      let token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
        expiresIn: 60 * 60
      });

      res.send({ token });
    })
    .catch(err => {
      console.log(err);
      res.status(503).send({
        message: "Something is amiss."
      });
    });
});

router.post("/signup", (req, res) => {
  // res.send(req.body);
  db.User.findOne({
    email: req.body.email
  })
    .then(user => {
      // if user exists, do not let them create a duplicate account
      if (user) {
        return res.status(409).send({
          message: "Email address already in use."
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
              message: "Error creating new customer record."
            });
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(503).send({
        message: "Error accessing database. Please try again."
      });
    });
});

router.get("/current/user", (req, res) => {
  if (!req.user) {
    res.status(500).send({ message: 'Something went wrong. Please try again.'})
  } else {
    // This is the user data from the time the token was issued, therfore if the user is updated,
    // those values will not be reflected here...

    // to avoid this problem, reissue token when you update their data. 
    // login, update, 
    res.json(req.user);
  }
});

module.exports = router;
