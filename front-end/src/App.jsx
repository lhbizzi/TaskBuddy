import AppRoutes from "./utils/routes";
import "rsuite/dist/rsuite.min.css";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <AppRoutes />
      <ToastContainer />
    </>
  );
}

export default App;
