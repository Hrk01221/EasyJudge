import {
  CircleArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  User2,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const LoginRegister = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData, isLoggedin } =
    useContext(AppContent);

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(async () => {
      try {
        axios.defaults.withCredentials = true;
        if (!isLogin) {
          const { data } = await axios.post(backendUrl + "/api/auth/register", {
            name,
            email,
            password,
            confirmPassword,
          });
          if (data.success) {
            setIsLoggedin(true);
            await getUserData();
            toast.success("Registered Successfully!", {
              position: "top-right",
              autoClose: 1000,
            });
            toast.info("Please Verify Your Email!", {
              position: "top-right",
              autoClose: 1000,
            });
            navigate("/");
          } else {
            toast.error(data.message, {
              position: "top-right",
              autoClose: 1000,
            });
          }
        } else {
          const { data } = await axios.post(backendUrl + "/api/auth/login", {
            email,
            password,
          });
          if (data.success) {
            setIsLoggedin(true);
            await getUserData();
            toast.success("Logged In Successfully!", {
              position: "top-right",
              autoClose: 1000,
            });
            navigate("/");
          } else {
            toast.error(data.message, {
              position: "top-right",
              autoClose: 1000,
            });
          }
        }
      } catch (error) {
        toast.error(error.message,{
          position: "top-right",
          autoClose: 1000,
        });
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  const refresh = (isLogin) => {
    setIsLogin(!isLogin);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
  };

  useEffect(() => {
    if (isLoggedin) {
      navigate("/");
    }
  }, [isLoggedin]);

  return (
    <div className="h-screen flex">
      <div className=" w-1/2 h-full flex flex-col">
        <div className="w-full h-24 ml-4 mt-4 mb-2">
          <div className="flex items-center gap-1">
            <img src="/logo.png" alt="logo" className="size-11 shrink-0 mr-2" />
            <div className="text-2xl font-bold">
              <span className="text-[#90ddaa] font-tektur ">Easy</span>
              <span className="text-[#b180f0] font-tektur ">Judge</span>
            </div>
          </div>
        </div>

        <div className="h-full w-full flex flex-col items-center gap-2">
          <h1 className="text-2xl font-sans font-medium">
            {isLogin ? "Sign In" : "Sign Up"}
          </h1>
          <div className="flex gap-2 items-center">
            <p className="text-slate-400">
              {!isLogin ? "Don't" : "Already"} have an account?
            </p>
            <p
              onClick={() => refresh(isLogin)}
              className="text-blue-700 cursor-pointer hover:underline"
            >
              {isLogin ? "register" : "login"}
            </p>
          </div>
          <form
            onSubmit={onSubmitHandler}
            className={`h-full w-full flex flex-col ${
              isLogin ? "mt-10" : "mt-2"
            }`}
          >
            {!isLogin && (
              <div className="mb-4 mx-32">
                <label className="block text-sm font-normal text-black mb-1 ml-2">
                  UserName <span className="text-red-600">*</span>
                </label>
                <div className="relative w-full">
                  <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className="w-full py-2 px-5 border rounded-3xl bg-white placeholder:text-slate-300 placeholder:text-base text-black focus:outline-none"
                    type="name"
                    placeholder="Enter Your Name"
                  />
                  <User2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-input-placeholder size-5" />
                </div>
              </div>
            )}
            <div className="mb-4 mx-32">
              <label className="block text-sm font-normal text-black mb-1 ml-2">
                Email <span className="text-red-600">*</span>
              </label>
              <div className="relative w-full">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="w-full py-2 px-5 border rounded-3xl bg-white placeholder:text-slate-300 placeholder:text-base text-black focus:outline-none"
                  type="email"
                  placeholder="Enter Your Email"
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-input-placeholder size-5" />
              </div>
            </div>
            <div className="mb-4 mx-32">
              <label className="block text-sm font-normal text-black mb-1 ml-2">
                Password <span className="text-red-600">*</span>
              </label>
              <div className="relative w-full">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="w-full py-2 px-5 border rounded-3xl bg-white placeholder:text-slate-300 placeholder:text-base text-black focus:outline-none"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Your Passwrd"
                />
                {showPassword ? (
                  <Eye
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-input-placeholder cursor-pointer size-5"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <EyeOff
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-input-placeholder cursor-pointer size-5"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )}
              </div>
            </div>
            {!isLogin && (
              <div className="mb-4 mx-32">
                <label className="block text-sm font-normal text-black mb-1 ml-2">
                  Confirm Password <span className="text-red-600">*</span>
                </label>
                <div className="relative w-full">
                  <input
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    className="w-full py-2 px-5 border rounded-3xl bg-white placeholder:text-slate-300 placeholder:text-base text-black focus:outline-none"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Your Passwrd"
                  />
                  {showPassword ? (
                    <Eye
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-input-placeholder cursor-pointer size-5"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  ) : (
                    <EyeOff
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-input-placeholder cursor-pointer size-5"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  )}
                </div>
              </div>
            )}
            {isLogin && (
              <div
                onClick={() => navigate("/reset-password")}
                className="mx-32 w-1/4 text-blue-700 cursor-pointer hover:underline"
              >
                <span className="ml-1 w-full">Forgot Password?</span>
              </div>
            )}
            <div className="flex justify-center mt-4">
              <button
                className={`w-[300px] mt-4 p-2 bg-black border text-white rounded-3xl hover:bg-white hover:text-black hover:border hover:border-black flex items-center justify-center gap-2 transition-all duration-300 ${
                  loading ? "opacity-90 cursor-not-allowed" : ""
                }`}
                type="submit"
                disabled={loading}
              >
                {loading && <Loader2 className="animate-spin size-5" />}
                {loading ? "Loading..." : isLogin ? "Login" : "Register"}
              </button>
            </div>
            <div
              className={` ${
                isLogin ? "mt-8" : "mt-4"
              } flex items-center justify-center m-auto mb-2 w-full`}
            >
              <div className="w-1/4 h-[0.5px] bg-slate-400"></div>
              <div className="text-slate-400 mx-1 text-center">or</div>
              <div className="w-1/4 h-[0.5px] bg-slate-400"></div>
            </div>
            <div
              className={`${
                isLogin ? "mt-8" : "mb-16 mt-4"
              } w-full flex items-center justify-center gap-6`}
            >
              <div className="px-10 py-3 flex items-center gap-1 border border-slate-400 rounded-lg hover:bg-slate-100 hover:border-slate-300 cursor-pointer">
                <img src="/google.svg" alt="" className="size-6" />
                <p>Google</p>
              </div>
              <div className="px-8 py-3 flex items-center gap-1 border border-slate-400 rounded-lg hover:bg-slate-100 hover:border-slate-300 cursor-pointer">
                <img src="/github.svg" alt="" className="size-6" />
                <p>Github</p>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="bg-[url('/bg-auth.jpg')] bg-cover bg-center bg-no-repeat w-[calc(200vw/3)] h-screen ml-0 mt-10 border rounded-2xl rounded-r-none flex">
        <CircleArrowLeft
          onClick={() => navigate("/")}
          className="m-3 size-8 cursor-pointer text-slate-700 hover:text-black"
        />
        <h1 className="text-3xl m-12 text-slate-900 font-mono font-semibold">
          Welcome Back!!
        </h1>
      </div>
    </div>
  );
};

export default LoginRegister;
