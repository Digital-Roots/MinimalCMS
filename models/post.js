'use strict';

var mongoose = require("mongoose");
const User = require('./user');

const BlogPostSchema = new mongoose.Schema({
  title:{
    type: String,
    requiried: true
  },
  post:{
    type: String,
    requiried: true
  },
  tags:{
    type: Map,
    of: String
  },
 authorId:{
   type: String,
   requiried: true
 },
  author:{
    type: String,
    requiried: true
  },
  auhtorContact:{
    type: Map,
    of: String
  }
});

let BlogPost = mongoose.model('BlogPost', BlogPostSchema);
module.export = BlogPost;
