import React, { useContext, useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContent } from "./context/AppContext";
import Loading from "./components/Loading";
import LoginRegister from "./pages/LoginRegister";
import Home from "./pages/Home";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import DashBoard from "./pages/DashBoard";
import Contest from "./pages/Contest";
import Problems from "./pages/Problems";
import Learn from "./pages/Learn";
import Blogs from "./pages/Blogs";
import Compiler from "./pages/Compiler";
import Snippets from "./pages/Snippets";
import TestCaseGenerator from "./pages/TestCaseGenerator";
import Settings from "./pages/Settings";
import HelpCenter from "./pages/HelpCenter";
import Faq from "./pages/Faq";

const App = () => {
  const { isLoggedin, loading, userData } = useContext(AppContent);
  // const [isloading, setIsLoading] = useState(true);
  // const location = useLocation();
  // useEffect(() => {
  //   setIsLoading(true);
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, [location.pathname]);

  return (
    <div>
      {/* {(loading || isloading) && <Loading />} */}
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login-register" element={<LoginRegister />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/contest" element={<Contest />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/compiler" element={<Compiler />} />
        <Route path="/snippets" element={<Snippets />} />
        <Route path="/text-case-generator" element={<TestCaseGenerator />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/faq" element={<Faq />} />
      </Routes>
    </div>
  );
};

export default App;
