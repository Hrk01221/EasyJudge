import React, { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashBoard = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const { isLoggedin, sidebarShow, setPage, page, userData, goToPage } =
    useContext(AppContent);
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedin && userData?.isAdmin) {
      console.log("Admin user:", userData);
    } else if (isLoggedin && userData && userData.isAdmin === false) {
      goToPage("Home");
    } else goToPage("Home");
    
    if (page != "Dashboard") {
      setPage("Dashboard");
    }
  }, [isLoggedin, userData]);
  
  if (loading) return <Loading />;

  return (
    <div className="flex">
      {isLoggedin && <Sidebar />}
      <div className="flex-1">
        <Navbar />
        <div
          className={`p-4 transition-all duration-300 ease-in-out max-h-screen ${
            sidebarShow ? "ml-[260px]" : "ml-0"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default DashBoard;
