import AppRoutes from "./utils/routes";
import "rsuite/dist/rsuite.min.css";
import "./App.css";
import ToastContainer from "rsuite/esm/toaster/ToastContainer";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <AppRoutes />
      <ToastContainer />
    </>
  );
}

export default App;
