import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import {
  ArrowRightFromLine,
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  MoonStar,
  Search,
  User,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "./Loading";

const Navbar = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const {
    sidebarShow,
    setSideBarShow,
    backendUrl,
    userData,
    isLoggedin,
    setIsLoggedin,
    setUserData,
  } = useContext(AppContent);
  const [veLoading, setveLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    setveLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );
      if (data.success) {
        toast.success("Verification Otp Sent Successfully", {
          position: "top-right",
          autoClose: 1000,
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

  const logout = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/logout");

      if (data.success) {
        setIsLoggedin(false);
        setUserData(false);
        toast.success("Logged Out Successfully!", {
          position: "top-right",
          autoClose: 1000,
        });

        setTimeout(() => {
          navigate("/");
          setLoading(false);
        }, 1500);
      } else {
        setLoading(false);
        toast.error(data.error, {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };
  if(loading)return <Loading/>

  return (
    <div
      className={`h-[10vh] w-full custom-trans-x-navbar ${
        sidebarShow
          ? "translate-x-[260px] max-w-[calc(99vw-250px)]"
          : "translate-x-0 max-w-[calc(99vw-0px)] ml-2"
      } border rounded-xl rounded-br-none rounded-bl-none flex items-center p-2 transition-transform duration-400 ease-in-out`}
    >
      <div className="hidden sm:w-1/2 sm:flex gap-10 items-center">
        {!sidebarShow && (
          <Menu
            className="cursor-pointer opacity-70 ml-5"
            onClick={() => setSideBarShow(true)}
          />
        )}
        <MoonStar className="cursor-pointer opacity-70 ml-2" />
        <form className="w-[300px] relative">
          <div className="relative">
            <input
              type="search"
              placeholder="search..."
              className="w-full p-4 rounded-full border border-[#808080] size-10 focus:outline-none focus:border-gray-800"
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 p-4">
              <Search className="size-5 text-[#808080]" />
            </button>
          </div>
        </form>
      </div>
      <div className="w-full sm:w-1/2 flex h-full justify-end mr-2 items-center gap-5">
        {isLoggedin && (
          <div className="rounded-full border border-[#808080] size-9 items-center flex justify-center cursor-pointer hover:bg-gray-100">
            <Bell className="size-4" />
            {/* todo : notify */}
          </div>
        )}
        {isLoggedin && (
          <div onClick={()=>logout()} className="rounded-full border border-[#808080] size-9 items-center flex justify-center cursor-pointer hover:bg-gray-100">
            <LogOut className="size-4" />
          </div>
        )}

        {isLoggedin && <div className="border-r-2 h-4/5"></div>}

        {isLoggedin && (
          <div className="flex items-center gap-3 px-4 py-2 w-fit">
            <img
              src="ppic.jpeg"
              alt=""
              className="w-10 h-10 flex items-center justify-center border-2 rounded-full"
            />
            <span className="text-base font-sans">{userData.name}</span>
            <ChevronDown className="w-5 h-5 text-[#808080]" />
          </div>
        )}
        {!isLoggedin && (
          <div
            onClick={() => navigate("/login-register")}
            className="flex items-center gap-2 mr-6 border border-[#808080] hover:bg-gray-100 px-8 py-2 rounded-2xl text-sm cursor-pointer transition transform duration-400 ease-in-out"
          >
            <p>Sign In </p>
            <ArrowRightFromLine className="size-4" />
          </div>
        )}
      </div>
    </div>
  );
};

{
  /* <button class="btn relative inline-flex items-center justify-start overflow-hidden font-medium transition-all bg-indigo-100 rounded hover:bg-white group py-1.5 px-2.5">
        <span class="w-56 h-48 rounded bg-indigo-600 absolute bottom-0 left-0 translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
        <span class="relative w-full text-left text-indigo-600 transition-colors duration-300 ease-in-out group-hover:text-white">
          Button Hover
        </span>
      </button> */
}
// <div className="flex justify-between items-center translate-x-[250px]">
//   <div
//     onClick={() => navigate("/")}
//     className="m-6 flex items-center gap-3 text-white font-bold text-2xl cursor-pointer"
//   >
//     <img src="/logo.png" className="w-8" alt="EasyJudge Logo" />
//     <span className="text-nav-col">
//       Easy<span className="text-black">Judge</span>
//     </span>
//   </div>
//   <div className="flex justify-center items-center gap-28">
//     {(!isLoggedin || !userData.isAccountVerified) && (
//       <div className="flex gap-1 text-black font-bold cursor-pointer hover:text-nav-col hover:underline">
//         <BookOpen />
//         About
//       </div>
//     )}
//     {(!isLoggedin || !userData.isAccountVerified) && (
//       <div className="flex gap-1 text-black font-bold cursor-pointer hover:text-nav-col hover:underline">
//         {" "}
//         <Headset /> Contact-Us{" "}
//       </div>
//     )}
//     {(!isLoggedin || !userData.isAccountVerified) && (
//       <div
//         disabled={veLoading}
//         onClick={() => {
//           if (!veLoading) {
//             isLoggedin ? sendOtp() : navigate("/login-register");
//           }
//         }}
//         type="button"
//         className="flex gap-1 text-black font-bold cursor-pointer hover:text-nav-col hover:underline m-5 mr-12"
//       >
//         {isLoggedin ? (
//           veLoading ? (
//             <Loader2 className="animate-spin text-nav-col" />
//           ) : (
//             <TriangleAlertIcon className="text-red-600" />
//           )
//         ) : (
//           <LogInIcon />
//         )}
//         {!isLoggedin ? "Login/Register" : "Verify-Email"}
//       </div>
//     )}
//   </div>
// </div>
export default Navbar;
