import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";
import { Loader2 } from "lucide-react";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const inputRefs = React.useRef([]);
  const { backendUrl, userData, isLoggedin, getUserData, loading } =
    useContext(AppContent);
  const [Loading, setLoading] = useState(false);

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
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
    inputRefs.current[5].focus();
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join("");
      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-account",
        { otp }
      );
      if (data.success) {
        toast.success("Verified Successfully!", {
          position: "top-right",
          autoClose: 1000,
        });
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message, {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!isLoggedin || userData.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedin, userData, getUserData]);

  return (
    <div className="h-screen w-100vw flex items-center justify-center bg-slate-50">
      <div className="absolute top-5 left-5 flex items-center gap-1">
        <img src="/logo.png" alt="logo" className="size-11 shrink-0 mr-2" />
        <div className="text-2xl font-bold">
          <span className="text-[#90ddaa] font-tektur ">Easy</span>
          <span className="text-[#b180f0] font-tektur ">Judge</span>
        </div>
      </div>
      <div className="w-1/2 h-full flex justify-center items-center">
        <div className="w-[40vw] h-[70vh] flex flex-col justify-evenly border border-slate-600 rounded-3xl bg-slate-50">
          <div className="h-1/4 w-full flex justify-center items-center">
            <h1 className="font-semibold text-3xl">Verify Email</h1>
          </div>
          <div className="h-full w-full flex flex-col justify-center items-center">
            <form
              onSubmit={onSubmitHandler}
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
                  Loading ? "opacity-90 cursor-not-allowed" : ""
                }`}
                type="submit"
                disabled={Loading}
              >
                {Loading && <Loader2 className="animate-spin size-5" />}
                {Loading ? "Verifying..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
