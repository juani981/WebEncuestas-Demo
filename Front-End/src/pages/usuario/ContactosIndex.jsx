import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Table, TableHead, TableCell, TableRow, TableBody, Button, styled, Box, FormControl, Input, Checkbox, Typography, Paper, TextField } from '@mui/material';
import axios, { csrf } from '../../api/api';
import ContactosDelete from './ContactosDelete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';

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
        font-size: 18px;
        background: #000000;
        color: #FFFFFF;
        text-align: center;
    }
`;

// const TRow = styled(TableRow)`
//     & > td {
//         text-align: center;
//     }
// `;
const TRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '& > td': {
        textAlign: 'center',
    }
}));

const ContactosIndex = () => {
    const [contactos, setContactos] = useState([]);
    const [idsMiembrosPrivados, setIdsMiembrosPrivados] = useState([]);
    const [idsSeleccionados, setIdsSeleccionados] = useState([]);
    const [correosNuevos, setCorreosNuevos] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [hayCambios, setHayCambios] = useState(false);
    const navigate = useNavigate();
    const { encuestaId } = useParams();


    const fetchContactos = async () => {
        try {
            await csrf();
            const response = await axios.get('/api/encuestados_con_correo');
            const contactosConTempId = response.data.map((contacto, index) => ({
                ...contacto,
                temp_id: index + 1
            }));
            setContactos(contactosConTempId);

            //Selecciona miembros encuesta privada
            if (encuestaId) {
                const response = await axios.get('/api/miembros_privados/' + encuestaId);
                setIdsMiembrosPrivados(response.data);
                // Filtra y Mapea Seleccionados por contacto privado a la estructura { temp_id, id }
                const contactosFiltrados = contactosConTempId.filter(contacto => response.data.includes(contacto.id));
                const ids = contactosFiltrados.map(contacto => (
                    contacto.temp_id
                ));
                setIdsSeleccionados(ids);
            } else {
                setIdsSeleccionados([]);
            }
        } catch (error) {
            console.error(error);
            // toast.error("Ha ocurrido un error.", {
            //     onClose: () => navigate('/encuesta')
            // });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContactos();
    }, [encuestaId]);

    const handleCheckClick = (tempId) => {
        setIdsSeleccionados((prev) => {
            if (prev.some((c) => c === tempId)) { //c.id === contacto.id 
                return prev.filter((c) => c !== tempId);
            } else {
                return [...prev,
                    tempId
                ];
            }
        });
        if (encuestaId) setHayCambios(true);
    };

    const handleBackClick = () => {
        navigate(-1); // Navega a la ventana anterior
    };

    const handleDeleteClick = () => {
        setOpenDialog(true);
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
    };

    const handleRemoveUsuario = (ids) => {
        setContactos((prev) => prev.filter((c) => !ids.includes(c.temp_id))); // !ids.includes(c.id) && 
        setIdsSeleccionados([]);
        setOpenDialog(false);
    };

    const handleAddContacto = (event) => {
        event.preventDefault();
        if (correosNuevos === "") return;

        const correos = correosNuevos.split(/[\s,]+/).filter(Boolean);

        const nuevosContactos = correos.map((correo, index) => ({
            correo: correo.trim(),
            temp_id: contactos.length ? Math.max(...contactos.map((c) => c.temp_id)) + index + 1 : index + 1,
        }));

        setContactos([...nuevosContactos, ...contactos]);

        if (encuestaId) {
            setIdsSeleccionados((prev) =>
                [...prev, ...nuevosContactos.map(contacto => contacto.temp_id)]
            );
        }

        setHayCambios(true);
        setCorreosNuevos("");
    };

    const handleGuardarClick = async () => {
        await csrf();
        try {
            //Guardar Contactos Nuevos
            const nuevos = contactos.filter((c) => !c.id);
            const response1 = await axios.post('/api/encuestados', nuevos);
            if (encuestaId) {
                const contactosSeleccionados = contactos.filter((c) => idsSeleccionados.includes(c.temp_id));
                //Borrar Miembros Privados Des-seleccionados
                const ids = contactosSeleccionados.filter((c) => c.id).map((c) => c.id);
                const idsToDelete = idsMiembrosPrivados.filter((m) => !ids.includes(m));
                const response2 = await axios.delete(`/api/miembros_privados/${encuestaId}`, {
                    data: idsToDelete
                });
                //Agregar Miembros Privados Seleccionados
                const contactosToAdd = contactosSeleccionados.filter((c) => !c.id || (c.id && !idsMiembrosPrivados.includes(c.id)));
                const response3 = await axios.post(`/api/miembros_privados/${encuestaId}`, contactosToAdd);

                toast.info(response1.data.message + "\n" + response2.data.message + "\n" + response3.data.message);
            } else {
                toast.info(response1.data.message);
            }
            setHayCambios(false);
            fetchContactos();
        } catch (error) {
            console.error(error);
            toast.error("No se pudieron guardar los contactos.");
        }
    }

    if (loading) {
        return <Loading open={loading} />;
    } else {

        return (
            <Box sx={{ flexGrow: 1, maxWidth: 752, mx: 'auto', p: { xs: 2, sm: 3, md: 4 } }}>
                <Paper elevation={3} sx={{ position: 'sticky', top: 0, zIndex: 1, p: 1 }}>
                    <form onSubmit={handleAddContacto}>
                        <FormControl fullWidth>
                            <TextField
                                required
                                value={correosNuevos}
                                onChange={(e) => setCorreosNuevos(e.target.value)}
                                placeholder="Escribe un nuevo o nuevos correos separados por comas o espacios..."
                            />
                            <Button color="primary" type="submit" sx={{ mt: 2 }}>
                                Agregar ↵
                            </Button>
                        </FormControl>
                    </form>
                </Paper>
                <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                    <Typography textAlign={'center'} variant="h6" component="h2" marginBottom={2} color="textSecondary">
                        {encuestaId ? 'Encuesta Privada Nro. ' + encuestaId : 'Lista de Contactos'}
                    </Typography>
                    <StyledTable>
                        <TableHead>
                            <THead>
                                <TableCell>Verificado</TableCell>
                                <TableCell>Correos</TableCell>
                                {idsSeleccionados.length > 0 && (
                                    <TableCell>
                                        {encuestaId ? (
                                            <Button color="success" variant="contained" onClick={handleGuardarClick}>
                                                Agregar
                                            </Button>
                                        ) : (
                                            <Button color="error" variant="contained" onClick={handleDeleteClick}>
                                                Eliminar
                                            </Button>
                                        )}
                                    </TableCell>
                                )}
                            </THead>
                        </TableHead>
                        <TableBody>
                            {contactos.map((contacto) => {
                                const isItemSelected = idsSeleccionados.some((c) => c === contacto.temp_id);
                                return (
                                    <TRow
                                        hover
                                        onClick={() => handleCheckClick(contacto.temp_id)}
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={contacto.temp_id}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell sx={{ color: contacto.validacion || contacto.validacion === 0 ? '' : 'error.main' }}>
                                            {contacto.validacion || contacto.validacion === 0 ? contacto.validacion + ' Resp.' : 'pendiente'}
                                        </TableCell>
                                        <TableCell align="right">{contacto.correo}</TableCell>
                                        <TableCell padding="checkbox">
                                            <Checkbox color="primary" checked={isItemSelected} />
                                        </TableCell>
                                    </TRow>
                                );
                            })}
                        </TableBody>
                    </StyledTable>
                    <Box display="flex" justifyContent="space-evenly" mt={3}>
                        <Button color="info" startIcon={<ArrowBackIcon/>} variant="contained" onClick={handleBackClick}>
                            Volver
                        </Button>
                        {!encuestaId && (
                            <Button
                                color="error"
                                disabled={idsSeleccionados.length === 0}
                                variant="contained"
                                onClick={handleDeleteClick}
                            >
                                Eliminar Contactos Seleccionados
                            </Button>
                        )}
                        <Button
                            color="success"
                            disabled={!hayCambios || (!encuestaId && contactos.filter((c) => !c.id).length === 0) || (encuestaId && idsSeleccionados.length === 0)}
                            variant="contained"
                            onClick={handleGuardarClick}
                        >
                            Guardar Cambios
                        </Button>
                    </Box>
                </Paper>
                <ContactosDelete
                    open={openDialog}
                    onClose={handleCancelDelete}
                    listaContactos={contactos.filter(c => idsSeleccionados.includes(c.temp_id))}
                    removeUsuario={handleRemoveUsuario}
                />
            </Box>

        );
    }
};

export default ContactosIndex;
