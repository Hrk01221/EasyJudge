import { NavLink, Link } from "react-router-dom";
import Logo from "../Logo";
import Explore from "./Explore";
import {
  RiMenu3Line,
  RiCloseLine,
  RiMedalLine,
  RiFileList3Line,
} from "react-icons/ri";
import { IoIosLogIn } from "react-icons/io";
import { IoBookOutline, IoCreateOutline } from "react-icons/io5";
import { RiHome2Line } from "react-icons/ri";
import { useEffect, useRef, useState } from "react";
import {
  LuBrain,
  LuFileCode2,
  LuLaptopMinimal,
  LuSwords,
} from "react-icons/lu";
import { PiRanking, PiTestTubeFill } from "react-icons/pi";

const navlinks = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Problems",
    url: "/problemset",
  },
  {
    name: "Contests",
    url: "/contest",
  },
];

const pages = [
  {
    name: "Home",
    url: "/",
    icon: RiHome2Line,
  },
  {
    name: "Problems",
    url: "/problemset",
    icon: LuFileCode2,
  },
  {
    name: "Contests",
    url: "/contest",
    icon: RiMedalLine,
  },
  {
    name: "Leaderboard",
    url: "/rank",
    icon: PiRanking,
  },
];

const edu = [
  {
    name: "Learn",
    url: "/learn",
    icon: IoBookOutline,
  },
  {
    name: "Blogs",
    url: "/blogs",
    icon: RiFileList3Line,
  },
  {
    name: "Dual",
    url: "/dual",
    icon: LuSwords,
  },
];

const tools = [
  {
    name: "Compiler",
    url: "/compiler",
    icon: LuLaptopMinimal,
  },
  {
    name: "AI Companion",
    url: "/ai",
    icon: LuBrain,
  },
  {
    name: "Testcase Generator",
    url: "/gen-tc",
    icon: PiTestTubeFill,
  },
];

const Navbar = () => {
  const [isloggedin, setIsloggedin] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const navref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlClickOutside = (event: MouseEvent) => {
      if (navref.current && !navref.current.contains(event.target as Node)) {
        setMobileSidebar(false);
      }
    };
    document.addEventListener("mousedown", handlClickOutside);
    return () => {
      document.removeEventListener("mousedown", handlClickOutside);
    };
  }, []);
  return (
    <nav className="fixed w-full py-6 shadow-lg z-50 bg-white">
      <div className="container mx-auto px-6 lg:px-30 flex justify-between">
        {/* Left side with logo */}
        <Logo />
        <div className="hidden relative lg:flex items-center justify-center gap-8 font-poppins tracking-wide">
          {navlinks.map((links, idx) => {
            return (
              <NavLink
                to={links.url}
                key={idx}
                className={({ isActive }) =>
                  isActive
                    ? "bg-gray-100 rounded-xl px-3 py-2 tracking-widest text-black border"
                    : "hover:bg-gray-100 rounded-xl px-3 py-2 transition-all duration-300 ease-in-out text-black/80 border border-white"
                }
              >
                {links.name}
              </NavLink>
            );
          })}
          <Explore />
        </div>

        {/* CTA web */}
        <div className="hidden lg:flex items-center justify-center gap-8 font-bold tracking-wide">
          {!isloggedin && (
            <>
              <Link to={"/sign-in"} className="hover:bg-gray-100 px-4 py-2 rounded-lg">Sign In</Link>
              <Link
                to={"/sign-up"}
                className="px-4 py-2 bg-logoright rounded-xl text-white"
              >
                Sign Up
              </Link>
            </>
          )}
          {isloggedin && (
            <div className="font-normal flex gap-4 items-center">
              <Link
                to={"/profile"}
                className="cursor-pointer border-2 border-dashed px-4 py-1 rounded-lg hover:scale-105 tracking-widest font-bold font-mono text-lg transition-all ease-in-out duration-300"
              >
                Hrk
              </Link>
              |
              <div className="px-4 py-2 bg-logoright rounded-xl text-white cursor-pointer hover:scale-105">
                Logout
              </div>
            </div>
          )}
        </div>

        {/*for mobile */}
        <div
          onClick={() => setMobileSidebar((prev) => !prev)}
          className="lg:hidden border border-gray-500 px-2 py-2 rounded-lg cursor-pointer"
        >
          <RiMenu3Line size={18} className="lg:hidden" />
        </div>

        <div
          ref={navref}
          className={`lg:hidden w-[70%] h-screen absolute right-0 top-0 shadow-2xl bg-white ${mobileSidebar ? "translate-x-0":"translate-x-full"} transition-all ease-in duration-100`}
        >
          <RiCloseLine
            onClick={() => setMobileSidebar((prev) => !prev)}
            size={24}
            className="absolute top-2 left-2 cursor-pointer"
          />
          {/* here islogged in was used */}
          {isloggedin && (
            <div className="mt-15 px-2 space-y-6">
              <div className="text-gray-400 text-[12px]">Logged in as</div>
              <div className=" flex justify-center px-6 items-center">
                <Link
                  to={"/profile"}
                  className="cursor-pointer border-2 border-dashed rounded-lg px-10 py-1 hover:scale-105 tracking-widest font-bold font-mono text-lg"
                >
                  Hrk
                </Link>
              </div>
              <div className="px-4 py-2 bg-black rounded-lg cursor-pointer text-white font-bold absolute top-2 right-2">
                Logout
              </div>
            </div>
          )}
          {/* here islogged in was used */}
          <div
            className={`flex flex-col gap-2 ${isloggedin ? "mt-5" : "mt-15"} px-2`}
          >
            {!isloggedin && (
              <div className="flex flex-col gap-2">
                <span className="text-[11px] text-gray-400">Get started</span>
                <Link
                  onClick={() => setMobileSidebar(false)}
                  to={"sign-in"}
                  className="bg-white p-2 rounded-lg hover:bg-gray-200"
                >
                  <span className="flex items-center gap-4">
                    <IoIosLogIn size={18} />
                    Sign In
                  </span>
                </Link>
                <Link
                  onClick={() => setMobileSidebar(false)}
                  to={"sign-up"}
                  className="bg-logoright p-2 rounded-lg text-white font-bold"
                >
                  <span className="flex items-center gap-4">
                    <IoCreateOutline size={18} />
                    Sign Up
                  </span>
                </Link>
              </div>
            )}

            <div className="w-full h-px bg-linear-to-r from-gray-300 via-gray-200 to-gray-100 m-2"></div>

            <div className="flex flex-col">
              <span className="text-[11px] text-gray-400">Pages</span>
              {pages.map((p, ind) => {
                const Icon = p.icon;
                return (
                  <Link
                    onClick={() => setMobileSidebar(false)}
                    key={ind}
                    to={p.url}
                    className={`bg-white p-2 rounded-lg hover:bg-gray-200`}
                  >
                    <span className="flex items-center gap-4">
                      <Icon size={18} />
                      {p.name}
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="w-full h-px bg-linear-to-r from-gray-300 via-gray-200 to-gray-100 m-2"></div>

            <div className="flex flex-col">
              <span className="text-[11px] text-gray-400">Edu</span>
              {edu.map((p, ind) => {
                const Icon = p.icon;
                return (
                  <Link
                    onClick={() => setMobileSidebar(false)}
                    key={ind}
                    to={p.url}
                    className={`bg-white p-2 rounded-lg hover:bg-gray-200`}
                  >
                    <span className="flex items-center gap-4">
                      <Icon size={18} />
                      {p.name}
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="w-full h-px bg-linear-to-r from-gray-300 via-gray-200 to-gray-100 m-2"></div>

            <div className="flex flex-col">
              <span className="text-[11px] text-gray-400">Tools</span>
              {tools.map((p, ind) => {
                const Icon = p.icon;
                return (
                  <Link
                    onClick={() => setMobileSidebar(false)}
                    key={ind}
                    to={p.url}
                    className={`bg-white p-2 rounded-lg hover:bg-gray-200`}
                  >
                    <span className="flex items-center gap-4">
                      <Icon size={18} />
                      {p.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
