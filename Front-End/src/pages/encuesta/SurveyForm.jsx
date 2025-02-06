import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";

const SurveyFormComponent = forwardRef(({ initialValues, onSubmit, errors }, ref) => {
  const [titulo_encuesta, setTitulo] = useState(initialValues.titulo_encuesta || "");
  const [descripcion, setDescripcion] = useState(initialValues.descripcion || "");
  const [hayCambios, setHayCambios] = useState(false);

  useEffect(() => {
    setTitulo(initialValues.titulo_encuesta || "");
    setDescripcion(initialValues.descripcion || "");
  }, [initialValues]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await onSubmit({ titulo_encuesta, descripcion });
    } catch (e) {
      console.error(e);
    } finally {
      setHayCambios(false);
    }
  };
  // Manejar evento submit desde QuestionsCreatorComponent
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      handleSubmit(new Event("submit"));
    },
  }));

  return (
    <Box sx={{ maxWidth: 670, mx: 'auto', p: { xs: 1, sm: 3, md: 4 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, textAlign: 'center' }}>
        <Typography variant="h6" component="h2" marginBottom={2} color="textSecondary">
          {initialValues.id ? 'Edita la Cabecera' : 'Nueva Encuesta'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <TextField
              required
              fullWidth
              variant="outlined"
              label="Título"
              value={titulo_encuesta}
              onChange={(e) => { setTitulo(e.target.value); setHayCambios(true) }}
              error={!!errors.titulo_encuesta}
              helperText={errors.titulo_encuesta ? errors.titulo_encuesta[0] : ''}
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Descripción"
              multiline
              minRows={2}
              value={descripcion}
              onChange={(e) => { setDescripcion(e.target.value); setHayCambios(true) }}
              placeholder="Escribe lo que quieras al inicio de tu encuesta...(opcional)"
            />
          </Box>
          <Button type={"submit"} disabled={!hayCambios} variant="contained">
            {/* onClick={() => handleSubmit()}> */}
            {initialValues.id ? 'Guardar cambios' : 'Crear encuesta'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
});
export default SurveyFormComponent;
