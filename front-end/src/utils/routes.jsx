import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Login from "../pages/login/login";
import Home from "../pages/home/home";
import NotFound from "../pages/notFound/notFound";
import Signup from "../pages/signup/signup";
import Navbar from "../components/navbar/navbar";
import Sidebar from "../components/sidebar/sidebar";
import Calendar from "../pages/calendar/calendar";
import TodasTarefas from "../pages/todasTarefas/todasTarefas";

// O AppLayout agora gerencia a estrutura de layout
const AppLayout = () => (
  <div className="app-container">
    <Navbar />
    <div className="main-content-container">
      <Sidebar />
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  </div>
);

function AppRoutes() {
  const router = createBrowserRouter([
    { path: "/", element: <Login /> },
    { path: "/register", element: <Signup /> },
    {
      element: <AppLayout />,
      children: [
        { path: "/home", element: <Home /> },
        { path: "/calendar", element: <Calendar /> },
        { path: "/tasks", element: <TodasTarefas /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default AppRoutes;
