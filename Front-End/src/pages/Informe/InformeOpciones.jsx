import { Typography, Button } from "@mui/material";
import { PaperWrapper } from "../../components/PaperWrapper";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../api/api";
import { toast } from 'react-toastify';

export const InformeOpciones = () => {
  const { idEncuesta } = useParams();
  const navigate = useNavigate();

  const handleDownload = (opcion) => {
    try {
      const baseURL = axios.defaults.baseURL;
      if(opcion === 'csv') {
        window.open(`${baseURL}/api/encuestas/${idEncuesta}/informe_csv`, '_blank');
      } else if (opcion === 'res') {
        window.open(`${baseURL}/api/encuestas/${idEncuesta}/tabla_respuestas_csv`, '_blank');
      } else {
        window.open(`${baseURL}/api/encuestas/${idEncuesta}/informe_pdf`, '_blank');
      }
      // await axios.get(`/api/encuestas/${encuestaData.id}/pdf`); //no funciona
    } catch (e) {
      console.error(e);
      toast.error('No se pudo descargar el archivo.');
    }
  };

  return (
    <PaperWrapper>
      <Typography variant="subtitle2" marginBottom={1} color="textSecondary">
        Opciones
      </Typography>
      <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={() => handleDownload('pdf')}>
        Generar PDF
      </Button>
      <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={() => handleDownload('csv')}>
        Generar CSV
      </Button>
      <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={() => handleDownload('res')}>
        Tabla de respuestas CSV
      </Button>
      <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={() => navigate(`/encuesta/${idEncuesta}/preview`)}>
        Ver Encuesta
      </Button>
      <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={() => navigate(-1)}>
        Volver
      </Button>
    </PaperWrapper>
  );
};