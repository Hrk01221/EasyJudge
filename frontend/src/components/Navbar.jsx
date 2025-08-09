import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import {
  Bell,
  ChevronDown,
  ChevronUp,
  LogOut,
  Menu,
  MoonStar,
  Pen,
  Search,
  User,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import DropdownPortal from "./DropdownPortal";

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
    page,
    setPage,
  } = useContext(AppContent);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

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
        navigate("/");
        setLoading(false);
        setSideBarShow(false);
      } else {
        setLoading(false);
        toast.error(data.error, {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 1000,
      });
      setLoading(false);
    }
  };
  return (
    <div
      className={`h-[10vh] w-full sticky top-0 z-40 bg-white shadow-md custom-trans-x-navbar ${
        sidebarShow
          ? "translate-x-[260px] max-w-[calc(99vw-250px)]"
          : "translate-x-0 max-w-[calc(99vw-0px)] ml-2"
      } border rounded-xl rounded-br-none rounded-bl-none flex items-center p-2 transition-transform duration-400 ease-in-out`}
    >
      <div className="sm:w-3/4 sm:flex gap-10 items-center">
        {!sidebarShow && isLoggedin && (
          <Menu
            className="cursor-pointer opacity-70 ml-5"
            onClick={() => setSideBarShow(true)}
          />
        )}
        {!sidebarShow && (
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-1 cursor-pointer ml-2"
          >
            <img src="/logo.png" alt="logo" className="size-9 shrink-0 mr-2" />
            <div className="text-2xl font-bold">
              <span className="text-[#90ddaa] font-tektur ">Easy</span>
              <span className="text-[#b180f0] font-tektur ">Judge</span>
            </div>
          </div>
        )}
        {!sidebarShow && (
          <div className="ml-20 flex flex-row gap-16 items-center">
            <div
              onClick={() => {
                navigate("/");
                setPage("Home");
              }}
              className={`w-full text-center text-base cursor-pointer transform transition-transform duration-200 hover:scale-110 ${
                page === "Home"
                  ? "pl-4 pr-4 pt-1 pb-1 border-[1px] border-slate-300 rounded-xl hover:bg-slate-200"
                  : ""
              }`}
            >
              Home
            </div>

            <div
              onClick={() => {
                navigate("/"); //change due
                setPage("Contest");
              }}
              className={`w-full text-center text-base cursor-pointer transform transition-transform duration-200 hover:scale-110 ${
                page === "Contest"
                  ? "pl-4 pr-4 pt-1 pb-1 border-[1px] border-slate-300 rounded-xl hover:bg-slate-200"
                  : ""
              }`}
            >
              Contest
            </div>
            <div
              onClick={() => {
                navigate("/"); //change due
                setPage("Compiler");
              }}
              className={`w-full text-center text-base cursor-pointer transform transition-transform duration-200 hover:scale-110 ${
                page === "Compiler"
                  ? "pl-4 pr-4 pt-1 pb-1 border-[1px] border-slate-300 rounded-xl hover:bg-slate-200"
                  : ""
              }`}
            >
              Compiler
            </div>
          </div>
        )}
      </div>

      <div className="w-full sm:w-1/2 flex h-full justify-end mr-2 items-center gap-5">
        {isLoggedin && !sidebarShow && (
          <form className="w-[300px] relative">
            <input
              type="search"
              placeholder="search..."
              className="w-full p-4 rounded-full border border-[#808080] size-10 focus:outline-none focus:border-gray-800"
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 p-4">
              <Search className="size-5 text-[#808080]" />
            </button>
          </form>
        )}
        <div className="rounded-lg border border-[#808080] size-9 items-center flex justify-center cursor-pointer hover:bg-gray-100">
          <MoonStar className="cursor-pointer size-4 opacity-80" />
        </div>
        {isLoggedin && (
          <div className="rounded-lg border border-[#808080] size-9 items-center flex justify-center cursor-pointer hover:bg-gray-100">
            <Bell className="cursor-pointer size-4 opacity-80" />
          </div>
        )}

        {isLoggedin && <div className="border-r-2 h-4/5" />}

        {isLoggedin && (
          <div
            className="relative flex justify-center items-center gap-4"
            ref={dropdownRef}
          >
            <img src="ppic.png" alt="" className="w-10 h-10 rounded-full" />
            <span className="text-base font-sans">{userData.name}</span>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-3 px-4 py-2 w-fit"
            >
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-[#808080]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#808080]" />
              )}
            </button>

            {isOpen && (
              <DropdownPortal>
                <div
                  className="absolute z-50 bg-white border rounded-lg shadow-lg py-2 w-48"
                  style={{
                    top: `12vh`,
                    left:
                      dropdownRef.current?.getBoundingClientRect().right - 180,
                    position: "absolute",
                  }}
                >
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" /> Profile
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                    <Pen className="w-4 h-4" /> Edit Profile
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </DropdownPortal>
            )}
          </div>
        )}

        {!isLoggedin && (
          <div
            onClick={() => navigate("/login-register")}
            className="flex items-center gap-2 mr-6 border border-slate-400 hover:bg-slate-100 hover:border-slate-300 px-8 py-2 rounded-2xl text-sm cursor-pointer transition transform duration-400 ease-in-out"
          >
            <p>Sign In</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
