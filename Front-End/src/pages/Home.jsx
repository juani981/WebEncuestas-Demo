import { useState, useEffect } from "react";
import  { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const [mensaje, setMensaje] = useState('');
  useEffect(() => {
    if (!user) {
      setMensaje('Hola, inicie sesión');
    } else {
      setMensaje(`Bienvenido ${user.name}`);
    }
  }, [user]);
  return <div>{mensaje}</div>;
};

export default Home;
