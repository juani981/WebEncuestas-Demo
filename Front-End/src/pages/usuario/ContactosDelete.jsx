import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios, { csrf } from '../../api/api';
import { toast } from 'react-toastify';

const ContactosDelete = ({ open, onClose, listaContactos, removeUsuario }) => {

     

    const deleteContactos = async (contactos) => {
        try {
            const tempIds = contactos.map(contacto => contacto.temp_id);
            if (removeUsuario) {
                removeUsuario(tempIds);
            }
            const idsToDelete = contactos
                .filter(contacto => contacto && contacto.id)
                .map(contacto => contacto.id);
    
            await csrf();
            await axios.delete(`/api/encuestados/`, {
                data: idsToDelete
            });
            toast.success("Contactos eliminados exitosamente.");
        } catch (error) {
            toast.error("No se pudieron eliminar los contactos.");
            console.error(error);
            // console.error(error.response?.data.message);
        }
    };

    const handleConfirmDelete = () => {
        deleteContactos(listaContactos);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogContent>
                ¿Estás seguro de que deseas eliminar los contactos seleccionados?
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancelar
                </Button>
                <Button onClick={handleConfirmDelete} color="error">
                    Eliminar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ContactosDelete;
