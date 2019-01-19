const express = require('express');
const router = express.Router();
const BlogPost = require('../models/post');
const User = require('../models/user');

router.post('/login', function(req, res, next) {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      }  else {
        req.session.userId = user._id;
          return res.redirect('/user/' + user._id);
        }
      });
  } else {
    var err = new Error('Email and password are required.');
    err.status = 401;
    return next(err);
  }
});

module.exports = router;
