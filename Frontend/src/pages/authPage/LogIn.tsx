import Logo from "../../components/Logo";

const LogIn = () => {
  return (
    <div className="flex justify-center items-center min-h-screen text-2xl">
      <div className="h-[60vh] w-1/4 border flex flex-col items-center py-4 justify-between">
          <div className="flex flex-col gap-4 items-center">
            <Logo/>
            <h1 className="font-mono text-center">Welcome back to EasyJudge. <br /> <span className="text-sm">Pick up where you left off.</span></h1>
          </div>
          <form className="flex flex-col justify-center items-center gap-8 flex-1 w-full">
            <div className="flex flex-col text-sm w-[80%] gap-2">
               <span className="flex">Username <span className="text-sm text-red-400">*</span></span>
               <input type="text" className="border rounded-lg h-8 focus:ring-3 focus:ring-logoright focus:border-0"/>
            </div>
            <button className="border px-8 py-1 border-black text-sm rounded-lg cursor-pointer">Login</button>
          </form>
      </div>
    </div>
  );
};

export default LogIn;
