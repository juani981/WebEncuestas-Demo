import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, {csrf} from '../../api/api';
import SurveyCreatorComponent from './SurveyForm';

const SurveyCreateComponent = () => {
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await csrf();
      const response = await axios.post("/api/encuestas", formData);
      const id = response.data.id;
      navigate(`/encuesta/editar/${id}`);
    } catch (e) {
      if (e.response && e.response.status === 422) {
        setErrors(e.response.data.errors);
      } else {
        console.error(e);
      }
    }
  }

  return (
      <SurveyCreatorComponent onSubmit={handleSubmit} initialValues={{}} errors={errors} />
  );
};

export default SurveyCreateComponent;
