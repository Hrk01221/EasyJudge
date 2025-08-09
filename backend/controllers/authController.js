import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import pendingUserModel from "../models/pendingUser.js";

const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
const validatePassword = (password) =>
  /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{6,}$/.test(password);
const isPasswordMatch = (password, confirmPassword) =>
  password === confirmPassword;
const createWelcomeEmail = (userName) => `
<!DOCTYPE html>
<html>
<head>
    <title>Welcome to EasyJudge</title>
    <style>
        @font-face {
            font-family: 'Comfortaa';
            src: url('https://fonts.gstatic.com/s/comfortaa/v41/1Ptsg8LJRfWJmhDAuUs4TYFs.woff2') format('woff2');
            font-weight: 400;
            font-style: normal;
        }

        body { 
            font-family: 'Comfortaa', sans-serif; 
            background-color: #f9f9f9; 
            color: #333; 
        }
        .container { 
            max-width: 600px; 
            margin: 40px auto; 
            background-color: #fff; 
            padding: 20px; 
            border: 2px solid #ccc;
            border-radius: 8px; 
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
        }
        .header {
            text-align: center; 
            padding: 20px 0;
        }
        .img {
            width: 50px; 
            height: 50px; 
        }
        .content { 
            padding: 20px; 
            line-height: 1.6; 
        }
        .footer { 
            text-align: center; 
            font-size: 12px; 
            color: #777; 
            margin-top: 20px; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
        <a href="https://freeimage.host/i/FLn4yua" target='_blank'><img src="https://iili.io/FLn4yua.md.png" alt="FLn4yua.md.png" border="0" alt = "logo" style = "height:40px"></a>
          
          <h2>EasyJudge</h2>
        </div>
        <hr style="border: 1px solid #ddd; margin: 5px 0;">
        <div class="content">
            <p>Dear <span style="color: #1F86F3;">${userName}</span>,</p>
            <p>Welcome to <span style="color: #1F86F3;">EasyJudge!</span> We're thrilled to have you join our platform, designed to enhance your coding journey and help you excel in <span style="color: #1F86F3;">competitive programming</span>.</p>
            <ul>
                <li>Practice coding problems across various difficulty levels.</li>
                <li>Participate in exciting contests to test your skills.</li>
                <li>Track your progress and improve with insightful feedback.</li>
                <li>Connect with fellow programmers and expand your coding network.</li>
            </ul>
            <p style="font-weight: bold;">To get started, simply verify your account and explore the wide range of problems and contests available.</p>
            <p>If you have any questions, our support team is always here to help.</p>
            <p>Happy Coding!<br><span style="font-weight: bold;">The EasyJudge team</span></p>

            <!-- Social Icons (Improved Layout) -->
            <table class="logo-table" style="margin: 20px auto;">
                <tr>
                    <td style="padding: 0 10px;">
                        <a href="https://facebook.com" target="_blank">
                            <img class="img" src="https://img.icons8.com/?size=100&id=118490&format=png&color=000000" alt="Facebook" border="0">
                        </a>
                    </td>
                    <td style="padding: 0 10px;">
                        <a href="https://twitter.com" target="_blank">
                            <img class="img" src="https://img.icons8.com/?size=100&id=84888&format=png&color=000000" alt="Twitter" border="0">
                        </a>
                    </td>
                </tr>
            </table> 
        </div>
        <div class="footer">
            &copy; 2025 EasyJudge Inc. All rights reserved.
        </div>
    </div>
</body>
</html>
`;

export const validateInfoAndSendOtp = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Check for missing fields
  if (!name || !email || !password || !confirmPassword) {
    return res.json({ success: false, message: "Please fill all the fields" });
  }

  // Validate Email Format
  if (!validateEmail(email)) {
    return res.json({ success: false, message: "Email Not Valid" });
  }

  // Validate Password Format
  if (!validatePassword(password)) {
    return res.json({
      success: false,
      message:
        "Password needs to be greater than 6 characters and alphanumeric",
    });
  }

  // Check if Passwords Match
  if (!isPasswordMatch(password, confirmPassword)) {
    return res.json({ success: false, message: "Passwords Do Not Match" });
  }

  try {
    // Check if Username or Email Already Exists
    const existingName = await userModel.findOne({ name });
    if (existingName) {
      return res.json({ success: false, message: "User Name already exists" });
    }

    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res.json({ success: false, message: "User Email already exists" });
    }

    await pendingUserModel.deleteOne({ email });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    const passwordHash = await bcrypt.hash(password, 10);
    const Pendinguser = new pendingUserModel({
      name,
      email,
      password: passwordHash,
      otp,
      otpExpiry,
    });
    await Pendinguser.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: `EasyJudge Account Verification Otp`,
      text: `Your Otp is ${otp}. It will expire in 5 minutes.`,
    };
    await transporter.sendMail(mailOptions).catch((err) => {
      console.log("Email Error:", err);
      return res.json({ success: false, message: "Failed to send OTP email" });
    });

    return res.json({ success: true });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Internal server error" });
  }
};
export const verifyEmailRegister = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const Pendinguser = await pendingUserModel.findOne({ email });
    if (!Pendinguser) {
      return res.json({
        success: false,
        message: "No OTP request found or expired",
      });
    }
    if (Pendinguser.otpExpiry < new Date()) {
      await Pendinguser.deleteOne({ email });
      return res.json({
        success: false,
        message: "OTP Expired",
      });
    }
    if (Pendinguser.otp !== otp) {
      return res.json({
        success: false,
        message: "Invalid OTP",
      });
    }
    const user = new userModel({
      name: Pendinguser.name,
      email: Pendinguser.email,
      password: Pendinguser.password,
      isAccountVerified: true,
    });
    await user.save();

    await pendingUserModel.deleteOne({ email });

    // Create JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set Token in Cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    //sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: Pendinguser.email,
      subject: `Welcome to EasyJudge`,
      html: createWelcomeEmail(Pendinguser.name),
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const checkVerifyOtpStatus = async (req, res) => {
  const { email } = req.query;
  const pendingUser = await pendingUserModel.findOne({ email });
  if (!pendingUser) {
    return res
      .status(404)
      .json({ valid: false, message: "OTP expired or not found" });
  }
  if (pendingUser.otpExpiry < new Date()) {
    await pendingUserModel.deleteOne({ email });
    return res.status(404).json({ valid: false, message: "OTP expired" });
  }
  return res.json({ valid: true });
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "Please fill all the fields" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Does Not Exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ success: true });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged Out Successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Email Is Required" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save().catch((err) => {
      return res.json({ success: false, message: "Error saving OTP" });
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: `Reset Password Otp`,
      text: `Your Otp for reseting your password is ${otp}. It will expire in 15 minutes.`,
    };

    await transporter.sendMail(mailOptions).catch((err) => {
      console.log("Email Error:", err);
      return res.json({ success: false, message: "Failed to send OTP email" });
    });

    return res.json({ success: true, messsage: "OTP Sent To Your Email" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const CheckOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!otp) {
    return res.json({
      success: false,
      message: "Please Fill out Otp properly",
    });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }
    console.log(user.resetOtp);
    if (
      otp === user.resetOtp &&
      user.resetOtpExpireAt >= Date.now() &&
      otp !== ""
    ) {
      return res.json({
        success: true,
        message: "Otp Verification Successful",
      });
    } else
      return res.json({
        success: false,
        message: "Invalid Otp",
      });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, newPassword, confirmNewPassword } = req.body;
  if (!newPassword || !confirmNewPassword) {
    return res.json({
      success: false,
      message: "Please Fill out Every section",
    });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }
    // Validate Password Format
    if (!validatePassword(newPassword)) {
      return res.json({
        success: false,
        message:
          "Password needs to be greater than 6 characters and alphanumeric",
      });
    }

    // Check if Passwords Match
    if (!isPasswordMatch(newPassword, confirmNewPassword)) {
      return res.json({ success: false, message: "Passwords Do Not Match" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({
      success: true,
      message: "Password Reseted Successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
