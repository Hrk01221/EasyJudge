import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";
import { CircleChevronLeft, Loader2 } from "lucide-react";
import Footer from "../components/footer";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const inputRefs = React.useRef([]);
  const { backendUrl, isLoggedin, userData, getUserData } =
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
        });
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedin || userData.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedin, userData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-400 flex justify-center items-center">
      <div className="w-3/5 h-[600px] bg-[url('/bg-c2.png')] bg-cover bg-center bg-no-repeat rounded-md flex">
        <div className="w-1/2 p-6 flex flex-col items-center justify-center gap-5">
          <h1 className="text-white text-3xl font-bold mt-10">
            Verify Email
          </h1>
          <p className="text-base text-gray-600 mb-10">
            Verify Your Email to get started.....
          </p>
          <div 
            onClick={() => {
              navigate("/");
            }}
            className="text-white flex gap-3 items-center cursor-pointer hover:text-nav-col"
          >
            <CircleChevronLeft /> go back{" "}
          </div>
        </div>
        <div className="w-1/2 flex flex-col pl-10 justify-center items-center">
          <form
            onSubmit={onSubmitHandler}
            className="flex flex-col items-center p-3 justify-center gap-7"
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
              className={`w-1/3 py-3 text-white rounded-md bg-blue-500 hover:bg-blue-700 ${
                    Loading && "bg-gray-500 cursor-not-allowed"}`}
              disabled={Loading}
            >
              <div className="flex justify-center gap-2">
                {Loading && <Loader2 className="animate-spin size-5" />}
                {Loading ? "Verifying..." : "Verify"}
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
    // <div className="flex flex-col min-h-screen bg-custom-bg">
    //   <div className="flex flex-col min-h-screen justify-center items-center flex-grow mb-16">
    //     <div
    //       onClick={() => navigate("/")}
    //       className="absolute left-6 top-6 flex items-center gap-3 text-white font-bold text-2xl cursor-pointer"
    //     >
    //       <img src="/logo.png" className="w-8" alt="EasyJudge Logo" />
    //       <span className="text-nav-col">
    //         Easy<span className="text-white">Judge</span>
    //       </span>
    //     </div>
    //     <form
    //       className="rounded-lg shadow-lg w-1/3 h-[340px] text-sm bg-gray-500
    //       flex
    //       flex-col
    //       justify-center
    //       items-center
    //       border
    //       bg-clip-padding
    //       backdrop-filter
    //       backdrop-blur
    //       bg-opacity-10
    //       backdrop-saturate-100
    //       backdrop-contrast-100"
    //       onSubmit={onSubmitHandler}
    //     >
    //       <h1 className="text-white text-2xl font-semibold text-center mb-4">
    //         Email Verify
    //       </h1>
    //       <p className="text-center mb-6 text-indigo-300">
    //         Enter the six-digit code sent to your email
    //       </p>
    //       <div
    //         className="flex justify-between mb-8 gap-3"
    //         onPaste={handlePaste}
    //       >
    //         {Array(6)
    //           .fill(0)
    //           .map((_, index) => (
    //             <input
    //               className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md focus:outline-none"
    //               type="text"
    //               maxLength="1"
    //               key={index}
    //               ref={(e) => (inputRefs.current[index] = e)}
    //               onInput={(e) => handleInput(e, index)}
    //               onKeyDown={(e) => handleKeyDown(e, index)}
    //             />
    //           ))}
    //       </div>
    //       <button
    //         className={`w-1/3 py-3 text-white rounded-full border border-transparent ${
    //           Loading ? "bg-gray-500 cursor-not-allowed" : "bg-border-custom2"
    //         } hover:bg-transparent hover:border-white transition-all duration-300`}
    //         disabled={Loading}
    //       >
    //         <div className="flex justify-center gap-2">
    //           {Loading && <Loader2 className="animate-spin size-5" />}
    //           {Loading ? "Verifying..." : "Verify"}
    //         </div>
    //       </button>
    //     </form>
    //   </div>
    // </div>
  );
};

export default EmailVerify;
