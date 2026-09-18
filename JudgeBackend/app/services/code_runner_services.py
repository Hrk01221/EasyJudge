from pathlib import Path
import tempfile ,time , subprocess , subprocess, ctypes
from fastapi import HTTPException , status

def execute_submission(source_code : str , input : str , language : str):
    if language == "cpp":
        return run_cpp(source_code,input)
    else :
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Language not supported"
        )

def run_cpp(source_code:str , input: str):

    if hasattr(ctypes, "windll"):
        SEM_NOGPFAULTERRORBOX = 0x0002
        SEM_FAILCRITICALERRORS = 0x0001
        ctypes.windll.kernel32.SetErrorMode(SEM_NOGPFAULTERRORBOX | SEM_FAILCRITICALERRORS)

    with tempfile.TemporaryDirectory() as temp:

        temp = Path(temp)

        source_file = temp / "main.cpp"
        exec_file = temp / "main.exe"

        source_file.write_text(source_code , encoding="utf-8")

        compile_result = subprocess.run(
            [
                "g++",
                str(source_file),
                "-std=c++17",
                "-O2",
                "-o",
                str(exec_file)
            ],
            capture_output=True,
            text=True
        )

        # Compilation Error
        if compile_result.returncode != 0:
            return{
                "verdict" : "CE",
                "error" : compile_result.stderr.split("error: ", 1)[1].split("\n", 1)[0],
                "execution_time" : "0ms"
            } 

        start = time.perf_counter()

        try:
            result = subprocess.run(
                [str(exec_file)],
                input=input,
                capture_output=True,
                text=True,
                timeout=2
            )
        # TLE
        except subprocess.TimeoutExpired:
            return{
                "verdict" : "TLE",
                "error" : "Time Limit Exceeded!",
                "execution_time" : "2000ms"
            }

        execution_time = time.perf_counter() - start

        #RTE
        if result.returncode != 0:
            return{
                "verdict" : "RE",
                "error" : "Run Time Error",
                "execution_time" : "0ms"
            }
    
    return {
        "verdict": "ok",
        "output": result.stdout,
        "time": f"{execution_time * 1000:.0f}ms"
    }