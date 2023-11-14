var express = require('express');
var router = express.Router();
const userModel = require('./users')
const postModel = require('./posts')
const passport = require('passport')

const localStrategy = require('passport-local')
passport.authenticate(new localStrategy(userModel.authenticate()))


/* GET home page. */


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/** Profile router */

router.get('/profile', isLoggedIn , (req , res)=>{
  res.send('welcome to profile')
})

/* GET register page. */


router.get('/register', function(req, res, next) {
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
  failureRedirect: '/'
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
  res.redirect('/')
}


module.exports = router;
