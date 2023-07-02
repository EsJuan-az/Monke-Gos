const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: String,
    name: String,
    birthday: Date,
    groups: [{
      chatId: String,
      exp: Number,
      level: Number,
      totalMsg: Number,
    }]
  });

module.exports = mongoose.model('User', userSchema);