import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import Footer from "../components/footer";

const Home = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const { backendUrl, userData, isLoggedin, setIsLoggedin, setUserData } =
    useContext(AppContent);

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
      toast.error(error.message);
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <Navbar />
      <div className="flex items-center min-h-screen relative ">
        <div className="flex items-center justify-center p-4 absolute left-1/2">
          <div className="text-center">
            <h1 className="text-4xl mb-4">
              <span className="text-custom-bg font-semibold">Welcome</span>{" "}
              <span>{isLoggedin ? userData.name : ""}</span>{" "}
              <span className="text-custom-bg font-semibold">to</span>{" "}
              <span className="font-bold text-custom-bg">EasyJudge</span>
            </h1>
            <p className="text-lg mb-2 text-gray-500">
              A platform for coding enthusiasts to challenge and sharpen their
              skills.
            </p>
            {isLoggedin ? (
              <div className="flex flex-col items-center">
                <p className="text-gray-500">Verify your email to proceed...</p>
                <p className="text-gray-500">or</p>
                <button
                  onClick={logout}
                  className="mt-3 p-2 border-2 rounded-xl border-nav-col w-[100px] text-black flex gap-2 hover:bg-nav-col"
                >
                  <LogOut className="w-[14px]" /> Logout
                </button>
              </div>
            ) : (
              <p className="text-gray-500">
                Login/Register to start your journey...
              </p>
            )}
          </div>
        </div>
        <div className="w-3/5 bg-white">
          <img
            src="/cdr.jpg"
            alt="bg-12393029"
            className="w-full h-7/8 object-cover"
          />
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Home;
