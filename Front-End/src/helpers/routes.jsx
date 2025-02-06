// import React from "react";
// import { Routes, useRoutes } from "react-router-dom";
import SurveyRequestComponent from "../components/SurveyRequest";
import ProfileComponent from "../pages/usuario/Profile";
import AnswersSubmitComponent from "../pages/encuesta/AnswersSubmit";
import SurveyCreateComponent from "../pages/encuesta/SurveyCreate";
import SurveyEditComponent from "../pages/encuesta/SurveyEdit";
import SurveyIndexComponent from "../pages/encuesta/SurveyIndex";
import ForgotPassword from "../pages/ForgotPassword";
import { SurveyPreviewComponent } from "../pages/encuesta/SurveyPreview";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/usuario/Register";
import ResetPassword from "../pages/ResetPassword";
import UserIndexComponent from "../pages/usuario/UserIndex";
import ContactosIndex from "../pages/usuario/ContactosIndex";
import SurveyFeedbacks from "../pages/encuesta/SurveyFeedbacks";
import RespuestasTexto from "../pages/encuesta/RespuestasTexto";
import { Dashboard } from "../pages/Dashboard";
import { Informe } from "../pages/Informe/Informe";

export const my_routes = [
  { path: "/", element: <Dashboard /> },
  { path: "/login", element: <Login /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/password-reset/:token", element: <ResetPassword /> },
  {
    path: "/encuesta",
    element: <SurveyIndexComponent />,
  },
  {
    path: "/encuesta/crear",
    element: <SurveyCreateComponent />,
  },
  {
    path: "/encuesta/editar/:id",
    element: <SurveyEditComponent />,
  },
  // {
  //   path: "/encuesta/submit/:idEncuesta",
  //   element: <AnswersSubmitComponent />,
  // },
  {
    path: "/usuario",
    element: <UserIndexComponent />,
  },
  {
    path: "/usuario/perfil/:id?",
    element: <ProfileComponent />,
  },
  {
    path: "/usuario/register",
    element: <Register />,
  },
  {
    path: "/encuesta/:idEncuesta/preview",
    element: <SurveyPreviewComponent />,
  },
  {
    path: "/encuesta/publicada/:slug/:encuestadoId?/:hash?",
    element: <SurveyRequestComponent />,
  },
  {
    path: "/contactos/:encuestaId?",
    element: <ContactosIndex />,
  },
  {
    path: "/feedback/:id",
    element: <SurveyFeedbacks />,
  },
  {
    path: "/respuestas_texto/:id",
    element: <RespuestasTexto />,
  },
  {
    path: "/informe/:idEncuesta/:encuestadoId?/:hash?",
    element: <Informe />,
  },
];
