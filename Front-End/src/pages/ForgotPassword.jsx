import { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { Paper, Box, Typography, TextField, Button, Alert } from '@mui/material';

const ForgotPassword = () => {

  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState([])
  const [status, setStatus] = useState(null)

  const submitForm = event => {
    event.preventDefault()
    forgotPassword({ email, setErrors, setStatus })
  }

  return (
    <Box sx={{ maxWidth: 525, mx: 'auto', p: { xs: 2, sm: 3, md: 4 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, textAlign: 'center' }}>
        <Typography variant="h6" component="h2" marginBottom={2} color="textSecondary">
          Solicitud por Email
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          ¿Olvidó su contraseña? Se enviará un enlace para restablecer su contraseña.
        </Typography>
        {status && <Alert severity="success" sx={{ mb: 2 }}>{status}</Alert>}
        <form onSubmit={submitForm}>
          <Box sx={{ mb: 3 }}>
            <TextField
              required
              fullWidth
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email ? errors.email[0] : ''}
            />
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
          >
            Enviar Enlace
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default ForgotPassword