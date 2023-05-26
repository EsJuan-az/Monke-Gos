import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId: String,
    chatId: String,
    exp: Number,
    level: Number
  });

export const User = mongoose.model('User', userSchema);