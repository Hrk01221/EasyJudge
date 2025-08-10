import React, { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Contest = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const { isLoggedin, sidebarShow, setPage, page } = useContext(AppContent);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (page != "Contest") {
      setPage("Contest");
    }
  }, [location]);

  if (loading) return <Loading />;
  return (
    <div className="flex pt-1">
      {isLoggedin && <Sidebar />}
      <div className="flex-1">
        <Navbar />
        <div
          className={`p-4 transition-all duration-300 ease-in-out max-h-screen ${
            sidebarShow ? "ml-[260px]" : "ml-0"
          }`}
        >
          <div>Constest 1</div>
          <div>Constest 2</div>
          <div>Constest 3</div>
          <div>Constest 4</div>
          <div>Constest 5</div>
        </div>
      </div>
    </div>
  );
};

export default Contest;
