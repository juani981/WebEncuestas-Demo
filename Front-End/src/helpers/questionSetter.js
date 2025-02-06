import { getData } from "./apiFetch";

export const questionParse = (rawData) => {
  //Se mapea entre la BD y los datos que usa la app
  const map = {
    id: "id_pregunta",
    title: "titulo_pregunta",
    type: "tipo_pregunta",
    //rating : 'puntuacion',
    options: "seleccion",
    range: "rango_puntuacion",
    required: "es_obligatoria",
  };
  rawData.map();
};
