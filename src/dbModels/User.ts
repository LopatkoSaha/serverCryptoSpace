import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  email: String,
  name: String,
  password: String,
});

export const User = mongoose.model("User", userSchema);
