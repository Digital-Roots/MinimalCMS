const express = require('express');
const router = express.Router();
const mid = require('../middleware');
const BlogPost = require('../models/post');
const User = require('../models/user');
const showdown  = require('showdown');
const converter = new showdown.Converter();

router.param('userId', function(req, res, next, id){
  BlogPost.find({authorId: id}, function(err, userPosts){
    if(err) return next(err);
    if(!id){
      err = new Error('Not Found');
      err.status = 404;
      return next(err);
    }
    req.userPosts = userPosts;
  });
});

router.get("/:userId", mid.loggedIn, function(req, res){
  res.json(req.userPosts)
});

router.post("/:userId/new", mid.loggedIn, function(req, res){
  const newPost = new BlogPost({
    title: req.body.title,
    post: req.body.post,
    tags: req.body.tags
  });
  newPost.save(function(err, newPost){
    if(err) return next(err);
    res.status(201);
    res.json(req.userPosts)
  });
});

router.delete("/:userId/delete/:post", mid.loggedIn, function(req, res){

});

router.put("/:userId/edit/:post", mid.loggedIn, function(req, res){

});

module.exports = router;
