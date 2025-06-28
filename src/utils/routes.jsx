import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "../pages/login/login";
import Home from "../pages/home/home";
import NotFound from "../pages/notFound/notFound";

function Routes() {
  const router = createBrowserRouter([
    { path: "/", element: <Login /> },
    { path: "/home", element: <Home /> },
    { path: "*", element: <NotFound /> },
  ]);

  return <RouterProvider router={router} />;
}

export default Routes;
