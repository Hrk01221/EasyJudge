import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  otp: { type: String, required: true },
  otpExpiry: { type: Date, required: true },
});

const pendingUserModel =
  mongoose.models.pendingUser || mongoose.model("pendingUser", pendingUserSchema);

export default pendingUserModel;
