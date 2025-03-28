import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2, Lock, LogOut, Mail } from "lucide-react";
import { AppContent } from "../context/AppContext";

const ResetPassword = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const { backendUrl, isLoggedin } = useContext(AppContent);

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
        toast.success("OTP sent successfully!",{autoClose:1000});
      } else {
        toast.error(data.message,{autoClose:1000});
      }
    } catch (error) {
      toast.error(error.message,{autoClose:1000});
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
      toast.error(message.error,{autoClose:1000});
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
      toast.error(error.message,{autoClose:1000});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedin) navigate("/");
  }, [isLoggedin]);

  return (
    <div className="h-screen w-100vw flex items-center justify-center bg-slate-50">
      <div className="absolute top-5 left-5 flex items-center gap-1">
        <img src="/logo.png" alt="logo" className="size-11 shrink-0 mr-2" />
        <div className="text-2xl font-bold">
          <span className="text-[#90ddaa] font-tektur ">Easy</span>
          <span className="text-[#b180f0] font-tektur ">Judge</span>
        </div>
      </div>
      <div className="w-1/2 h-full bg-transparent flex flex-col items-center mt-[calc(20vh)]">
        <h1 className="text-black text-3xl font-bold mt-10">
          Account Recovery
        </h1>
        <p className="text-base text-gray-600 mb-10">
          Follow the below steps to reset your password
        </p>
        <div className="flex flex-col items-start relative gap-20 ">
          <div className="absolute top-4 bottom-4 left-5 w-[1.5px] h-[260px] bg-slate-600"></div>
          <div className="flex items-center gap-4">
            <div
              className={`${
                !passwordChange && !sentOtp
                  ? "bg-black"
                  : "bg-white border border-slate-700"
              } ${
                !passwordChange && !sentOtp ? "text-white" : "text-black"
              } rounded-full w-11 h-11 flex items-center justify-center z-10`}
            >
              1
            </div>
            <div
              className={`${
                !passwordChange && !sentOtp
                  ? "text-slate-700 font-semibold"
                  : "text-slate-400"
              }`}
            >
              Enter your Email to receive an OTP
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`${
                !passwordChange && sentOtp
                  ? "bg-black"
                  : "bg-white border border-slate-700"
              } ${
                !passwordChange && sentOtp ? "text-white" : "text-black"
              } rounded-full w-11 h-11 flex items-center justify-center z-10`}
            >
              2
            </div>
            <div
              className={`${
                !passwordChange && sentOtp
                  ? "text-slate-700 font-semibold"
                  : "text-slate-400"
              }`}
            >
              Verify your OTP to continue
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`${
                passwordChange ? "bg-black" : "bg-white border border-slate-700"
              } ${
                passwordChange ? "text-white" : "text-black"
              } rounded-full w-11 h-11 flex items-center justify-center z-10`}
            >
              3
            </div>
            <div
              className={`${
                passwordChange
                  ? "text-slate-700 font-semibold"
                  : "text-slate-400"
              }`}
            >
              Set your new password
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-full flex justify-center items-center">
        <div className="w-[40vw] h-[80vh] flex flex-col justify-evenly border border-black border-opacity-50 rounded-3xl bg-slate-50">
          <div className="h-1/4 w-full flex justify-center items-center">
            <h1 className="font-semibold text-3xl">Reset Password</h1>
          </div>
          <div className="h-full w-full flex flex-col justify-center items-center">
            {passwordChange ? (
              <form
                onSubmit={handlechangePassword}
                className="flex flex-col items-center p-3 gap-5"
              >
                <div className="mb-4 w-[30vw]">
                  <div className="relative w-full">
                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      className="w-full py-2 px-5 border border-slate-400 rounded-3xl bg-white placeholder:text-slate-300 placeholder:text-base text-black focus:outline-none focus:border-slate-700"
                      type="text"
                      placeholder="Enter New Password"
                    />
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-input-placeholder size-5" />
                  </div>
                </div>
                <div className="mb-4 w-[30vw]">
                  <div className="relative w-full">
                    <input
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      value={confirmPassword}
                      className="w-full py-2 px-5 border border-slate-400 rounded-3xl bg-white placeholder:text-slate-300 placeholder:text-base text-black focus:outline-none focus:border-slate-600"
                      type="text"
                      placeholder="Confirm New Password"
                    />
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-input-placeholder size-5" />
                  </div>
                </div>
                <button
                  className={`w-[300px] mt-4 p-2 bg-black border text-white rounded-3xl hover:bg-white hover:text-black hover:border hover:border-black flex items-center justify-center gap-2 transition-all duration-300 ${
                    loading ? "opacity-90 cursor-not-allowed" : ""
                  }`}
                  type="submit"
                  disabled={loading}
                >
                  {loading && <Loader2 className="animate-spin size-5" />}
                  {loading ? "Loading..." : "Submit"}
                </button>
              </form>
            ) : !sentOtp ? (
              <form
                onSubmit={handleEmailSubmit}
                className="flex flex-col items-center p-3 gap-10"
              >
                <div className="mb-4 w-[30vw]">
                  <div className="relative w-full">
                    <input
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      className="w-full py-2 px-5 border border-slate-400 rounded-3xl bg-slate-50 placeholder:text-slate-300 placeholder:text-base text-black focus:outline-none focus:border-slate-700"
                      type="email"
                      placeholder="Enter Your Email"
                    />
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-input-placeholder size-5" />
                  </div>
                </div>
                <button
                  className={`w-[300px] mt-4 p-2 bg-black border text-white rounded-3xl hover:bg-white hover:text-black hover:border hover:border-black flex items-center justify-center gap-2 transition-all duration-300 ${
                    loading ? "opacity-90 cursor-not-allowed" : ""
                  }`}
                  type="submit"
                  disabled={loading}
                >
                  {loading && <Loader2 className="animate-spin size-5" />}
                  {loading ? "Loading..." : "Submit"}
                </button>
              </form>
            ) : (
              <form
                onSubmit={handleOtpSubmit}
                className="flex flex-col items-center p-3"
              >
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
                        className="w-12 h-12 text-center text-xl border border-slate-400 text-black rounded-md focus:outline-none focus:border-slate-700"
                        maxLength="1"
                        type="text"
                        onInput={(e) => handleInput(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                      />
                    ))}
                </div>
                <button
                  className={`w-[300px] mt-4 p-2 bg-black border text-white rounded-3xl hover:bg-white hover:text-black hover:border hover:border-black flex items-center justify-center gap-2 transition-all duration-300 ${
                    loading ? "opacity-90 cursor-not-allowed" : ""
                  }`}
                  type="submit"
                  disabled={loading}
                >
                  {loading && <Loader2 className="animate-spin size-5" />}
                  {loading ? "Loading..." : "Submit"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResetPassword;
