import { useState, useEffect } from 'react';
import { Link as RouterLink, useParams, useSearchParams } from 'react-router-dom';
import { Paper, Box, Typography, TextField, Button, Alert, Link } from '@mui/material';
import  { useAuth } from "../context/AuthContext";

const ResetPassword = () => {

  const { token } = useParams();
  const [searchParams] = useSearchParams();
  
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password_confirmation, setPasswordConfirmation] = useState('')
  const [errors, setErrors] = useState([])
  const [status, setStatus] = useState(null)

  const submitForm = event => {
    event.preventDefault();
    resetPassword({
      token,
      email,
      password,
      password_confirmation,
      setErrors,
      setStatus
    });
  };

  useEffect(() => {
    setEmail(searchParams.get('email') || '');
  }, [searchParams]);

  return (
    <Box sx={{ maxWidth: 525, mx: 'auto', p: { xs: 2, sm: 3, md: 4 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, textAlign: 'center' }}>
        {status && 
          <Alert severity="success" sx={{ mb: 2 }}>
            {status}
            <p>
              Ir a <Link component={RouterLink} to="/login">Inicio de Sesión</Link>
            </p>
          </Alert>
        }
        <Typography variant="h6" component="h2" marginBottom={2} color="textSecondary">
          Restaurar Contraseña
        </Typography>
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
          <Box sx={{ mb: 3 }}>
            <TextField
              required
              fullWidth
              type="password"
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password ? errors.password[0] : ''}
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField
              required
              fullWidth
              type="password"
              label="Confirme su contraseña"
              value={password_confirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
          >
            Restaurar Contraseña
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default ResetPassword