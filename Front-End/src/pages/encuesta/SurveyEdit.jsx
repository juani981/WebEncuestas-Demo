import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios, { csrf, deleteFromDataBase } from "../../api/api";
import SurveyFormComponent from "./SurveyForm";
import QuestionsCreatorComponent from "./QuestionsCreator";
import Loading from "../../components/Loading";

const SurveyEditComponent = () => {
  const { id } = useParams();
  const [errors, setErrors] = useState([]);
  const [encuestaData, setEncuestaData] = useState({});
  const [loading, setLoading] = useState(true);
  const surveyFormRef = useRef();

  useEffect(() => {
    const fetchEncuesta = async () => {
      try {
        await csrf();
        const response = await axios.get(`/api/encuestas/${id}/edit`);
        setEncuestaData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEncuesta();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      await axios.put(`/api/encuestas/${id}`, formData);
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
  }

  return (
    <>
      <SurveyFormComponent
        ref={surveyFormRef}
        onSubmit={handleSubmit}
        initialValues={encuestaData}
        errors={errors}
      />
      <QuestionsCreatorComponent
        encuestaId={id}
        triggerFormSubmit={() => surveyFormRef.current.submitForm()} // Disparamos el submit del formulario
      />
    </>
  );
};

export default SurveyEditComponent;