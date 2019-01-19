'use strict';

const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name:{
    first:{
      type: String,
      requiried: true,
      trim: true,
    },
    last:{
      type: String,
      requiried: true,
      trim: true,
    }
  },
  email:{
    type: String,
    requiried: true,
    trim: true,
    unique: true
  },
  security:{
    username:{
      type: String,
      requiried: true,
      trim: true,
      unique: true
    },
    password:{
      type: String,
      requiried: true
    }
  },
  socialContact:{
    type: Map,
    of: String,
    validate: function(map) {
        for (const contact of map.values()) {
          if (contact.startsWith('http://') ||
          contact.startsWith('https://') ||
          contact.includes('github') ||
          contact.includes('facebook') ||
          contact.includes('twitter')) {
            throw new Error(`Handle ${contact} must not be a URL`);
          }
        }
        return true;
      }
  }
});

UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ email: email })
      .exec(function (error, user) {
        if (error) {
          return callback(error);
        } else if ( !user ) {
          const err = new Error('User not found.');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, user.password , function(error, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            return callback();
          }
        })
      });
}

UserSchema.pre('save', function(next) {
  let user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

let User = mongoose.model('User', UserSchema);
module.export = User;
