import {Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios, { csrf } from '../../api/api';
import { toast } from 'react-toastify';

const UserDelete = ({ open, onClose, userId, removeUsuario}) => {

     

    const deleteEncuesta = async (id) => {
        try {
            if (removeUsuario) {
                removeUsuario(id);
            }
            await csrf();
            const response = await axios.delete(`/api/users/${id}`);
            toast.success("Se eliminó el usuario.")
        } catch (error) {
            toast.error("No se pudo eliminar el usuario.");
            console.error(error);
            // console.error(error.response?.data.message);
        }
    };

    const handleConfirmDelete = () => {
        deleteEncuesta(userId);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogContent>
                ¿Estás seguro de que deseas eliminar este usuario?
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

export default UserDelete;
