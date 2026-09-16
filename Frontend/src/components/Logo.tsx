import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to={"/"} className="flex items-center justify-center w-fit gap-2 lg:gap-4">
      <div className="w-7 h-7 lg:w-9 lg:h-9 cursor-pointer">
        <img
          src="../src/assets/logo.png"
          alt="logo"
          className="object-contain"
        />
      </div>
      <div className="text-lg lg:text-2xl font-tektur font-bold tracking-wide">
        <span className="text-logoleft">Easy</span>
        <span className="text-logoright">Judge</span>
      </div>
    </Link>
  );
};

export default Logo;
