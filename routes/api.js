'use strict';

const express = require("express");
const router = express.Router();
const BlogPost = require('./models/post');
const User = require('./models/user');

//PARAME
//User, Tags

router.param('usersId', function(req, res ,next, id){
  BlogPost.find({authorId: id}, function(err, doc){
    if(err) return next(err);
    if(!doc){
      err = new Error('Not Found');
      err.status = 404;
      return next(err);
    }
    req.userList = doc;
    return next();
  });
});

router.param('tagId', function(req, res ,next, tag){
  BlogPost.find({tags: tag}, function(err, tag){
    if(err) return next(err);
    if(!tag){
      err = new Error('Not Found');
      err.status = 404;
      return next(err);
    }
    req.tagList = tag;
    return next();
  });
});

//KEY query
//Results are to be used as keys with other queries

router.get('/users', function(req, res, next, users){
  User.find()
      .distinct('_id')
      .project({_id: 1, name: 1})
      .exec(function(err, users){
        if(err) return next(err);
        if(!users) {
          err = new Error('Not Found');
          err.status = 404;
          return next(err);
        }
        req.users = users;
        return next();
      });
});

router.get('/tags', function(req, res, next, tags){
  BlogPost.find()
          .distinct('tags')
          .project({tags: 1})
          .exec(function(err, tags){
            if(err) return next(err);
            if(!tags){
              err = new Error('Not Found');
              err.status = 404
            }
            req.tags = tags;
            return next();
          });
});

//VALUE query
//Use index query value to retive data for that key
router.get('/:tagId', function(req, res, next){
  res.json(req.tagList);
});

router.get('/:usersId', function(req, res, next){
  res.json(req.userList);
});

//PREST Query
//Indexis Queries
rounter.get('/', function(req, res, next){
  BlogPost.find()
          .limit(10)
          .exec(function(err, post){
            if(err) return next(err);
            res.json(post);
          });
});
rounter.get('/:limit-:offset', function(req, res, next){
  BlogPost.find()
          .limit(req.params.limit)
          .offset(req.params.offset)
          .exec(function(err, post){
            if(err) return next(err);
            res.json(post);
          });
});
module.exports = api;
