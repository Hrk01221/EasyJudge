import React, { useContext } from "react";
import { AppContent } from "../context/AppContext";
import {
  BookCopy,
  BrainCircuit,
  Home,
  ChevronLeft,
  LucideSchool,
  Settings,
  ShieldUser,
  Trophy,
  LucideCode,
  Scroll,
  MessageCircleQuestion,
  MessageCircleCode,
  Braces,
  Menu,
} from "lucide-react";

const Sidebar = () => {
  const { page, setPage, sidebarShow, setSideBarShow } = useContext(AppContent);

  const navItems = [
    {
      title: "Main Menu",
      links: [
        { label: "Dashboard", icon: ShieldUser },
        { label: "Home", icon: Home },
        { label: "Contest", icon: Trophy },
        { label: "Problems", icon: BrainCircuit },
        { label: "Learn", icon: LucideSchool },
        { label: "Blogs", icon: BookCopy },
      ],
    },
    {
      title: "Tools",
      links: [
        { label: "Compiler", icon: LucideCode },
        { label: "Snippets", icon: Scroll },
        { label: "Text-Case Generator", icon: Braces },
        { label: "Settings", icon: Settings },
      ],
    },
  ];
  const navItems2 = [
    {
      title: "Other",
      links: [
        { label: "Help Center", icon: MessageCircleQuestion },
        { label: "FAQ", icon: MessageCircleCode },
      ],
    },
  ];
  return (
    <div
      className={`md:w-[250px] min-h-screen fixed transition-transform duration-300 ease-in-out custom-trans-x1-sidebar ${
        sidebarShow ? "translate-x-0" : "-translate-x-full"
      } pl-1`}
    >
      {/*logo*/}
      <div className="w-full h-[calc(100vh/13)] flex items-center justify-between border border-[#808080] rounded-md px-2 mt-2">
        <div className="flex items-center gap-1">
          <img src="/logo.png" alt="logo" className="size-9 shrink-0 mr-2" />
          <div className="text-xl font-bold">
            <span className="text-[#90ddaa] font-tektur ">Easy</span>
            <span className="text-[#b180f0] font-tektur ">Judge</span>
          </div>
        </div>
        <ChevronLeft
          onClick={() => setSideBarShow(false)}
          className="ml-auto cursor-pointer opacity-70"
        />
      </div>

      {/* pages */}
      {navItems.map((section, index) => (
        <div key={section.title}>
          <h3 className="text-xs text-gray-400 px-4 mb-1 mt-3">
            {section.title}
          </h3>
          <div className="flex flex-col gap-2">
            {section.links.map(({ label, icon: Icon }) => (
              <div
                key={label}
                onClick={() => setPage(label)}
                className={`flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer relative
              ${
                page === label
                  ? "border rounded-r-xl border-l-0 bg-gray-300"
                  : "hover:bg-gray-100"
              }
            `}
              >
                {page === label && (
                  <div className="absolute left-0 top-[5px] h-6 w-1 bg-black rounded-r-md"></div>
                )}
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Icon className="size-4" />
                  {label}
                </div>
              </div>
            ))}
          </div>
          {index === 0 && <div className="my-3 border-t border-gray-200"></div>}
        </div>
      ))}

      {/* Divider */}
      <div className="my-3 border-t border-gray-200"></div>

      {/* Other */}
      {navItems2.map((section, index) => (
        <div key={section.title}>
          <h3 className="text-xs text-gray-400 px-4 mb-1 mt-3">
            {section.title}
          </h3>
          <div className="flex flex-col gap-2">
            {section.links.map(({ label, icon: Icon }) => (
              <div
                key={label}
                onClick={() => setPage(label)}
                className={`flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer relative
              ${
                page === label
                  ? "border rounded-xl bg-gray-100"
                  : "hover:bg-gray-100"
              }
            `}
              >
                {page === label && (
                  <div className="absolute left-0 top-2 h-6 w-1 bg-black rounded-r-md"></div>
                )}
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Icon className="size-4" />
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
