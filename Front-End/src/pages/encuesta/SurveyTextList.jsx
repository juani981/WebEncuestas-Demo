import { useState } from "react";
import { Box, Button, Pagination, Paper, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";


const TextListComponent = ({ titulo, entradas }) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const navigate = useNavigate();

  const handleChangePage = (event, value) => {
    event.preventDefault();
    setPage(value);
  };

  const paginatedData = entradas.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        {titulo}
      </Typography>
      <Box sx={{ width: '100%' }}>
        {paginatedData.map((item) => (
          <Paper
            key={item.id}
            elevation={3}
            sx={{
              padding: '15px',
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="subtitle2" color="textSecondary">
              {
                new Date(item.created_at).toLocaleDateString() + ' ' + new Date(item.created_at).toLocaleTimeString()
              }
            </Typography>
            <Typography variant="body1">
              {item.entrada_texto}
            </Typography>
          </Paper>
        ))}
      </Box>
      <Pagination
        count={Math.ceil(entradas.length / rowsPerPage)}
        page={page}
        onChange={handleChangePage}
        color="primary"
        sx={{ marginTop: '20px' }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={ () => navigate(-1) }
        >
          Volver
        </Button>
      </Box>
      {/* <Button
        variant="contained"
        startIcon={<ArrowBackIcon />}
        onClick={handleBackClick}
        sx={{ alignSelf: 'flex-start', marginBottom: '20px' }}
      > 
        Volver
      </Button>*/}
    </Box>
  );
};

export default TextListComponent;