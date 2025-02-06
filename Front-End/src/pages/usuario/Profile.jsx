import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios, { csrf } from '../../api/api.js';
import UserFormComponent from './UserForm.jsx';
import Loading from '../../components/Loading.jsx';

const ProfileComponent = () => {
  const { id: routeId } = useParams();
  const [id, setId] = useState(routeId);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

   

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        await csrf();
        const response = routeId
          ? await axios.get(`/api/users/${routeId}/`) //obtener usuario por id (acceso administrador)
          : await axios.get(`/api/profile/`); //obtener perfil del mismo usuario (acceso cualquier usuario logueado)
        setUserData(response.data);
        setId(response.data.id);
      } catch (e) {
        console.error(e);
        // toast.error("Ha ocurrido un error.", {
        //   onClose: () => navigate(-1)
        // });
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, []);

  const handleSubmit = async (formData) => {
    await csrf();
    setErrors([]);
    try {
      if (routeId) {
        formData.previous_email_id = routeId;
      }
      await axios.put(`/api/users/${id}`, formData);
      if (routeId) {
        navigate("/usuario");
      } else {
        navigate("/");
      }
    } catch (e) {
      if (e.response && e.response.status === 422) {
        setErrors(e.response.data.errors);
      } else {
        console.error(e);
      }
    }
  };

  if (loading) {
    return <Loading open={loading} />;
    //return <div>Cargando...</div>;
  }

  return (
    <>
      <UserFormComponent onSubmit={handleSubmit} initialValues={userData} errors={errors} />
    </>
  );
};
export default ProfileComponent;
