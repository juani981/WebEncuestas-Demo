import { toast } from "react-toastify";
import axios from "../api/api";
import { mapper } from "../helpers/mapper";
import { preguntaMap, respuestaMap } from "../helpers/maps";

const csrf = () => axios.get("/sanctum/csrf-cookie");

export const postRespuestas = async (encuestaId, correo, comentarios, answers) => {
  const formattedAnswer = {
    respuestas: mapper.reverseMap(answers, respuestaMap), 
    correo: correo,
    comentarios: comentarios,
  };
  console.log(formattedAnswer);
  try {
    await axios.post(`/api/encuestas/${encuestaId}/responder`, formattedAnswer);
    toast.success("Se envió su respuesta!", {
      onClose: () => window.close()
    });
  } catch (e) {
    console.error(e);
  }
};
/*formato de respuesta                  
{
    "correo": "privado1",
    "respuestas": [
        {
        "pregunta_id": 1,
        "entrada_texto": "oa"
        },
        {
        "pregunta_id": 2,
        "seleccion": [0]
        }
    ]
    // "comentarios": "Están todas las preguntas bien planteadas los felicito por su gran redacción. 10/10 Gracias. Saludos."
}*/
export const postPreguntas = async (encuestaId, questions) => {
  const questionsData = questions.map((question) => {
    const conditionalID = question.id == null ? undefined : question.id;
    const questionData = {
      //No corresponde guardar con id, la BD le asigna automáticamente, pero ésto debería ser cambiado en el Back-End para que el front recupere el ID en caso de ya existir en la BD, y así evitar enviar preguntas repetidas.
      id: conditionalID,
      order_index: question.order_index,
      id_encuesta: encuestaId,
      title: question.title,
      type: question.type,
      options: question.options || [],
      range: question.range || [],
      required: question.required,
    };

    if (["multiple choice", "list", "unique choice"].includes(question.type)) {
      questionData.options = question.options;
    } else if (question.type === "range") {
      questionData.range = question.range;
    }
    return questionData;
  });
  const mappedQuestions = mapper.reverseMap(questionsData, preguntaMap);
    await csrf();
    await axios.post(`/api/encuestas/${encuestaId}/preguntas`, mappedQuestions);
    console.log("Preguntas mapeadas: ", mappedQuestions);
};
