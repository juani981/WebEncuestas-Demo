import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Grid, List, ListItem, IconButton, ListItemText, FormControl, Input } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import LibraryAddCheckOutlinedIcon from '@mui/icons-material/LibraryAddCheckOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import axios, { csrf } from '../../api/api';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';

const EmailShare = ({ open, onClose, encuestaId, titulo, esPrivada }) => {

    const [poolContactos, setPoolContactos] = useState([]);
    const [contactos, setContactos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [correosNuevos, setCorreosNuevos] = useState("");
    const navigate = useNavigate();



    useEffect(() => {
        if (!encuestaId) return;
        const fetchContactos = async () => {
            setLoading(true);
            try {
                await csrf();
                const response = await axios.get(`/api/encuestados_sin_responder/${encuestaId}`);
                // Agregar temp_id a cada contacto
                const contactosConTempId = response.data.map((contacto, index) => ({
                    ...contacto,
                    temp_id: index + 1
                }));
                if (esPrivada) {
                    setContactos(contactosConTempId);
                    setPoolContactos([]);
                } else {
                    setContactos([]);
                    setPoolContactos(contactosConTempId);
                }
            } catch (error) {
                console.error(error);
                // toast.error("Se ha producido un error.", {
                //     onClose: () => onClose()
                // });
                onClose();
            } finally {
                setLoading(false);
            }
        };
        fetchContactos();
    }, [encuestaId]);

    const sendEmails = async (id) => {
        try {
            await csrf();
            const response = axios.post(`/api/encuestas/${id}/enviar_correos`, contactos);
            // toast.success(response.data.message);
            await toast.promise(
                response,
                {
                    pending: 'Enviando correos...',
                    success: 'Correos enviados con éxito.',
                    // error: 'Hubo un error al enviar los correos.',
                }
            );
        } catch (error) {
            console.error(error);
            // toast.error("Se produjo un error al enviar los emails. Por favor, intentelo de nuevo.");
        }
    };

    const handleSendButton = () => {
        sendEmails(encuestaId);
        if (location.pathname !== '/encuesta') {
            navigate('/encuesta');
        } else {
            onClose();
        }
    };

    const handleRemoveContacto = (id) => {
        const contacto = contactos.find(contacto => contacto.temp_id === id);
        if (contacto.id) {
            setPoolContactos([...poolContactos, contacto]);
        }
        setContactos(contactos.filter(contacto => contacto.temp_id !== id));
    };

    const handleSelectContacto = (id) => {
        const contacto = poolContactos.find(contacto => contacto.temp_id === id);
        setContactos([...contactos, contacto]);
        setPoolContactos(poolContactos.filter(contacto => contacto.temp_id !== id));
    };

    const handleSelectAllContactos = () => {
        setContactos([...contactos, ...poolContactos]);
        setPoolContactos([]);
    };

    const handleDeselectAllContactos = () => {
        const contactosConId = contactos.filter(contacto => contacto.id);
        setPoolContactos([...poolContactos, ...contactosConId]);
        setContactos(contactos.filter(contacto => !contacto.id));
    };

    const handleAddContacto = (event) => {
        event.preventDefault();
        if (correosNuevos === "") return;

        const correos = correosNuevos.split(/[\s,]+/).filter(Boolean);

        const nuevosContactos = correos.map((correo, index) => ({
            correo: correo.trim(),
            temp_id: contactos.length ? Math.max(...contactos.map((c) => c.temp_id)) + index + 1 : index + 1,
        }));

        setContactos([...contactos, ...nuevosContactos]);
        setCorreosNuevos("");
    };

    // if (loading) {
    //     return <Loading open={loading} />;
    // }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ textAlign: 'center' }}>Compartir Encuesta {esPrivada ? 'Privada' : ''} Nro.{encuestaId} {titulo}</DialogTitle>
            <DialogContent>
                <Box sx={{ flexGrow: 1, }}>
                    <form className="my-3" onSubmit={handleAddContacto}>
                        <FormControl fullWidth>
                            <Input
                                required
                                value={correosNuevos}
                                onChange={(e) => setCorreosNuevos(e.target.value)}
                                placeholder="Agregar un nuevo contacto, o varios separados por coma o espacios..."
                            // inputProps={{
                            //     type: "email",
                            // }}
                            />
                            <IconButton edge="end" aria-label="agregar" type="submit">
                                <AddBoxIcon />
                            </IconButton>
                        </FormControl>
                    </form>
                    <Grid container spacing={2} justifyContent="center" >
                        {/* <Grid item xs={12} md={10}> */}
                        {esPrivada && (
                            <Grid item xs={12} md={6}>
                                <p>La encuesta se compartirá con la siguiente
                                    lista de contactos <strong>PRIVADOS</strong> pendientes de responder:</p>
                            </Grid>
                        )}
                        {!esPrivada && (
                            <Grid item xs={12} md={6}>
                                <h3><strong>Contactos Disponibles Pendientes</strong></h3>
                                <List dense={true}>
                                    {poolContactos.map((contacto) => (
                                        <ListItem key={contacto.temp_id}
                                            sx={{
                                                cursor: 'pointer',
                                                '&:hover': { backgroundColor: 'lavender' }
                                            }}
                                            onClick={() => handleSelectContacto(contacto.temp_id)}
                                            secondaryAction={
                                                <IconButton color='primary' edge="end" aria-label="Agregar">
                                                    <ArrowForwardOutlinedIcon />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemText
                                                primary={contacto.correo}
                                                primaryTypographyProps={{
                                                    noWrap: true,
                                                    sx: {
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        maxWidth: '300px',
                                                    }
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                {!poolContactos.length && <p>(la lista está vacía)</p>}
                            </Grid>
                        )}
                        <Loading open={loading} />
                        <Grid item xs={12} md={6}>
                            <h3><strong>Contactos Seleccionados</strong></h3>
                            <List dense={true}>
                                {contactos.map((contacto) => (
                                    <ListItem key={contacto.temp_id}
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': { backgroundColor: 'lavenderblush' }
                                        }}
                                        onClick={() => handleRemoveContacto(contacto.temp_id)}
                                        secondaryAction={
                                            <IconButton color='error' edge="end" aria-label="borrar">
                                                <ClearOutlinedIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText
                                            primary={contacto.correo}
                                            primaryTypographyProps={{
                                                noWrap: true,
                                                sx: {
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    maxWidth: '300px',
                                                }
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                            {!contactos.length && <p>(la lista está vacía)</p>}
                        </Grid>

                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start', ml: 4 }}>
                    <Button startIcon={<LibraryAddCheckOutlinedIcon />} onClick={handleSelectAllContactos} color="success">
                        Todos
                    </Button>
                    <Button startIcon={<IndeterminateCheckBoxOutlinedIcon />} onClick={handleDeselectAllContactos} color="error">
                        Ninguno
                    </Button>
                </Box>
                {esPrivada && (
                    <Button component={Link} to={`/contactos/${encuestaId}`} color="secondary">
                        Editar Miembros Privados
                    </Button>
                )}
                {!esPrivada && (
                    <Button component={Link} to={'/contactos'} color="secondary">
                        Editar Lista
                    </Button>
                )}
                <Button onClick={onClose} color="error">
                    Cancelar
                </Button>
                <Button onClick={handleSendButton} color="primary">
                    Enviar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EmailShare;
