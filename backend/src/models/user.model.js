import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username:     { type: String, required: true, unique: true },
    email:        { type: String, required: true, unique: true },
    password:     { type: String, required: true },
    img:          { type: String, default: "" },
    country:      { type: String, required: true },
    phone:        { type: String, default: "" },
    desc:         { type: String, default: "" },
    isSeller:     { type: Boolean, default: false },
    refreshToken: { type: String, default: "" },
  },
  { timestamps: true }
);

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);