// SurveyProperties.js
import { useState } from "react";
import { Typography, FormControl, FormControlLabel, RadioGroup, Radio, Checkbox, TextField, Button, Tooltip, IconButton, Dialog, DialogContent, DialogActions, List, ListItem, ListItemText } from "@mui/material";
import LiveHelpOutlinedIcon from '@mui/icons-material/LiveHelpOutlined';
import { PaperWrapper } from "../../components/PaperWrapper";
import { useNavigate } from "react-router-dom";
import axios, { csrf } from "../../api/api";
import { toast } from 'react-toastify';
import { useAuth } from "../../context/AuthContext";
import EmailShare from './EmailShare';

export const SurveyProperties = ({ encuestaData }) => {
  const [esPrivada, setEsPrivada] = useState(encuestaData.es_privada);
  const [esAnonima, setEsAnonima] = useState(encuestaData.es_anonima);
  const [limiteRespuestas, setLimiteRespuestas] = useState(encuestaData.limite_respuestas || 0);
  const [fechaFinalizacion, setFechaFinalizacion] = useState(encuestaData.fecha_finalizacion || null);
  const [checkFechaFinalizacion, setCheckFechaFinalizacion] = useState(!!encuestaData.fecha_finalizacion);
  const [checkLimiteRespuestas, setCheckLimiteRespuestas] = useState(encuestaData.limite_respuestas !== 0);
  const [esPiloto, setEsPiloto] = useState(encuestaData.estado === "piloto");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [openDialogShare, setOpenDialogShare] = useState(false);
  const [openDialogInfo, setOpenDialogInfo] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async () => {
    const estado = esPiloto ? "piloto" : "publicada";
    const limiteR = checkLimiteRespuestas ? limiteRespuestas : 0;
    const fechaF = checkFechaFinalizacion ? fechaFinalizacion : null;
    const formData = {
      es_privada: esPrivada,
      es_anonima: esAnonima,
      limite_respuestas: limiteR,
      fecha_finalizacion: fechaF,
      estado: estado,
    };
    try {
      await csrf();
      const response = await axios.put(`/api/encuestas/${encuestaData.id}/publicar`, formData);
      toast.success(response.data.message);
      if (encuestaData.estado === 'borrador') {
        setOpenDialogShare(true);
      } else {
        navigate('/encuesta');
      }
    } catch (e) {
      if (e.response && e.response.status === 422) {
        setErrors(e.response.data.errors);
      } else {
        console.error(e);
      }
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(encuestaData.url)
      .then(() => {
        toast.success('Dirección URL copiada al portapapeles');
      })
      .catch((error) => {
        toast.error('Error al copiar la URL');
        console.error('Error al copiar la URL:', error);
      });
  };

  const handleDownload = async () => {
    try {
      const baseURL = axios.defaults.baseURL;
      window.open(`${baseURL}/api/encuestas/${encuestaData.id}/pdf`, '_blank');
      // await axios.get(`/api/encuestas/${encuestaData.id}/pdf`); //no funciona
    } catch (error) {
      toast.error('No se pudo descargar la encuesta.');
      console.error('No se pudo descargar la encuesta: ', error);
    }
  };

  const handleEdit = () => {
    navigate(`/encuesta/editar/${encuestaData.id}`);
  };

  const handleVersion = async () => {
    try {
      const response = await axios.post(`/api/encuestas/${encuestaData.id}/nueva_version`);
      navigate(`/encuesta/editar/${response.data.id}`);
    } catch (error) {
      console.error(error);
      toast.error("No se pudo crear una nueva versión.");
    }
  };

  const handleInfoDialog = () => {
    setOpenDialogInfo(true);
  };

  const handleShareCancel = () => {
    setOpenDialogShare(false);
    navigate('/encuesta');
  };
  const handleInfoCancel = () => {
    setOpenDialogInfo(false);
  };
  const today = new Date().toISOString().split('T')[0];
  return (
    <PaperWrapper>
      <Typography variant="subtitle2" marginBottom={1} color="textSecondary">
        Propiedades de Encuesta
        <IconButton aria-label="informacion" onClick={handleInfoDialog}>
          <LiveHelpOutlinedIcon />
        </IconButton>
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup
          name="es_privada"
          value={esPrivada ? "privada" : esAnonima ? "anonima" : "publica"}
          onChange={(e) => {
            if (e.target.value === "anonima") {
              setEsPrivada(false);
              setEsAnonima(true);
            } else if (e.target.value === "publica") {
              setEsPrivada(false);
              setEsAnonima(false);
            } else if (e.target.value === "privada") {
              setEsPrivada(true);
              setEsAnonima(false);
            }
          }}
        >
          <Tooltip title="Encuesta Anonima: Cualquiera la puede responder. No requiere verificación por email.">
            <FormControlLabel
              value="anonima"
              control={<Radio />}
              label="Hacer Pública y Anónima"
            />
          </Tooltip>
          <Tooltip title="Encuesta Pública: Cualquiera la puede responder con un email verificado.">
            <FormControlLabel
              value="publica"
              control={<Radio />}
              label="Sólo Pública"
            />
          </Tooltip>
          <Tooltip title="Encuesta Privada: Sólo los miembros privados la pueden responder.">
            <FormControlLabel
              value="privada"
              control={<Radio />}
              label="Hacer Privada"
            />
          </Tooltip>
        </RadioGroup>
        <Tooltip title="Encuesta Piloto: Habilita una casilla de comentarios y sugerencias.">
          <FormControlLabel
            control={
              <Checkbox
                checked={esPiloto}
                onChange={(e) => setEsPiloto(e.target.checked)}
                name="es_piloto"
              />
            }
            label="Modo Piloto"
          />
        </Tooltip>
        <FormControlLabel
          control={
            <Checkbox
              checked={checkFechaFinalizacion}
              onChange={(e) => setCheckFechaFinalizacion(e.target.checked)}
              name="fecha_finalizacion_checkbox"
            />
          }
          label="Fecha de finalización"
        />
        {checkFechaFinalizacion && (
          <TextField
            type="date"
            name="fecha_finalizacion"
            value={fechaFinalizacion}
            onChange={(e) => setFechaFinalizacion(e.target.value)}
            fullWidth
            inputProps={{ min: today }}
          />
        )}
        {errors.fecha_finalizacion && (
          <Typography variant="body2" color="error" sx={{ padding: 2 }}>
            {errors.fecha_finalizacion[0]}
          </Typography>
        )}
        <FormControlLabel
          control={
            <Checkbox
              checked={checkLimiteRespuestas}
              onChange={(e) => setCheckLimiteRespuestas(e.target.checked)}
              name="limite_respuestas_checkbox"
            />
          }
          label="Límite de respuestas"
        />
        {checkLimiteRespuestas && (
          <TextField
            type="number"
            name="limite_respuestas"
            value={limiteRespuestas}
            onChange={(e) => setLimiteRespuestas(e.target.value)}
            fullWidth
            inputProps={{ min: 0 }}
          />
        )}
        {errors.limite_respuestas && (
          <Typography variant="body2" color="error" sx={{ padding: 2 }}>
            {errors.limite_respuestas[0]}
          </Typography>
        )}
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          fullWidth
          sx={{ mt: 2 }}
        >
          {encuestaData.estado === "borrador" ? "Publicar" : "Guardar los Cambios"}
        </Button>
        <Typography variant="subtitle2" color="textSecondary" sx={{ marginTop: 3 }}>Operaciones Disponibles</Typography>
        <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={() => setOpenDialogShare(true) } disabled={encuestaData.estado === 'borrador'}>
          Compartir
        </Button>
        <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={handleCopyUrl} disabled={encuestaData.estado === 'borrador'}>
          Copiar URL
        </Button>
        <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={handleDownload}>
          Descargar como PDF
        </Button>
        {user && ['Super', 'Administrador', 'Editor'].includes(user.role) && (
          <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={handleEdit} disabled={encuestaData.estado !== 'borrador'}>
            Modificar
          </Button>
        )}
        {encuestaData.estado !== 'borrador' && user && ['Super', 'Administrador', 'Editor'].includes(user.role) && (
          <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={handleVersion}>
            Nueva Versión
          </Button>
        )}
        <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={() => navigate(`/informe/${encuestaData.id}`)} disabled={encuestaData.estado === 'borrador'}>
          Generar Informe
        </Button>
        <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={() => navigate(`/contactos/${encuestaData.id}`)} disabled={!esPrivada || encuestaData.estado === 'borrador'}>
          Ver Miembros Privados
        </Button>
        <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={() => navigate(`/feedback/${encuestaData.id}`)} disabled={!esPiloto || encuestaData.estado === 'borrador'}>
          Ver Comentarios
        </Button>
        <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={() => navigate(-1)}>
          Volver
        </Button>
      </FormControl>
      <EmailShare
        open={openDialogShare}
        onClose={handleShareCancel}
        encuestaId={encuestaData.id}
        esPrivada={esPrivada}
      />
      {/* Dialog open puede ir como componente aparte */}
      <Dialog open={openDialogInfo} onClose={handleInfoCancel}>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Información Útil
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Encuesta Anónima"
                secondary="Cualquiera puede responderla sin necesidad de verificación. Las respuestas no están asociadas a ningún correo electrónico."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Encuesta solamente Pública"
                secondary="Cualquiera puede responderla, pero se requiere un correo electrónico para registrar la respuesta. No es necesario que los participantes sean miembros específicos."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Encuesta Privada"
                secondary="Solo los miembros seleccionados pueden responder. Se requiere que el correo electrónico se agregue como miembro privado para participar."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Encuesta Piloto"
                secondary="Habilita una casilla para comentarios y sugerencias. Ideal para pruebas y ajustes antes del lanzamiento definitivo de la encuesta."
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleInfoCancel}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </PaperWrapper>
  );
};