import { useEffect, useState } from "react";
import { Link, useRoutes, Routes, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { DropDownMenu } from "./DropDownMenu";
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
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { Hidden } from "@mui/material";

const NavBar = () => {
  const [value, setValue] = useState(5);
  const { user, logout } = useAuth();
  const routes = useRoutes(my_routes);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleLogout = (event) => {
    event.preventDefault();
    logout();
  };

  useEffect(() => {
    const ruta = location.pathname;
    if (ruta === '/') {
      setValue(1);
    } else if (ruta.startsWith('/encuesta')
      || ruta.startsWith('/informe')
      || ruta.startsWith('/respuestas_texto')
      || ruta.startsWith('/feedback')) {
      setValue(2);
    } else if (ruta.startsWith('/usuario')
      && ruta !== '/usuario/Perfil') {
      setValue(3);
    } else if (ruta.startsWith('/contactos')) {
      setValue(4);
      // } else if (ruta === '/usuario/Perfil') {
      //   setValue(5); 
    } else {
      setValue(5);
    }
  }, [location.pathname]);

  return (
    <Box sx={{ width: "100%" }}>
      <div className="grid justify-end bg-indigo-900 text-white px-2 py-2.5 sm:px-4 mb-4">
      <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: 1,
          overflowX: 'auto', // Permite el desplazamiento horizontal si es necesario
        }}>
          {/* <Hidden mdDown>
            <img src={"../../public/logo-navbar.svg"} alt="Logo" style={{ height: '40px', marginRight: '200px' }} />
          </Hidden> */}
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Navigation Bar"
            textColor="inherit">
            {/* Vista Usuario sin loguear*/}
            {!user && (
              <Tab label="Ingresar" component={Link} to="/login" value={5} />
            )}
            {/* Vista del Publicador*/}
            {user && (
              <Tab
                label={
                  <Hidden mdDown>
                    Inicio
                  </Hidden>
                }
                component={Link} to="/"
                icon={<HomeOutlinedIcon />}
                iconPosition="start"
                value={1}
              />
            )}
            {user && !['Super', 'Administrador', 'Editor'].includes(user.role) && (
              <Tab
              label={
                <Hidden mdDown>
                  Lista de Encuestas
                </Hidden>
              }
                component={Link} to="/encuesta"
                icon={<FeedOutlinedIcon/>}
                iconPosition="start"
                value={2}
              />
            )}
            {/* Vista del Diseñador (Editor)*/}
            {user && ['Super', 'Administrador', 'Editor'].includes(user.role) && (
              <DropDownMenu
                title={"Encuestas"}
                root={"/encuesta"}
                items={[
                  { label: "Lista de Encuestas", route: "/encuesta" },
                  { label: "Crear una Encuesta", route: "/encuesta/crear" },
                ]}
                icon={<FeedOutlinedIcon />}
                value={2}
              />
            )}
            {/* Vista Admin*/}
            {user && ['Super', 'Administrador'].includes(user.role) && (
              <DropDownMenu
                title={"Usuarios"}
                root={"/usuario"}
                items={[
                  { label: "Lista de Usuarios", route: "/usuario" },
                  { label: "Nuevo usuario", route: "/usuario/register" },
                ]}
                icon={<PeopleAltOutlinedIcon />}
                value={3}
              />
            )}
            {/* Vista común a todos los usuarios*/}
            {user && (
              // <Tab 
              //   label="Contactos" 
              //   component={Link} to="/contactos"
              //   value={4} 
              // />    
              <DropDownMenu
                title={"Contactos"}
                root={"/contactos"}
                items={[{ label: "Lista de Contactos", route: "/contactos" }]}
                icon={<AlternateEmailOutlinedIcon />}
                value={4}
              />
            )}
            {user && (
              <DropDownMenu
                title={user.name}
                root={"/usuario/Perfil"}
                items={[
                  { label: "Editar mi Perfil", route: "/usuario/Perfil" },
                  { label: "Cerrar sesión", route: "#", onClick: handleLogout },
                ]}
                icon={<PersonOutlineOutlinedIcon />}
                value={5}
              />
            )}
            {/* {user && (
              <Tab
                label="Responder Encuesta"
                component={Link}
                to="/pages/encuesta/AnswersSubmit"
              />
            )} */}
          </Tabs>
        </Box>
      </div>
      {routes}
    </Box>
  );
};

export default NavBar;
