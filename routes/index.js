var express = require('express');
var router = express.Router();
const userModel = require('./users')
const postModel = require('./posts')
const passport = require('passport')
const upload = require('./multer')

const localStrategy = require('passport-local')
passport.use(new localStrategy(userModel.authenticate()))


/* GET home page. */


router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login' , {error: req.flash('error')});
});

router.get('/feed', function(req, res, next) {
  res.render('feed');
});

/** Upload router */

router.post('/upload', isLoggedIn , upload.single('file') ,async function(req, res, next) {
  if(!req.file){
    return res.status(404).send('no file were given')
  }
  
  const user = await userModel.findOne({username: req.session.passport.user});
  const post = await postModel.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    user: user._id
  })

  user.posts.push(post._id);
  await user.save();
  res.redirect('/profile')
});

/** Profile router */

router.get('/profile', isLoggedIn , async (req , res)=>{
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  .populate('posts')
  res.render('profile' , {user})
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
  failureRedirect: '/login',
  failureFlash: true
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


module.exports = router
