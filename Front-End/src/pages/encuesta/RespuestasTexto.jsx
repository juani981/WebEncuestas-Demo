import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios, { csrf } from '../../api/api';
import Loading from '../../components/Loading';
import TextListComponent from './SurveyTextList';

const RespuestasTexto = () => {
  const { id } = useParams();
  const [titulo, setTitulo] = useState("");
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(true);

   

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        await csrf();
        const response = await axios.get(`/api/preguntas/${id}/lista_texto`);
        setTitulo(response.data.titulo);
        setEntradas(response.data.entradas);
      } catch (error) {
        console.error(error);
        // toast.error("Ha ocurrido un error.", {
        //   onClose: () => navigate(-1)
        // });
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  if (loading) {
    return <Loading open={loading} />;
  }

  return (
    <>
      <TextListComponent titulo={'Respuestas a : ' + titulo} entradas={entradas} />
    </>
  );
};

export default RespuestasTexto;

