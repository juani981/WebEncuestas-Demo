import {Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios, { csrf } from '../../api/api';
import { toast } from 'react-toastify';

const SurveyFinish = ({ open, onClose, encuestaId, fetchEncuestas}) => {

     

    const deleteEncuesta = async (id) => {
        try {
            await csrf();
            await axios.put(`/api/encuestas/${id}/finalizar`);
            if (fetchEncuestas) {
                await fetchEncuestas();
            }
            toast.success("Encuesta finalizada exitosamente.");
        } catch (error) {
            toast.error("No se pudo modificar la encuesta.");
            console.error(error);
        }
    };

    const handleConfirmDelete = () => {
        deleteEncuesta(encuestaId);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirmar Finalización</DialogTitle>
            <DialogContent>
                ¿Estás seguro de que deseas finalizar esta encuesta?
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancelar
                </Button>
                <Button onClick={handleConfirmDelete} color="warning">
                    Finalizar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SurveyFinish;
