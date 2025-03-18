import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import {
  BookOpen,
  Headset,
  Loader2,
  LogInIcon,
  TriangleAlertIcon,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedin, userData, backendUrl } = useContext(AppContent);
  const [veLoading, setveLoading] = useState(false);

  const sendOtp = async () => {
    setveLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );
      if (data.success) {
        toast.success("Verification Otp Sent Successfully", {
          position: "top-right",
          autoClose: 1000
        });
        setveLoading(false);
        navigate("/email-verify");
      } else {
        toast.error(data.error);
        setveLoading(false);
      }
    } catch (error) {
      toast.error(error.catch);
      setveLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div
        onClick={() => navigate("/")}
        className="m-6 flex items-center gap-3 text-white font-bold text-2xl cursor-pointer"
      >
        <img src="/logo.png" className="w-8" alt="EasyJudge Logo" />
        <span className="text-nav-col">
          Easy<span className="text-black">Judge</span>
        </span>
      </div>
      <div className="flex justify-center items-center gap-28">
        {(!isLoggedin || !userData.isAccountVerified) && (
          <div className="flex gap-1 text-black font-bold cursor-pointer hover:text-nav-col hover:underline">
            <BookOpen />
            About
          </div>
        )}
        {(!isLoggedin || !userData.isAccountVerified) && (
          <div className="flex gap-1 text-black font-bold cursor-pointer hover:text-nav-col hover:underline">
            {" "}
            <Headset /> Contact-Us{" "}
          </div>
        )}
        {(!isLoggedin || !userData.isAccountVerified) && (
          <div
            disabled={veLoading}
            onClick={() => {
              if (!veLoading) {
                isLoggedin ? sendOtp() : navigate("/login-register");
              }
            }}
            type="button"
            className="flex gap-1 text-black font-bold cursor-pointer hover:text-nav-col hover:underline m-5 mr-12"
          >
            {isLoggedin ? (
              veLoading ? (
                <Loader2 className="animate-spin text-nav-col" />
              ) : (
                <TriangleAlertIcon className="text-red-600" />
              )
            ) : (
              <LogInIcon />
            )}
            {!isLoggedin ? "Login/Register" : "Verify-Email"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
