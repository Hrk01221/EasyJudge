import React from "react";

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center z-50 bg-white">
      <div className="text-xl">wait a few seconds...</div>
      <div className="relative w-[142px] h-[40px] bg-transparent contrast-[20]">
        <div className="absolute w-[16px] h-[16px] top-[12px] left-[15px] bg-black rounded-full animate-dot"></div>
        <div className="flex ml-[31px] mt-[12px] animate-dots">
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className="w-[16px] h-[16px] bg-black rounded-full  ml-[16px]"
            ></span>
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes dot {
            50% { transform: translateX(96px); }
          }
          @keyframes dots {
            50% { transform: translateX(-31px); }
          }

          .animate-dot {
            animation: dot 2.8s infinite;
          }

          .animate-dots {
            animation: dots 2.8s infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Loading;
