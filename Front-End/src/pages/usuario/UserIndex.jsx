import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableHead, TableCell, TableRow, TableBody, Button, styled, Tooltip, IconButton, Typography, Hidden, Box, Pagination, TableContainer, Paper, TextField } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ForwardToInboxOutlinedIcon from '@mui/icons-material/ForwardToInboxOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import axios, { csrf } from '../../api/api';
import UserDelete from './UserDelete';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const StyledTable = styled(Table)(({ theme }) => ({
    width: '90%',
    margin: '50px 0 0 50px',
    [theme.breakpoints.up('lg')]: {
        maxWidth: '1200px',
        margin: 'auto',
    },
}));

const THead = styled(TableRow)`
    & > th {
        font-size: 20px;
        background: #000000;
        color: #FFFFFF;
        text-align: center;
    }
`;
// const TRow = styled(TableRow)`
//     & > td {
//         font-size: 18px;
//         overflow: hidden;
//         text-overflow: ellipsis;
//         text-align: center;
//     }
// `;
const TRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '& > td': {
        fontsize: '18px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textAlign: 'center',
        fontSize: '18px',
    }
}));

const IconCell = styled(TableCell)`
    padding: 6px;
    text-align: center;
    width: 3.5em;
`;

// const StyledButton = styled(Button)`
//     width: 100%;
//     margin-bottom: 10px;
// `;

const UserIndexComponent = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [usuarioToDelete, setUsuarioToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    //---paginado---
    const [page, setPage] = useState(1);
    const rowsPerPage = 7;

    const handleChangePage = (event, value) => {
        event.preventDefault();
        setPage(value);
    };

    const filteredUsuarios = usuarios.filter(usuario =>
        usuario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.created_at.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    const paginatedData = filteredUsuarios.slice((page - 1) * rowsPerPage, page * rowsPerPage);
    //---fin paginado---

    const fetchUsuarios = async () => {
        try {
            await csrf();
            const response = await axios.get('/api/users');
            setUsuarios(response.data);
        } catch (error) {
            console.error(error);
            // toast.error("Ha ocurrido un error.", {
            //     onClose: () => navigate(-1)
            // });
        } finally {
            setLoading(false);
        }
    };

    const resendEmailVerification = async (id) => {
        try {
            await csrf();
            const promesie = axios.post(`/email/verification-notification-admin/${id}`);
            await toast.promise(
                promesie,
                {
                    pending: 'Enviando link de verificación...',
                    success: 'Correo enviado con éxito.',
                    error: 'Hubo un error al enviar el correo.',
                }
            );
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const handleDeleteClick = (id) => {
        setUsuarioToDelete(id);
        setOpenDialog(true);
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
        setUsuarioToDelete(null);
    };

    const handleRemoveUsuario = (id) => {
        setUsuarios(usuarios.filter(usuario => usuario.id !== id));
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    if (loading) {
        return <Loading open={loading} />;
    }

    return (
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
                Lista de Usuarios
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
                        <TableCell style={{ maxWidth: '200px' }}>Nombre</TableCell>
                        <TableCell>Rol</TableCell>
                        <Hidden smDown>
                            <TableCell style={{ maxWidth: '200px' }}>Correo🔗</TableCell>
                            <TableCell>Verificado</TableCell>
                            <TableCell>Ingreso</TableCell>
                        </Hidden>
                        <IconCell>Editar</IconCell>
                        <IconCell>Borrar</IconCell>
                        <IconCell>Email</IconCell>
                    </THead>
                </TableHead>
                <TableBody>
                    {paginatedData.map((usuario) => (
                        <TRow key={usuario.id}>
                            <TableCell>{usuario.id}</TableCell>
                            <TableCell style={{ maxWidth: '200px' }}>{usuario.name}</TableCell>
                            <TableCell>{usuario.role}</TableCell>
                            <Hidden smDown>
                                <TableCell style={{ maxWidth: '200px' }}>
                                    <a href={`mailto:${usuario.email}`}>{usuario.email}</a>
                                </TableCell>
                                <TableCell>
                                    <Typography color={usuario.email_verified_at ? "textSecondary" : "error"}>
                                        {usuario.email_verified_at ? "Sí" : "No"}
                                    </Typography>
                                </TableCell>
                                <TableCell>{new Date(usuario.created_at).toLocaleDateString()}</TableCell>
                            </Hidden>
                            <IconCell>
                                <Tooltip title="Editar">
                                    <IconButton
                                        size="large"
                                        color="primary" aria-label="Editar"
                                        component={Link} to={`/usuario/perfil/${usuario.id}`}
                                    >
                                        <EditNoteIcon style={{ fontSize: '1.5em' }} />
                                    </IconButton>
                                </Tooltip>
                            </IconCell>
                            <IconCell>
                                <Tooltip title="Borrar">
                                    <IconButton
                                        size="large"
                                        color="error" aria-label="Borrar"
                                        onClick={() => handleDeleteClick(usuario.id)}
                                    >
                                        <DeleteOutlineOutlinedIcon style={{ fontSize: '1.5em' }} />
                                    </IconButton>
                                </Tooltip>
                            </IconCell>
                            <IconCell>
                                {!usuario.email_verified_at && (
                                    <Tooltip title="Reenviar email de verificación">
                                        <IconButton
                                            size="large"
                                            color="secondary" aria-label="Enviar"
                                            onClick={() => resendEmailVerification(usuario.id)}
                                        >
                                            <ForwardToInboxOutlinedIcon style={{ fontSize: '1.5em' }} />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </IconCell>
                        </TRow>
                    ))}
                </TableBody>
            </StyledTable>
            <Pagination
                count={Math.ceil(usuarios.length / rowsPerPage)}
                page={page}
                onChange={handleChangePage}
                color="primary"
                sx={{ marginTop: '20px' }}
            />
            <Box display="flex" justifyContent="center" gap="20px" margin="30px">
                <Button color="info" startIcon={<ArrowBackIcon />} variant="contained" onClick={() => navigate(-1)}>Volver</Button>
                <Button color="primary" variant="contained" component={Link} to="/usuario/register">Agregar Usuario</Button>
            </Box>
            <UserDelete
                open={openDialog}
                onClose={handleCancelDelete}
                userId={usuarioToDelete}
                removeUsuario={handleRemoveUsuario}
            />
        </TableContainer>
    );
};

export default UserIndexComponent;
