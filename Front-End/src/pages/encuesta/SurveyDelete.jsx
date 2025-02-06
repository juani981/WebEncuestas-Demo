import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios, { csrf } from '../../api/api';
import { toast } from 'react-toastify';

const SurveyDelete = ({ open, onClose, encuestaId, removeEncuesta }) => {

     

    const deleteEncuesta = async (id) => {
        try {
            // Eliminar encuesta de la lista sin recargar
            if (removeEncuesta) {
                removeEncuesta(id);
            }
            await csrf();
            const response = await axios.delete(`/api/encuestas/${id}`);
            toast.success("La encuesta se eliminó.");
        } catch (error) {
            toast.error("No se pudo eliminar la encuesta.");
            console.error(error);
        }
    };

    const handleConfirmDelete = () => {
        deleteEncuesta(encuestaId);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogContent>
                ¿Estás seguro de que deseas eliminar esta encuesta?
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

export default SurveyDelete;
