import React, { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { CirclePlus, Laptop } from "lucide-react";
const Contest = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const { isLoggedin, sidebarShow, setPage, page } = useContext(AppContent);
  const [loading, setLoading] = useState(false);
  const [pageVar, setPageVar] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (page != "Contest") {
      setPage("Contest");
    }
  }, [location]);

  if (loading) return <Loading />;
  return (
    <div className="flex">
      {isLoggedin && <Sidebar />}
      <div className="flex-1">
        <Navbar />
        <div
          className={`flex flex-col gap-3 p-5 transition-all duration-300 ease-in-out h-screen ${
            sidebarShow ? "ml-[260px]" : "ml-0"
          }`}
        >
          <div className="h-12 w-full border border-gray-300 rounded-md flex flex-row items-center pl-5 pr-5 gap-16">
            <span
              onClick={() => setPageVar(true)}
              className={`${
                pageVar
                  ? "border-b border-neutral-600 text-gray-500"
                  : "text-black"
              } cursor-pointer transition-all duration-300 ease-in-out`}
            >
              Present Contests
            </span>
            <span
              onClick={() => setPageVar(false)}
              className={`${
                !pageVar
                  ? "border-b border-neutral-600 text-gray-500"
                  : "text-black"
              } cursor-pointer transition-all duration-300 ease-in-out`}
            >
              Previous Contests
            </span>
            <div className="flex flex-row gap-7 items-center ml-auto text-gray-700">
              <div className="flex flex-row items-center gap-2 cursor-pointer hover:text-gray-800">
                <CirclePlus className="size-5" />
                <span>Create a contest</span>
              </div>
              <div className="flex flex-row items-center gap-2 cursor-pointer hover:text-gray-800">
                <Laptop className="size-5" />
                <span>Virtual Contest</span>
              </div>
            </div>
          </div>
          <div className="h-full w-full flex flex-row gap-10">
            <div className="flex flex-col gap-3 h-full w-1/4">
              <div className="h-1/5 w-full border border-gray-300 rounded-md rounded-b-none flex flex-col">
                <div className="w-full h-1/3 border-b border-gray-300 rounded-t-lg flex items-center justify-center">
                  <span className="text-lg font-semibold">
                     Upcoming Contest 
                  </span>
                </div>
              </div>
              <div className="h-full w-full border border-gray-300 rounded-md"></div>
            </div>
            {pageVar ? (
              <div className="h-full w-full flex flex-col gap-6">
                <div className="h-2/5 w-full border border-gray-300 rounded-md"></div>
                <div className="h-full w-full border border-gray-300 rounded-md"></div>
              </div>
            ) : (
              <div className="h-full w-full flex flex-col gap-6">
                <div className="h-full w-full border border-gray-300 rounded-md"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contest;
