import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId: String,
    name: String,
    birthday: Date,
    levels: [{
      chatId: String,
      exp: Number,
      level: Number
    }]
  });

export const User = mongoose.model('User', userSchema);