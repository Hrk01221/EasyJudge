import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout";
import Home from "./pages/Home";
import Problemset from "./pages/problemsPage/Problems";
import Contest from "./pages/contest/Contest";
import Leaderboard from "./pages/rankPage/LeaderBoard";
import Blogs from "./pages/blogsPage/Blogs";
import Dual from "./pages/dualPage/Dual";
import Learn from "./pages/learnPage/Learn";
import Compiler from "./pages/compilerPage/Compiler";
import AiCompanion from "./pages/aiPage/AiCompanion";
import TestGenerator from "./pages/testgeneratorPage/TestGenerator";
import LogIn from "./pages/authPage/LogIn";
import Register from "./pages/authPage/Register";

const router = createBrowserRouter([
  {
    path : "/",
    element : <Layout/>,
    children: [
      {
        index : true,
        element : <Home/>
      },
      {
        path : "/problemset",
        element : <Problemset/>
      },
      {
        path : "/contest",
        element : <Contest/>
      },
      {
        path : "/rank",
        element : <Leaderboard/>
      },
      {
        path : "/blogs",
        element : <Blogs/>
      },
      {
        path : "/dual",
        element : <Dual/>
      },
      {
        path : "/learn",
        element : <Learn/>
      },
      {
        path : "/compiler",
        element : <Compiler/>
      },
      {
        path : "/gen-tc",
        element : <TestGenerator/>
      },
    ]
  },
  {
    path : "/sign-in",
    element : <LogIn/>
  },
  {
    path : "/sign-up",
    element : <Register/>
  },
  {
    path : "/ai",
    element : <AiCompanion/>
  }
])
function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
