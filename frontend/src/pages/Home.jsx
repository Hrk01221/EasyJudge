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
    <div className="flex pt-1">
      {isLoggedin && <Sidebar />}
      <div className="flex-1">
        <Navbar />
        <div
          className={`p-4 border transition-all duration-400 ease-in-out ${
            sidebarShow ? "ml-[260px]" : "ml-0"
          }`}
        >
          {Array.from({ length: 200 }).map((_, i) => (
            <div key={i} className="bg-black text-white p-4 my-2">
              Welcome to EasyJudge #{i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
