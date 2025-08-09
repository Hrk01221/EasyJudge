import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Home = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const {
    backendUrl,
    userData,
    isLoggedin,
    setIsLoggedin,
    setUserData,
    sidebarShow,
  } = useContext(AppContent);

  const [loading, setLoading] = useState(false);

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
      toast.error(error.message, {
        position: "top-right",
        autoClose: 1000,
      });
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="h-screen w-screen flex overflow-hidden pt-1">
      <Sidebar />
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <Navbar/>
        <div
          className={` h-[1000vh] w-[100vw] custom-trans-x-navbar ${
            sidebarShow
              ? "translate-x-[260px] max-w-[calc(100vw-266px)]"
              : "translate-x-0 max-w-[calc(99vw-0px)] ml-2 transition-transform duration-400 ease-in-out"
          } border`}
        ></div>
      </div>
    </div>
  );
};

export default Home;
