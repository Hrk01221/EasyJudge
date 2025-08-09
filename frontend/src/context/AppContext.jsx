import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(undefined);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("Home");
  const [sidebarShow, setSideBarShow] = useState(false);

  const getAuthState = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const { data } = await axios.get(backendUrl + "/api/auth/is-auth", {
        withCredentials: true,
        signal: controller.signal,
      });
      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
      } else {
        setIsLoggedin(false);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Network timeout or error.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1000,
      });
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data", {
        withCredentials: true,
      });
      if (data.success) {
        setUserData(data.userData);
        setIsLoggedin(true);
      } else {
        setIsLoggedin(false);
        toast.error(data.message, {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      setIsLoggedin(false);
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    loading,
    page,
    setPage,
    sidebarShow,
    setSideBarShow,
  };

  return (
    <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
  );
};
