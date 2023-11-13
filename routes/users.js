
const mongoose = require('mongoose');

mongoose.connect('mongod://127.0.0.1:27017/pinterest')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  posts: [],

  dp: {
    type: String, // You might want to store the image URL or file path
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
});


module.exports = mongoose.model('User', userSchema);
