function loggedIn(req, res, next){
  if(req.session && req.session.userId){
    return next();
  }
  const err = new Error('must be logged in to view this page');
  err.status = 401;
  return res.json(err)
}

module.exports.loggedIn = loggedIn;
