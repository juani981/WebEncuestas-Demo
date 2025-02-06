//map convierte de Backend a FrontEnd
//reverse map convierte de Frontend a Backend

export const preguntaMap = {
  id: "id",
  id_encuesta: "encuesta_id",
  order_index: "id_orden",
  title: "titulo_pregunta",
  type: "tipo_pregunta",
  options: "seleccion",
  range: "rango_puntuacion",
  required: "es_obligatoria",
};

export const respuestaMap = {
  //id_orden: "id_orden",
  //id: "id",
  id_pregunta: "pregunta_id",
  id_encuesta: "encuesta_id",
  //id_encuestado: "encuestado_id",
  options: "seleccion",
  score: "puntuacion",
  text_entry: "entrada_texto",
  numeric: "valor_numerico",
};
