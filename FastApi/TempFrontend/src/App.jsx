import axios, { getAdapter } from "axios";
import { useEffect, useState } from "react";
function App() {
  const [data, setdata] = useState(null);
  useEffect(() => {
    const getdata = async () => {
      const response = await axios.get("http://127.0.0.1:8000");
      setdata(response.data)
    };
    getdata();
  }, []);
  return <div>{data ? <div>{data.message}</div> : <div>Loading....</div>}</div>;
}
export default App;
