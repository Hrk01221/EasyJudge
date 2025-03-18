import { Eye, EyeOff, Loader2, Mail, User } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { TypeAnimation } from "react-type-animation";

const LoginRegister = () => {
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
            toast.error(data.message);
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
            toast.error(data.message);
          }
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  useEffect(() => {
    if (isLoggedin) {
      navigate("/");
    }
  }, [isLoggedin]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-sky-400">
      <div className="flex-grow min-h-screen flex items-center justify-center p-4 relative">
        {/*right*/}
        <div className="max-w-5xl rounded-xl flex justify-between h-[600px] bg-[url('/bg-c1.jpg')] bg-cover bg-center bg-no-repeat w-full">
          <div className="w-1/2 p-4 text-white rounded-xl flex flex-col gap-16">
            <div onClick={()=>navigate('/')} className="flex items-center gap-3 cursor-pointer">
              <img src="/logo.png" alt="" className="w-10" />
              <span className="font-bold text-nav-col text-2xl">
                Easy <span className="text-white">Judge</span>
              </span>
            </div>
            <div className="flex flex-col items-center">
              <h2 className="text-3xl font-bold">
                {isLogin ? "Welcome Back!" : "Join Us Today!"}
              </h2>
              <div className="mt-4">
                <p>
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <button
                    className="ml-1 text-violet-800 hover:underline font-bold"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? "Register here" : "Login here"}
                  </button>
                </p>
              </div>
            </div>
            <div className="w-3/4 h-full m-4 text-base flex items-center justify-center">
              <TypeAnimation
                sequence={[
                  "EasyJudge — Code smarter, compete better.",
                  1000,
                ]}
                wrapper="strong"
                speed={40}
              />
            </div>

            <div className="text-gray-500 text-sm">copyright | 2025</div>
          </div>

          {/*left*/}
          <div className="w-1/2 p-4 h-full flex flex-col justify-end">
            <h2 className="text-2xl mt-10 font-bold text-center mb-4 text-font-big text-black">
              {isLogin ? "Login" : "Register"}
            </h2>

            <form
              className="flex-grow flex flex-col justify-center"
              onSubmit={onSubmitHandler}
            >
              {!isLogin && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black mb-2">
                    Name
                  </label>
                  <div className="relative w-full">
                    <input
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      className="w-full p-2 border rounded-md bg-white  text-black ring-1 ring-black focus:outline-none focus:ring-1 focus:border-border-custom2 focus:shadow-lg"
                      type="name"
                      placeholder="Enter Your Name"
                    />
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-input-placeholder size-5" />
                  </div>
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-black mb-2">
                  Email
                </label>
                <div className="relative w-full">
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="w-full p-2 border rounded-md bg-white  text-black ring-1 ring-black focus:outline-none focus:ring-1 focus:border-border-custom2 focus:shadow-lg"
                    type="email"
                    placeholder="Enter Your Email"
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-input-placeholder size-5" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-black mb-2">
                  Password
                </label>
                <div className="relative w-full">
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className="w-full p-2 border rounded-md bg-white  text-black ring-1 ring-black focus:outline-none focus:ring-1 focus:border-border-custom2 focus:shadow-lg"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Your Password"
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
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black mb-2">
                    Confirm Password
                  </label>
                  <div className="relative w-full">
                    <input
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      value={confirmPassword}
                      className="w-full p-2 border rounded-md bg-white  text-black ring-1 ring-black focus:outline-none focus:ring-1 focus:border-border-custom2 focus:shadow-lg"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm Your Password"
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
                <div className="mt-2">
                  <p
                    onClick={() => navigate("/reset-password")}
                    className="ml-1 text-nav-col hover:text-violet-500 cursor-pointer"
                  >
                    Forgot Password?
                  </p>
                </div>
              )}
              <div className="flex justify-center mt-4">
                <button
                  className={`w-[150px] mt-4 p-2 bg-blue-700 font-bold text-white rounded-3xl hover:bg-blue-500 flex items-center justify-center gap-2 transition-all duration-300 ${
                    loading ? "opacity-90 cursor-not-allowed" : ""
                  }`}
                  type="submit"
                  disabled={loading}
                >
                  {loading && <Loader2 className="animate-spin size-5" />}
                  {loading ? "Loading..." : isLogin ? "Login" : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
