import { useEffect, useRef, useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { Paper, Box, Typography, TextField, Button, Link } from '@mui/material';
import  { useAuth } from "../context/AuthContext";

const Login = () => {

  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const emailRef = useRef(null);


  useEffect(() => {
    emailRef.current.focus();
  }, []);

  const submitForm = async (event) => {
    event.preventDefault()
    login({ email, password, setErrors })
  }

   return (
    <Box sx={{ maxWidth: 525, mx: 'auto', p: { xs: 2, sm: 3, md: 4 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, textAlign: 'center' }}>
        <Typography variant="h6" component="h2" marginBottom={2} color="textSecondary">
          Web Encuestas
        </Typography>
        <form onSubmit={submitForm}>
          <Box sx={{ mb: 3 }}>
            <TextField
              inputRef={emailRef}
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
          >
            Entrar
          </Button>
        </form>
        <Link
          component={RouterLink}
          to="/forgot-password"
          variant="body2"
          sx={{ display: 'block', mb: 2, color: 'textSecondary' }}
        >
          ¿Olvidó su contraseña?
        </Link>
      </Paper>
    </Box>
  );
};

export default Login;
