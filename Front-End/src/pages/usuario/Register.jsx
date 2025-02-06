import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios, { csrf } from '../../api/api.js';
import UserFormComponent from './UserForm.jsx';
import { toast } from 'react-toastify';

const Register = () => {
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
   
  const handleSubmit = async (formData) => {
    await csrf();
    setErrors([]);
    try {
      const promesie = axios.post('/api/users', formData);
        await toast.promise(
          promesie,
          {
            pending: 'Enviando link de verificación...',
          },
      );
      toast.success('Nuevo usuario creado.', {
        onClose: () => navigate('/usuario'),
      });
      } catch (e) {
        if (e.response && e.response.status === 422) {
          setErrors(e.response.data.errors);
        } else {
          console.error(e);
        }
      }
    
}
  return (
    <>
      <UserFormComponent onSubmit={handleSubmit} initialValues={{}} errors={errors} />
    </>
  );
};

export default Register;
