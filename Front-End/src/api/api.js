import axiosOriginal from "axios";
// import axios from "axios";
import { toast } from "react-toastify";

const axios = axiosOriginal.create({
  // export default axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
  withXSRFToken: true,
});

export const csrf = async () => {
  if (!document.cookie.includes("XSRF-TOKEN")) {
    await axios.get("/sanctum/csrf-cookie");
  }
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response;

    switch (status) {
      case 400:
        const error400Message = error.response?.data?.message;
        if (error400Message) {
          toast.warning(error400Message);
        } else {
          toast.warning("Hubo un problema con la solicitud.");
        }
        break;
      case 422:
        toast.error(
          "Hubo un problema con la solicitud. Por favor, revisa los datos e inténtalo de nuevo."
        );
        break;

      case 401:
        if (
          location.pathname !== "/login" &&
          location.pathname !== "/forgot-password" &&
          !location.pathname.startsWith("/password-reset/") &&
          !location.pathname.startsWith("/informe/") &&
          !location.pathname.startsWith("/encuesta/publicada/")
        ) {
          // toast.info("Tu sesión ha expirado. Redirigiendo al inicio de sesión...");
          window.location.pathname = "/login";
        }
        break;

      case 403:
      // toast.warning("No tienes permiso para acceder a esta sección.");
      case 404:
        if (location.pathname.startsWith("/encuesta/publicada/")) {
          toast.warning("La sección o acción solicitada no está disponible.");
        } else if (location.pathname !== "/") {
          toast.warning("La sección o acción solicitada no está disponible.", {
            onClose: () => (window.location.pathname = "/"),
          });
        } else {
          toast.warning("La sección o acción solicitada no está disponible.");
        }
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        toast.error(
          "El servicio no está disponible en este momento. Por favor, inténtalo más tarde."
        );
        break;

      default:
        const errorMessage = error.response?.data?.message
          ? `Ocurrió un error inesperado: ${error.response.data.message}. Por favor, inténtalo de nuevo.`
          : "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.";

        if (
          location.pathname !== "/" &&
          location.pathname.startsWith("/encuesta/publicada/")
        ) {
          toast.error(errorMessage);
        } else {
          toast.error(errorMessage, {
            onClose: () => (window.location.pathname = "/"),
          });
        }
        break;
    }
    return Promise.reject(error);
  }
);
export default axios;

export const postToDataBase = async (endpoint, data) => {
  try {
    const response = await axios.post(endpoint, data);
    console.log("Success:", response.data);
  } catch (error) {
    console.error("Error:", error.response.data);
  }
};
export const getAllFromDatabase = async (endpoint) => {
  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.log(`Error:${error.message}`);
  }
};
export const getOneFromDataBase = async (endpoint, id) => {
  try {
    const response = await axios.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.log(`Error:${error.message}`);
  }
};
export const deleteFromDataBase = async (endpoint, id) => {
  const url = `/api/${endpoint}/${id}`;
  console.log(`Deleting from database: ${url}`);
  try {
    const response = await axios.delete(url);
    console.log(`Response status code: ${response.status}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};
export const sendDeletions = (deletions) => {
  axios
    .post("/api/deletions", { deletions })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
};
