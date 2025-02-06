import React, { useState } from "react";
import { Link, useRoutes, Routes, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
// import Home from "../pages/Home";
// import Login from "../pages/Login";
// import Register from "../pages/Register";
// import ForgotPassword from "../pages/ForgotPassword";
// import ResetPassword from "../pages/ResetPassword";
// import AnswersSubmitComponent from "../pages/encuesta/AnswersSubmit";
// import SurveyCreateComponent from "../pages/encuesta/SurveyCreate";
// import SurveyEditComponent from "../pages/encuesta/SurveyEdit";
// import SurveyIndexComponent from "../pages/encuesta/SurveyIndex";
// import ProfileComponent from "./User/Profile";
// import SurveyRequestComponent from "./SurveyRequest";
import { my_routes } from "../helpers/routes";

const BasicTabs = () => {
  const [value, setValue] = useState(0);
  const { user, logout } = useAuth();
  const routes = useRoutes(my_routes);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleLogout = (event) => {
    event.preventDefault();
    logout();
  };

  return (
    <Box sx={{ width: "100%" }}>
      <div className="grid justify-end bg-indigo-900 text-white px-2 py-2.5 sm:px-4 mb-4">
        <Box>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Navigation Bar"
            textColor="inherit"
          >
            <Tab label="Web Encuestas (Logo placeholder)" component={Link} to="/" />
            {!user && <Tab label="Ingresar" component={Link} to="/login" />}
            {user && <Tab label="Usuarios" component={Link} to="/usuario" />}
            {user && <Tab label="Nuevo usuario" component={Link} to="/usuario/register" />}
            {user && <Tab label="Contactos" component={Link} to="/contactos" />}
            {user && <Tab label="Crear encuesta" component={Link} to="/encuesta/crear" />}
            {user && <Tab label="Mis encuestas" component={Link} to="/encuesta" />}
            {user && <Tab label="Responder Encuesta" component={Link} to="/pages/encuesta/AnswersSubmit" />}
            {user && <Tab label="Mi Perfil" component={Link} to="/usuario/Perfil" />}
            {user && (
              <Tab
                label="Cerrar sesión"
                onClick={handleLogout}
                component={Link}
                to="/"
              />
            )}
          </Tabs>
        </Box>
      </div>
      {routes}
    </Box>
  );
};

export default BasicTabs;