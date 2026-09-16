import { LuBrain, LuLaptopMinimal, LuSwords } from "react-icons/lu";
import { IoBookOutline } from "react-icons/io5";
import { PiTestTubeFill, PiRanking } from "react-icons/pi";
import {
  RiFileList3Line,
  RiArrowDropDownLine,
  RiArrowDropUpLine,
} from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const items = [
  {
    name: "Leaderboard",
    url: "/rank",
    icon: PiRanking,
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
  {
    name: "Learn",
    url: "/learn",
    icon: IoBookOutline,
  },
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
const Explore = () => {
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlClickOutside = (event: MouseEvent) => {
      if (
        exploreRef.current &&
        !exploreRef.current.contains(event.target as Node)
      ) {
        setDropDownOpen(false);
      }
    };
    document.addEventListener("mousedown", handlClickOutside);
    return () => {
      document.removeEventListener("mousedown", handlClickOutside);
    };
  }, []);

  return (
    <div ref={exploreRef} className="relative">
      {/* dropdown trigger */}
      <div
        onClick={() => setDropDownOpen((prev) => !prev)}
        className="hover:bg-gray-200/70 rounded-lg p-2 transition-all duration-300 ease-in-out text-black/80 font-poppins tracking-wide flex items-center justify-center cursor-pointer"
      >
        <span>Explore</span>
        {dropDownOpen ? (
          <RiArrowDropDownLine size={24} />
        ) : (
          <RiArrowDropUpLine size={24} />
        )}
      </div>
      {/* Dropdown */}
      <div
        className={`w-100 flex flex-col px-1 py-4 justify-center shadow-xl rounded-xl absolute top-[180%] left-2 bg-white/30 border border-gray-200 gap-2 ${dropDownOpen ? "opacity-100 visible" : "opacity-0 invisible"} transition-all ease-linear duration-300`}
      >
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <NavLink
              to={item.url}
              key={idx}
              style={{
                transitionDelay: `${idx * 60}ms`,
              }}
              onClick={() => setDropDownOpen(false)}
              className={({ isActive }) =>
                `${
                  isActive
                    ? "flex items-center gap-4 w-full border rounded-lg bg-gray-100 px-4 py-2 cursor-pointer"
                    : "flex items-center gap-4 w-full border border-white rounded-lg hover:bg-gray-100 px-4 py-2 cursor-pointer"
                }
                ${dropDownOpen ? "opacity-100" : "opacity-0"}
                transition-all duration-300
                `
              }
            >
              <Icon size={24} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default Explore;
