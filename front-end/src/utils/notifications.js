import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function successMessage(msg) {
  toast.success(msg);
}

export function errorMessage(msg) {
  toast.error(msg);
}
