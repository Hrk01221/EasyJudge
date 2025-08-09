import express from "express";
import {
  CheckOtp,
  isAuthenticated,
  login,
  logout,
  resetPassword,
  sendResetOtp,
  validateInfoAndSendOtp,
  verifyEmailRegister,
  checkVerifyOtpStatus,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.post("/validate-user-info-sendotp", validateInfoAndSendOtp);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/verify-account", verifyEmailRegister);
authRouter.get("/verify-otp-status", checkVerifyOtpStatus);
authRouter.get("/is-auth", userAuth, isAuthenticated);
authRouter.post("/send-reset-otp", sendResetOtp);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/check-reset-otp", CheckOtp);

export default authRouter;
