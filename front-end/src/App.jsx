import AppRoutes from "./utils/routes";
import "rsuite/dist/rsuite.min.css";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { TaskProvider } from "./context/TaskContext";

function App() {
  return (
    <TaskProvider>
      <AppRoutes />
      <ToastContainer />
    </TaskProvider>
  );
}

export default App;
