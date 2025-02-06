import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableHead, TableCell, TableRow, TableBody, styled, Tooltip, IconButton, Typography, TableContainer, Paper, Pagination, Box, Button, TextField } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
// import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
// import PreviewIcon from '@mui/icons-material/Preview';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import IosShareIcon from '@mui/icons-material/IosShare';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
// import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import axios, { csrf } from '../../api/api';
import SurveyDelete from './SurveyDelete';
import SurveyFinish from './SurveyFinish';
import EmailShare from './EmailShare';
import Loading from '../../components/Loading';
import { useAuth } from "../../context/AuthContext";
// import { PaperWrapper } from '../../components/PaperWrapper';
import { useNavigate } from "react-router-dom";

const StyledTable = styled(Table)(({ theme }) => ({
    width: '90%',
    margin: '50px',
    [theme.breakpoints.up('lg')]: {
        maxWidth: '1400px',
        margin: 'auto',
    },
}));
const THead = styled(TableRow)`
    & > th {
        font-size: 1.05rem;
        background: #000000;
        color: #FFFFFF;
        min-width: 50px;
    }
`;
// const TRow = styled(TableRow)`
//     & > td {
//         font-size: 1.02rem;
//     }
// `;

const TRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '& > td': {
        fontsize: '1.02rem',
    }
}));

const IconCell = styled(TableCell)`
    padding: 6px;
    text-align: center;
    width: 3.5em;
`;

const SurveyIndexComponent = () => {
    const [encuestas, setEncuestas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialogDelete, setOpenDialogDelete] = useState(false);
    const [openDialogFinish, setOpenDialogFinish] = useState(false);
    const [openDialogShare, setOpenDialogShare] = useState(false);
    const [encuestaSelec, setEncuestaSelec] = useState(null);
    const [encuestaPrivada, setEncuestaPrivada] = useState(false);
    const [tituloShare, setTituloShare] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    //---paginado---
    const [page, setPage] = useState(1);
    const rowsPerPage = 7;

    const handleChangePage = (event, value) => {
        event.preventDefault();
        setPage(value);
    };

    const filteredEncuestas = encuestas.filter(encuesta =>
        encuesta.titulo_encuesta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        encuesta.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        encuesta.updated_at.toLowerCase().includes(searchTerm.toLowerCase()) ||
        encuesta.user.name.toLowerCase().includes(searchTerm.toLowerCase()) 
    );

    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    const paginatedData = filteredEncuestas.slice((page - 1) * rowsPerPage, page * rowsPerPage);
    //---fin paginado---

    const fetchEncuestas = async () => {
        try {
            await csrf();
            const response = await axios.get('/api/encuestas');
            setEncuestas(response.data);
        } catch (error) {
            console.error(error);
            // toast.error("Se ha producido un error.", {
            //     onClose: () => navigate('/')
            // });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEncuestas();
    }, []);

    const handleDeleteClick = (id) => {
        setEncuestaSelec(id);
        setOpenDialogDelete(true);
    };

    const handleFinishClick = (id) => {
        setEncuestaSelec(id);
        setOpenDialogFinish(true);
    };

    const handleShareClick = (id, titulo, privada) => {
        setEncuestaSelec(id);
        setTituloShare(titulo);
        setEncuestaPrivada(privada);
        setOpenDialogShare(true);
    };

    const handleCancel = () => {
        setOpenDialogDelete(false);
        setOpenDialogFinish(false);
        setOpenDialogShare(false);
        setEncuestaSelec(null);
    };

    const handleRemoveEncuesta = (id) => {
        setEncuestas(encuestas.filter(encuesta => encuesta.id !== id));
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    if (loading) {
        return <Loading open={loading} />;
    }

    if (!encuestas) {
        return <Typography variant='subtitle1' sx={{ margin: 3, fontSize: '1.2rem', textAlign: 'center' }}>(No hay encuestas para mostrar)</Typography>
    }

    return (
        // hacer horizontalmente srollable a PaperWrapper 
        <TableContainer component={Paper}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: '1600px',
                margin: '0 auto',
                padding: '20px',
            }}>
            <Typography variant="h6" component="h2" marginBottom={2} color="textSecondary">
                Lista de Encuestas
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <SearchIcon color='primary' />
                <TextField
                    label="Buscar..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ width: '400px', marginLeft: '10px' }}
                />
            </Box>
            <StyledTable>
                <TableHead>
                    <THead>
                        <TableCell>ID</TableCell>
                        <TableCell>Título</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Creador</TableCell>
                        <TableCell>Editada</TableCell>
                        <IconCell>Ver/Editar</IconCell>
                        <IconCell>Compartir</IconCell>
                        <IconCell>Informe</IconCell>
                        <IconCell>Borrar</IconCell>
                        <IconCell>Comentarios</IconCell>
                    </THead>
                </TableHead>
                <TableBody>
                    {paginatedData.map((encuesta) => (
                        <TRow key={encuesta.id}>
                            <TableCell>{encuesta.id}</TableCell>
                            <TableCell>{encuesta.titulo_encuesta}</TableCell>
                            {encuesta.es_finalizada
                                ? <TableCell className="text-danger">finalizada</TableCell>
                                : <TableCell>
                                    {encuesta.estado + (encuesta.es_privada ? ' privada' : '') + (encuesta.es_anonima ? ' anónima' : '')}
                                </TableCell>
                            }
                            <TableCell>{encuesta.user.name}</TableCell>
                            <TableCell>{new Date(encuesta.updated_at).toLocaleDateString()}</TableCell>
                            {/* <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={3}> */}
                            {encuesta.estado === 'borrador'
                                ? (
                                    <>
                                        <IconCell>
                                            <Tooltip title="Editar">
                                                <IconButton
                                                    size="large"
                                                    color="primary" aria-label="Editar"
                                                    disabled={!user || !['Super', 'Administrador', 'Editor'].includes(user.role)}
                                                    component={Link} to={`/encuesta/editar/${encuesta.id}`}
                                                >
                                                    <EditNoteIcon style={{ fontSize: '1.5em' }} />
                                                </IconButton>
                                            </Tooltip>
                                        </IconCell>
                                        <IconCell>
                                            <Tooltip title="Publicar...">
                                                <IconButton
                                                    color="secondary" aria-label="Publicar"
                                                    component={Link} to={`/encuesta/${encuesta.id}/preview`}
                                                >
                                                    <AddCircleOutlineOutlinedIcon style={{ fontSize: '1.5em' }} />
                                                </IconButton>
                                            </Tooltip>
                                        </IconCell>

                                        <IconCell>
                                        </IconCell>

                                        <IconCell>
                                            <Tooltip title="Borrar">
                                                <IconButton
                                                    color="error" aria-label="Borrar"
                                                    disabled={!user || !['Super', 'Administrador', 'Editor'].includes(user.role)}
                                                    onClick={() => handleDeleteClick(encuesta.id)}
                                                >
                                                    <DeleteOutlineOutlinedIcon style={{ fontSize: '1.5em' }} />
                                                </IconButton>
                                            </Tooltip>
                                        </IconCell>

                                        <IconCell>
                                        </IconCell>
                                    </>
                                ) : (
                                    <>
                                        <IconCell>
                                            <Tooltip title="Visualización y Propiedades">
                                                <IconButton
                                                    color="info" aria-label="Ver"
                                                    component={Link} to={`/encuesta/${encuesta.id}/preview`}
                                                >
                                                    <VisibilityOutlinedIcon style={{ fontSize: '1.5em' }} />
                                                </IconButton>
                                            </Tooltip>
                                        </IconCell>
                                        <IconCell>
                                            {!encuesta.es_finalizada && (
                                                <Tooltip title="Compartir...">
                                                    <IconButton
                                                        color="secondary" aria-label="Compartir"
                                                        // disabled={encuesta.es_finalizada}
                                                        onClick={() => handleShareClick(encuesta.id, encuesta.titulo_encuesta, encuesta.es_privada)}
                                                    >
                                                        <IosShareIcon style={{ fontSize: '1.5em' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </IconCell>
                                        <IconCell>
                                            <Tooltip title="Generar Informe">
                                                <IconButton
                                                    color="info" aria-label="Informe"
                                                    component={Link} to={`/informe/${encuesta.id}`}
                                                >
                                                    <SummarizeOutlinedIcon style={{ fontSize: '1.5em' }} />
                                                </IconButton>
                                            </Tooltip>
                                        </IconCell>
                                        {encuesta.es_finalizada
                                            ? (
                                                <IconCell>
                                                    <Tooltip title="Borrar">
                                                        <IconButton
                                                            color="error" aria-label="Borrar"
                                                            disabled={!user || !['Super', 'Administrador', 'Editor'].includes(user.role)}
                                                            onClick={() => handleDeleteClick(encuesta.id)}
                                                        >
                                                            <DeleteOutlineOutlinedIcon style={{ fontSize: '1.5em' }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </IconCell>
                                            ) : (
                                                <IconCell>
                                                    <Tooltip title="Finalizar">
                                                        <IconButton
                                                            color="warning" aria-label="Finalizar"
                                                            onClick={() => handleFinishClick(encuesta.id)}
                                                        >
                                                            <CancelOutlinedIcon style={{ fontSize: '1.5em' }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </IconCell>
                                            )}
                                        {encuesta.estado === 'piloto' ? (
                                            <IconCell>
                                                <Tooltip title="Comentarios">
                                                    <IconButton
                                                        color="success" aria-label="Comentarios"
                                                        component={Link} to={`/feedback/${encuesta.id}`}
                                                        disabled={!encuesta.tiene_mensajes}
                                                    >
                                                        <MessageOutlinedIcon style={{ fontSize: '1.5em' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </IconCell>
                                        ) : 
                                        (<IconCell></IconCell>)}
                                    </>
                                )}

                            {/* <StyledButton 
                                                    color="primary" variant="contained" 
                                                    disabled={!user || !['Super', 'Administrador', 'Editor'].includes(user.role)} 
                                                    component={Link} to={`/encuesta/editar/${encuesta.id}`}
                                                >
                                                        Editar
                                                </StyledButton>
                                                <StyledButton color="secondary" variant="contained" component={Link} to={`/encuesta/${encuesta.id}/preview`}>Publicar</StyledButton>
                                                <StyledButton 
                                                    color="error" variant="contained"
                                                    disabled={!user || !['Super', 'Administrador', 'Editor'].includes(user.role)} 
                                                    onClick={() => handleDeleteClick(encuesta.id)}
                                                >
                                                        Eliminar
                                                </StyledButton> */}

                            {/* {(encuesta.estado === 'piloto' || encuesta.estado === 'publicada') && (
                                        <>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <StyledButton color="primary" variant="contained" component={Link} to={`/encuesta/${encuesta.id}/preview`}>Preview</StyledButton>
                                            </Grid>
                                            {!encuesta.es_finalizada && (
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <StyledButton color="secondary" variant="contained" onClick={() => handleShareClick(encuesta.id, encuesta.es_privada)}>Compartir</StyledButton>
                                                </Grid>
                                            )}
                                            {!encuesta.es_finalizada && (
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <StyledButton color="warning" variant="contained" onClick={() => handleFinishClick(encuesta.id)}>Finalizar</StyledButton>
                                                </Grid>
                                            )}
                                            {encuesta.es_finalizada && (
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <StyledButton color="error" variant="contained"  disabled={!user || !['Super', 'Administrador', 'Editor'].includes(user.role)} onClick={() => handleDeleteClick(encuesta.id)}>Eliminar</StyledButton>
                                                </Grid>
                                            )}
                                            <Grid item xs={12} sm={6} md={3}>
                                                <StyledButton color="info" variant="contained" component={Link} to={`/encuesta/${encuesta.id}/informe`}>Informe</StyledButton>
                                            </Grid>
                                            {encuesta.estado === 'piloto' && (
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <StyledButton color="success" variant="contained" component={Link} to={`/feedback/${encuesta.id}`}>Comentarios</StyledButton>
                                                </Grid>
                                            )}
                                        </>
                                    )} */}
                        </TRow>
                    ))}
                </TableBody>
            </StyledTable>
            <Pagination
                count={Math.ceil(encuestas.length / rowsPerPage)}
                page={page}
                onChange={handleChangePage}
                color="primary"
                sx={{ marginTop: '20px' }}
            />
            <Box display="flex" justifyContent="center" gap="20px" margin="30px">
                <Button color="info" startIcon={<ArrowBackIcon />} variant="contained" onClick={() => navigate(-1)}>Volver</Button>
                <Button color="primary" variant="contained" disabled={!user || !['Super', 'Administrador', 'Editor'].includes(user.role)} component={Link} to="/encuesta/crear">Agregar Encuesta</Button>
            </Box>
            <SurveyDelete
                open={openDialogDelete}
                onClose={handleCancel}
                encuestaId={encuestaSelec}
                removeEncuesta={handleRemoveEncuesta}
            />
            <SurveyFinish
                open={openDialogFinish}
                onClose={handleCancel}
                encuestaId={encuestaSelec}
                fetchEncuestas={fetchEncuestas}
            />
            <EmailShare
                open={openDialogShare}
                onClose={handleCancel}
                encuestaId={encuestaSelec}
                titulo={tituloShare}
                esPrivada={encuestaPrivada}
            />
        </TableContainer>
    );
};

export default SurveyIndexComponent;
