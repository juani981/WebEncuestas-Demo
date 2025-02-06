import { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Input, Typography } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios, { csrf } from '../api/api';
import Loading from './Loading';
import AnswersSubmitComponent from '../pages/encuesta/AnswersSubmit';
import { toast } from 'react-toastify';

const SurveyRequestComponent = () => {
  const { slug, encuestadoId, hash } = useParams();
  const [respuestaData, setRespuestaData] = useState({});
  // const [questionsData, setQuestionsData] = useState([]);
  // const [responseData, setResponseData] = useState({});
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showInformeDialog, setShowInformeDialog] = useState(false);
  const [showEncuesta, setShowEncuesta] = useState(false);
  const navigate = useNavigate();

  const handleResponse = async (data) => {
    if (data.code === 'ENCUESTA_DISPONIBLE') {
      setRespuestaData(data);
      setShowEncuesta(true);
    } else if (data.code === 'NUEVO_ENCUESTADO') {
      toast.success(data.message);
      setShowSuccessDialog(true);
      setShowEmailForm(true);
    } else if (['ENCUESTA_NO_ANONIMA', 'EMAIL_INVALIDO', 'EMAIL_NO_VERIFICADO'].includes(data.code)) {
      toast.warning(data.message);
      setShowEmailForm(true);
    } else if (['ENCUESTA_FINALIZADA', 'LIMITE_RESPUESTAS_ALCANZADO', 'ENCUESTA_YA_RESPONDIDA'].includes(data.code)) {
      toast.warning(data.message);
      if (encuestadoId) {
        setRespuestaData(data);
        setShowInformeDialog(true);
      }
    } else if (data.code === 'ENCUESTA_PRIVADA') {
      // toast.warning(data.message);
      toast.warning(data.message, {
        onClose: () => window.close()
      });
      navigate(-1);
    } else {
      toast.error("Ha ocurrido un error. Por favor, inténtalo de nuevo.");
    }
    setLoading(false);
  };

  const fetchEncuesta = async () => {
    try {
      await csrf();
      const response = encuestadoId
        ? await axios.get(`/api/encuestas/publicada/${slug}/${encuestadoId}/${hash}`)
        : await axios.post(`/api/encuestas/publicada/${slug}`);
      await handleResponse(response.data);
    } catch (error) {
      console.error(error);
      // toast.error("Ha ocurrido un error. Por favor, inténtalo de nuevo.", {
      //   onClose: () => navigate(-1)
      // });
    }
  };

  useEffect(() => {
    fetchEncuesta();
  }, [slug, encuestadoId, hash]);

  const handleEmailSubmit = async () => {
    setLoading(true);
    try {
      await csrf();
      const response = await axios.post(`/api/encuestas/publicada/${slug}`, { correo: email });
      await handleResponse(response.data);
    } catch (error) {
      console.error(error);
      // toast.error("Ha ocurrido un error. Por favor, inténtalo de nuevo.", {
      //   onClose: () => navigate(-1)
      // });
    }
  };

  const handleCloseDialog = () => {
    setShowEmailForm(false);
    setShowSuccessDialog(false);
    setShowInformeDialog(false);
    toast.success("Gracias por usar Web Encuestas.", {
      onClose: () => window.close()
    });
    navigate(-1);
    // window.open("about:blank", "_self");
    // window.close();
    // window.location.href = `mailto:${email}`;
  };

  // const handleSurveySubmit = async () => {
  //   try {
  //     await csrf();
  //     await axios.post(`/api/encuestas/responder/`, responseData);
  //     alert("Respuesta enviada con éxito.")
  //     navigate("/");
  //   } catch (e) {
  //     console.error(e);
  //     navigate("/");
  //   }
  // }

  if (loading) {
    return <Loading open={loading} />;
  }

  if (showEmailForm) {
    return <Dialog open={showEmailForm} onClose={handleCloseDialog}>
      {/* onClose={handleCloseDialog} */}
      <DialogTitle sx={{ textAlign: 'center' }}>Encuesta No Anónima</DialogTitle>
      <form onSubmit={handleEmailSubmit}>
        {showSuccessDialog
          ? (
            <DialogContent>
              <Typography variant="subtitle2" sx={{ marginBottom: '16px' }}>
                ¡Gracias! podrá responder esta encuesta desde el enlace que mandamos a su correo.
              </Typography>
            </DialogContent>
          )
          : (<DialogContent>
            <Typography variant="subtitle2" sx={{ marginBottom: '16px' }}>
              Para poder responder a esta encuesta deberá ingresar su correo.
            </Typography>
            <Input
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingrese su correo electrónico"
              inputProps={{
                type: "email",
              }}
            />
          </DialogContent>
          )}
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">
            Cerrar
          </Button>
          {!showSuccessDialog && (
            <Button type="submit" color="primary">
              Verificar
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  }

  if (showInformeDialog) {
    return <Dialog open={showInformeDialog} onClose={handleCloseDialog} >
      <DialogTitle sx={{ textAlign: 'center' }}>Encuesta Finalizada</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle2">
          Se encuentran disponibles los resultados para los participantes de la encuesta.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="error">
          Cerrar
        </Button>
        <Button component={Link} to={`/informe/${respuestaData.id}/${encuestadoId}/${hash}`} color="primary">
          Generar Informe
        </Button>
      </DialogActions>
    </Dialog>
  }

  if (showEncuesta) {
    return <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '20px',
        gap: '30px',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        {respuestaData.encuesta.titulo_encuesta}
      </Typography>
      <Typography variant="body1">
        {respuestaData.encuesta.descripcion}
      </Typography>
      {respuestaData.correo
        ? <AnswersSubmitComponent encuestaId={respuestaData.encuesta.id} esPiloto={respuestaData.encuesta.estado === 'piloto'} correo={respuestaData.correo} />
        : <AnswersSubmitComponent encuestaId={respuestaData.encuesta.id} esPiloto={respuestaData.encuesta.estado === 'piloto'} />
      }
    </Box>
  }
};
export default SurveyRequestComponent;