var express = require('express');
var router = express.Router();
const userModel = require('./users')
const postModel = require('./posts')


/* GET home page. */


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET Find Post. */

router.get('/alluserposts' , async function (req , res , next){
  let user = await userModel
  .findById({_id:'655353176185353301461436'})
  .populate('posts')
  res.send(user)
})


/* GET Create User. */


router.get('/createuser', async function(req, res, next) {
 let createduser = await userModel.create({
    username: "Azaz",
    password: "azaz2002",
    posts: [],
    email: "azaz@mail.com",
    fullname:'Md Azaz'

  })
  res.send(createduser)
});


/* GET Create Posts. */


router.get('/createpost', async function(req, res, next) {
  let createdpost = await postModel.create({
    postText: "Hello kaise ho saare",
    user:"655353176185353301461436"
   })
   let user = await userModel.findOne({_id: "655353176185353301461436"})
   user.posts.push(createdpost._id)
   await user.save()
   res.send('done')
 });

module.exports = router;
