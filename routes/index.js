var express = require('express');
var router = express.Router();
const userModel = require('./users')
const postModel = require('./posts')
const passport = require('passport')

const localStrategy = require('passport-local')
passport.use(new localStrategy(userModel.authenticate()))


/* GET home page. */


router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/feed', function(req, res, next) {
  res.render('feed');
});

/** Profile router */

router.get('/profile', isLoggedIn , (req , res)=>{
  res.render('welcome to profile')
})

/* GET register page. */


router.post('/register', function(req, res, next) {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });
  
  userModel.register(userData , req.body.password)
  .then(function(){
    passport.authenticate('local')(req , res , function(){
      res.redirect('/profile')
    })
  })
});



/** login page */

router.post('/login' , passport.authenticate('local' , {
  successRedirect: '/profile',
  failureRedirect: '/login'
}) , function(req , res){})



/** logout page */

router.get('/logout' , function(req , res){ 
  req.logout(function(err){
    if(err){return next(err);} 
    res.redirect('/');
  })
})


/** isLoggedIn  */

function isLoggedIn(req , res , next){
  if(req.isAuthenticated()) return next()
  res.redirect('/login')
}


module.exports = router;
