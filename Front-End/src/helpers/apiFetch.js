import axios from "../api/api";
import { mapper } from "../helpers/mapper";
import { preguntaMap, respuestaMap } from "../helpers/maps";

const csrf = () => axios.get("/sanctum/csrf-cookie");

export const fetchUsuario = async () => {};
export const fetchEncuesta = async (encuestaId) => {
  try {
    await csrf();
    const response = await axios.get(`/api/encuestas/${encuestaId}/edit`);
    const encuestaData = response.data;
    return encuestaData;
  } catch (error) {
    if (error.message === "Resource not found (404)") {
      console.error("No se encontró la encuesta:", error.message);
    } else {
      console.error("Error:", error.message);
    }
  }
};
export const fetchPreguntas = async (encuestaId) => {
  try {
    //await csrf();
    const response = await axios.get(`/api/encuestas/${encuestaId}/preguntas`);
    const Questions = await response.data;
    const mappedQuestions = mapper.map(Questions, preguntaMap);
    console.log(mappedQuestions);
    return mappedQuestions;
  } catch (error) {
    console.error(error);
  }
};
export const fetchInformes = async (encuestaId) => {
  try {
    //await csrf();
    const response = await axios.get(`/api/informes/${encuestaId}`);
    const reports = await response.data;
    console.log(reports);
    return reports;
    //setreports(mappedreports);
    //setLoading(false);
  } catch (error) {
    console.error(error);
  }
};
