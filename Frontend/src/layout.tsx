import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <div className="mt-20"></div>
    </>
  );
};

export default Layout;
