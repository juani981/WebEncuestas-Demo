import React from "react";
import "tailwindcss/tailwind.css";
import "./index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import NavBar from "./components/NavBar";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Footer from "./components/Footer";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <NavBar />
          <div style={{ flex: 1 }}>
            {/* Aquí se renderizarán las rutas y el contenido principal */}
            <ToastContainer />
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
