import React, { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Home = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const { isLoggedin, sidebarShow, setPage, page } = useContext(AppContent);
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (page != "Home") {
      setPage("Home");
    }
  }, [location]);

  if (loading) return <Loading />;

  return (
    <div className="flex">
      {isLoggedin && <Sidebar />}
      <div className="flex-1">
        <Navbar />
        {isLoggedin ? (
          <div
            className={`p-4 transition-all duration-300 ease-in-out max-h-screen ${
              sidebarShow ? "ml-[260px]" : "ml-0"
            }`}
          ></div>
        ) : (
          <div className="flex flex-row items-center w-full h-[80vh]">
            <div className="w-1/2 h-full gap-3 bg-transparent flex flex-col items-center justify-center">
              <span className="text-5xl">
                Welcome To{" "}
                <span className="text-[#90ddaa] font-tektur ">Easy</span>
                <span className="text-[#b180f0] font-tektur ">Judge</span>
              </span>
              <span className="text-gray-500 text-base">
                "Code, Compete, Conquer with EasyJudge."
              </span>
              <button
                onClick={() => {
                  navigate("/"); //change due
                  setPage("Contest");
                }}
                className="mt-7 border-2 pl-7 pr-7 pt-2 pb-2 cursor-pointer rounded-2xl transform transition-transform duration-200 hover:scale-110 border-gray-300 hover:bg-gray-300 hover:text-slate-800"
              >
                Compete
              </button>
            </div>
            <div className="w-1/2 h-full flex items-center justify-center ">
              <img
                src="welcome2.gif"
                alt="Welcome gif"
                className="w-full h-3/5 object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
