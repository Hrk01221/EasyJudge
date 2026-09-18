import { useState } from "react";
import MonacoEditor from "./MonacoEditor";
import axios from 'axios'

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
  const [input , setInput] = useState("");
  const [output, setOutput] = useState(null);
  const [compiling , setCompliling] = useState(false);

  const comileCode = async (source_code : string , input : string , language : string)=>{
    const data = {
      source_code : source_code,
      input : input,
      language : language
    }
    setCompliling(true);
    try{
      const response = await axios.post("http://127.0.0.1:8001/api/v1/judge/submit" , data)
      if(response.status == 200){
        const result = response.data
        if(result.verdict == "ok"){
          setOutput(result.output)
        }
        else setOutput(result.error)
      }
    }
    catch(error){
      alert("couldn't compile file")
    }
    finally{
      setCompliling(false);
    }
  }

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
        <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-4">
          {/* Left side compiler */}
          <div className="w-full lg:w-[60%] h-[70vh] lg:h-[calc(120vh-150px)] flex flex-col gap-4">
            <div className="flex justify-between items-center gap-4 text-sm lg:text-lg w-full">
              <span className="tracking-widest text-gray-800">Choose Language</span>

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
            
            <div className="w-full flex-1 min-h-0 border border-gray-300 py-4">
              <MonacoEditor
                idx={Languages[language].idx}
                code={code}
                setCode={setCode}
              />
            </div>
          </div>
          {/* right side i/o */}
          <div className="w-full lg:w-[40%] h-[70vh] lg:h-[calc(120vh-150px)] flex flex-col gap-4 lg:mt-0">
            <div className="w-full text-right lg:text-left">
              <button
                onClick={()=>comileCode(code , input , Languages[language].idx)}
                className="border px-16 py-2 rounded-sm bg-blue-400 text-white cursor-pointer"
              >
                Run
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e)=>setInput(e.target.value)}
              placeholder="Enter your input..."
              className="w-full h-40 p-3 resize-none border border-gray-300 placeholder:text-xl focus:ring-1 focus:ring-gray-400 text-xl"
            />
            <div className="flex flex-col gap-4 h-full">
              <span className="text-xl lg:text-2xl">Output</span>
              <textarea
                readOnly
                tabIndex={output == null ? -1 : 0}
                value={compiling ? "Compiling..." : (output ?? "")}
                className={`w-full h-full p-8 resize-none border border-gray-300 focus:outline-none ${output == null ? "cursor-default" : "cursor-text"} ${compiling ? "text-gray-400 text-2xl" : "text-xl opacity-90"}`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Compiler;
