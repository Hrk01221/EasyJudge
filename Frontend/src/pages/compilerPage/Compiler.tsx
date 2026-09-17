import { useState } from "react";
import MonacoEditor from "./MonacoEditor";

const Languages = [
  {
    name: "c++",
    idx: "cpp",
    template: `#include <bits/stdc++.h>
using namespace std;

int main() {
  cout << "Welcome to EasyJudge" << endl;
  return 0;
}`,
  },
  {
    name: "python",
    idx: "python",
    template: `def fun():
    print("Welcome to EasyJudge")
    return 0
`,
  },
];

const Compiler = () => {
  const [language, setLanguage] = useState(0);
  const [code, setCode] = useState(Languages[0].template);
  const [output, setOutput] = useState(null);

  const handleLanguageChange = (e: { target: { value: string } }) => {
    const index = parseInt(e.target.value, 10);

    setLanguage(index);
    setCode(Languages[index].template);
  };

  return (
    <section className="w-full min-h-screen pt-30">
      <div className="container mx-auto px-6 lg:px-30 flex flex-col gap-4">
        <h1 className="text-lg lg:text-2xl w-full pb-2 border-b">
          Online Compiler
        </h1>
        <div className="w-full h-full flex flex-col lg:flex-row gap-4">
          {/* Left side compiler */}
          <div className="w-full lg:w-[60%] h-full flex flex-col gap-4">
            <div className="flex justify-between items-center gap-4 text-sm lg:text-lg w-full">
              <span>Choose Language</span>

              <select
                value={language}
                onChange={handleLanguageChange}
                className="border border-gray-400 px-4 lg:px-20 py-2 rounded-md cursor-pointer"
              >
                {Languages.map((item, idx) => (
                  <option value={idx} key={item.idx}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full h-[50vh] lg:h-[90vh] border border-gray-300 p-4">
              <MonacoEditor
                idx={Languages[language].idx}
                code={code}
                setCode={setCode}
              />
            </div>
          </div>
          {/* right side i/o */}
          <div className="w-full lg:w-[40%] h-full flex flex-col gap-4">
            <div className="w-full text-right lg:text-left">
              <button onClick={()=>console.log(code)} className="border px-16 py-2 rounded-sm bg-blue-400 text-white cursor-pointer">
                Run
              </button>
            </div>
            <textarea
              placeholder="Enter your input..."
              className="w-full h-40 p-3 resize-none border border-gray-300 placeholder:text-xl focus:ring-1 focus:ring-gray-400"
            />
            <div className="flex flex-col gap-4">
              <span className="text-2xl">Output</span>
              <textarea
                readOnly
                tabIndex={output == null ? -1 : 0}
                value={output ?? ""}
                className={`w-full h-[40vh] lg:h-[58vh] p-3 resize-none border border-gray-300 focus:outline-none ${output==null ? "cursor-default" : "cursor-text"}`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Compiler;
