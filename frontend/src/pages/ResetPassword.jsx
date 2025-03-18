import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CircleChevronLeft, Loader2, Lock, LogOut, Mail } from "lucide-react";
import { AppContent } from "../context/AppContext";
import Footer from "../components/footer";

const ResetPassword = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const { backendUrl, isLoggedin, userData } = useContext(AppContent);

  const [loading, setLoading] = useState(false);
  const [sentOtp, setSentOtp] = useState(false);
  const [passwordChange, setpasswordChange] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").trim();
    const pasteArray = paste.split("").slice(0, 6);
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
    inputRefs.current[5].focus();
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email }
      );
      if (data.success) {
        setSentOtp(true);
        toast.success("OTP sent successfully!");
      } else {
        toast.error("Invalid Email");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    const otp = otpArray.join("");
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/check-reset-otp`,
        { email, otp }
      );
      if (data.success) {
        setpasswordChange(true);
        toast.info("Otp is verified", {
          position: "top-right",
          autoClose: 1000,
        });
      } else {
        toast.error(data.message, {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error(message.error);
    } finally {
      setLoading(false);
    }
  };

  const handlechangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        {
          email,
          newPassword: password,
          confirmNewPassword: confirmPassword,
        }
      );
      console.log(password);
      if (data.success) {
        toast.success(data.message, {
          position: "top-right",
          autoClose: 1000,
        });
        navigate("/login-register");
      } else {
        toast.error(data.message, {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedin) navigate("/");
  }, [isLoggedin]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-400 flex justify-center items-center">
      <div className="w-3/5 h-[600px] bg-[url('/bg-c2.png')] bg-cover bg-center bg-no-repeat rounded-md flex">
        <div className="w-1/2 p-6 flex flex-col items-center justify-center gap-5">
          <h1 className="text-white text-3xl font-bold mt-10">
            Reset Password
          </h1>
          <p className="text-base text-gray-600 mb-10">
            Follow the below steps to reset your password
          </p>
          <div className="flex w-full h-[300px] ml-20">
            <div className="flex flex-col items-start relative gap-7">
              <div className="absolute top-4 bottom-4 left-4 w-[1.5px] h-[130px] bg-white"></div>
              <div className="flex items-center gap-4">
                <div
                  className={`${
                    !passwordChange && !sentOtp ? "bg-blue-500" : "bg-white"
                  } ${
                    !passwordChange && !sentOtp ? "text-white" : "text-blue-500"
                  } rounded-full w-8 h-8 flex items-center justify-center z-10`}
                >
                  1
                </div>
                <div
                  className={`${
                    !passwordChange && !sentOtp ? "text-white" : "text-gray-200"
                  }`}
                >
                  Enter your Email to receive an OTP
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`${
                    !passwordChange && sentOtp ? "bg-blue-500" : "bg-white"
                  } ${
                    !passwordChange && sentOtp ? "text-white" : "text-blue-500"
                  } rounded-full w-8 h-8 flex items-center justify-center z-10`}
                >
                  2
                </div>
                <div
                  className={`${
                    !passwordChange && sentOtp ? "text-white" : "text-gray-200"
                  }`}
                >
                  Verify your OTP to continue
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`${passwordChange ? "bg-blue-500" : "bg-white"} ${
                    passwordChange ? "text-white" : "text-blue-500"
                  } rounded-full w-8 h-8 flex items-center justify-center z-10`}
                >
                  3
                </div>
                <div
                  className={`${
                    passwordChange ? "text-white" : "text-gray-200"
                  }`}
                >
                  Set your new password
                </div>
              </div>
            </div>
          </div>
          <div onClick={()=>{navigate('/login-register')}} className="text-white flex gap-3 items-center justify-center cursor-pointer hover:text-nav-col" ><CircleChevronLeft/> go back </div>
        </div>
        <div className="w-1/2 flex flex-col pl-10 justify-center">
          {passwordChange ? (
            <div>
              <form
                onSubmit={handlechangePassword}
                className="flex flex-col items-center p-3"
              >
                <h1 className="text-xl font-mono text-center font-bold mt-10 mb-10">
                  Change Your Password
                </h1>
                <div className="relative w-full mb-6">
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="text"
                    placeholder="New Password"
                    required
                    className="w-full p-2 border rounded-md bg-white  text-black ring-1 ring-black focus:outline-none focus:ring-1 focus:border-border-custom2 focus:shadow-lg"
                  />
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-input-placeholder" />
                </div>
                <div className="relative w-full mb-6">
                  <input
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    type="text"
                    placeholder="Confirm New Password"
                    required
                    className="w-full p-2 border rounded-md bg-white  text-black ring-1 ring-black focus:outline-none focus:ring-1 focus:border-border-custom2 focus:shadow-lg"
                  />
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-input-placeholder" />
                </div>
                <button
                  type="submit"
                  className={`w-1/3 py-3 text-white rounded-md bg-blue-500 hover:bg-blue-700 ${
                    loading && "bg-gray-500 cursor-not-allowed"
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center pl-2 gap-2">
                      <Loader2 className="animate-spin size-5" />
                      wait...
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button>
              </form>
            </div>
          ) : !sentOtp ? (
            <div>
              <form
                onSubmit={handleEmailSubmit}
                className="flex flex-col items-center p-3"
              >
                <h1 className="text-xl font-mono text-center font-bold mt-10 mb-10">
                  Enter Email
                </h1>
                <div className="relative w-full mb-10">
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded-md bg-white  text-black ring-1 ring-black focus:outline-none focus:ring-1 focus:border-border-custom2 focus:shadow-lg"
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-input-placeholder" />
                </div>
                <button
                  type="submit"
                  className={`w-1/3 py-3 text-white  rounded-md bg-blue-500 hover:bg-blue-700 ${
                    loading && "bg-gray-500 cursor-not-allowed"
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center pl-2 gap-2">
                      <Loader2 className="animate-spin size-5" />
                      wait...
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div>
              <form
                onSubmit={handleOtpSubmit}
                className="flex flex-col items-center p-3"
              >
                <h1 className="text-black text-xl font-bold text-center mb-4">
                  Verify OTP
                </h1>
                <p className="text-center text-gray-700 mb-6">
                  Enter the 6-digit OTP sent to your email
                </p>
                <div
                  className="flex gap-2 justify-center mb-7"
                  onPaste={handlePaste}
                >
                  {Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        className="w-12 h-12 text-center text-xl ring-1 ring-black text-black rounded-md focus:outline-none"
                        maxLength="1"
                        type="text"
                        onInput={(e) => handleInput(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                      />
                    ))}
                </div>
                <button
                  type="submit"
                  className={`w-1/3 py-3 text-white rounded-md bg-blue-500 hover:bg-blue-700 ${
                    loading && "bg-gray-500 cursor-not-allowed"
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center pl-2 gap-2">
                      <Loader2 className="animate-spin size-5" />
                      wait...
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ResetPassword;
