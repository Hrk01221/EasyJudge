import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";

type MonacoEditorProps = {
  idx: string;
  code: string;
  setCode: (value: string) => void;
};

const MonacoEditor = ({ idx, code, setCode }: MonacoEditorProps) => {
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 768px)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleChange = (e: { matches: any; }) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);
  return (
    <Editor
      height="100%"
      width="100%"
      language={idx}
      value={code}
      theme="vs"
      onChange={(value) => setCode(value || "")}
      options={{
        fontSize : isMobile ? 14 : 18,
        fontFamily: "JetBrains Mono",
        fontLigatures: true,

        minimap: {
          enabled: false,
        },

        automaticLayout: true,

        cursorBlinking: "smooth",

        scrollbar: {
          vertical: "hidden",
          horizontal: "hidden",
        },
      }}
    />
  );
};

export default MonacoEditor;
