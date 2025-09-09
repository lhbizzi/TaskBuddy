import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "../pages/login/login";
import Home from "../pages/home/home";
import NotFound from "../pages/notFound/notFound";
import Signup from "../pages/signup/signup";
import Navbar from "../components/navbar/navbar";
import Sidebar from "../components/sidebar/sidebar";
import CalendarPage from "../pages/calendar/calendar";
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

// Componente para proteger rotas
function PrivateRoute({ children }) {
  const location = useLocation();
  const token = sessionStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
}

function AppRoutes() {
  const router = createBrowserRouter([
    { path: "/", element: <Login /> },
    { path: "/register", element: <Signup /> },
    {
      element: <AppLayout />,
      children: [
        {
          path: "/home",
          element: (
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          ),
        },
        {
          path: "/calendar",
          element: (
            <PrivateRoute>
              <CalendarPage />
            </PrivateRoute>
          ),
        },
        {
          path: "/tasks",
          element: (
            <PrivateRoute>
              <TodasTarefas />
            </PrivateRoute>
          ),
        },
      ],
    },
    { path: "*", element: <NotFound /> },
  ]);
  return <RouterProvider router={router} />;
}

export default AppRoutes;
