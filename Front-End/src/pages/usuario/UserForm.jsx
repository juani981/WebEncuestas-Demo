import { useState, useRef } from "react";
import { Box, Paper, Typography, TextField, Button, MenuItem } from '@mui/material';
import { useAuth } from "../../context/AuthContext";


//---> pages/usuario/UserForm.jsx

const UserFormComponent = ({ initialValues, onSubmit, errors }) => {
  const { user } = useAuth();
  const [name, setName] = useState(initialValues.name || "");
  const [email, setEmail] = useState(initialValues.email || "");
  const [role, setRole] = useState(initialValues.role || "Editor");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      name,
      email,
      role,
      password,
      password_confirmation,
    };
    onSubmit(formData);
  };

  return (
    <Box sx={{ maxWidth: 525, mx: 'auto', p: { xs: 2, sm: 3, md: 4 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, textAlign: 'center' }}>
        <Typography variant="h6" component="h2" marginBottom={2} color="textSecondary">
          {initialValues.id ? 'Perfil del Usuario' : 'Nuevo Usuario'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name ? errors.name[0] : ''}
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField
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
              fullWidth
              select
              label="Tipo de usuario"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              disabled={user.role !== "Administrador" && user.role !== "Super"}
              error={!!errors.role}
              helperText={errors.role ? errors.role[0] : ''}
            >
              <MenuItem value="Editor">Editor</MenuItem>
              <MenuItem value="Publicador">Publicador</MenuItem>
              <MenuItem value="Administrador">Administrador</MenuItem>
            </TextField>
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField
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
              fullWidth
              type="password"
              label="Confirme su contraseña"
              value={password_confirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <Button
              fullWidth
              variant="contained"
              type="submit"
              color="primary"
            >
              Guardar
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};
export default UserFormComponent;
