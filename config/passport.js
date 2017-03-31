var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

function isAuthenticated(req,res,next){
    if(req.isAuthenticated())return next();
      res.send(401);
}

passport.use('register', new LocalStrategy({
  usernameField : 'user',
  passwordField : 'pass',
  passReqToCallback : true
  },
  function(req, user, pass, done) {
    console.log("type", req.body.type)
    User({
    username:user,
    password:pass,
    type: req.body.type
    }).save(function(err, user){
      console.log("err ",err)
      console.log("user ",user)
      if(err) { return done(null, false, { alert: err }); }
      /*if(!user) {
        return done(null, false, { alert: 'Error in registering' })
      }*/
      else { return done(null, user); }
  })
  }));

passport.use('login', new LocalStrategy({
usernameField : 'user',
passwordField : 'pass',
passReqToCallback : true
},
  function(req, user, pass, done) {
    User.findOne({ username: user }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { alert: 'Incorrect username' });
      }
      if (user.password != pass) {
        return done(null, false, {alert: 'Incorrect password'});
      }
      return done(null, user);
    });
  }
));