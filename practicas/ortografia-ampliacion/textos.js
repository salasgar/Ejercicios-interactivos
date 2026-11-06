// Ortografía: ampliación. Textos propios (tarea 139). La práctica va siempre en español;
// solo `nombre` y `detalle` de cada ejercicio llevan también inglés («Spanish spelling: …»),
// porque los usan la portada y la tarea semanal. Cada introducción empieza diciendo que esto
// es más de lo que se pide en 1.º, para que el alumno sepa que está en la ampliación; lo demás
// lo dice la explicación de cada ítem (logica.js).
// Los textos comunes de la ortografía están en ../_comun/ortografia.js (TXO).

const mismo = texto => ({ es: texto, en: texto });
const AMPLIACION = '<p class="aviso-ampliacion"><b>Ampliación:</b> esto es más de lo que se pide en 1.º de ESO. Si te sale bien, vas muy por delante.</p>';

export const TX = {
  porques: {
    nombre: { es: 'porque, por qué, porqué, por que', en: 'Spanish spelling: the four «porque»' },
    detalle: { es: 'la causa, la pregunta, el motivo y «optar por que»', en: 'cause, question, reason and «optar por que»' },
    introduccion: mismo(`${AMPLIACION}
      <p><b>porque</b> da la causa: <i>Llego tarde <b>porque</b> había atasco.</i></p>
      <p><b>por qué</b> pregunta, con ¿? o sin ellos: <i>Me pregunto <b>por qué</b> llora.</i></p>
      <p><b>porqué</b> es un nombre, «el motivo», y lleva delante el, un, su…: <i>No entiendo <b>el porqué</b>.</i></p>
      <p><b>por que</b> es «por» + «que» detrás de palabras que piden «por»: <i>Optaron <b>por que</b> fuera el sábado</i> (optar por algo).</p>`),
  },
  verbos: {
    nombre: { es: 'Formas verbales que se escriben mal', en: 'Spanish spelling: verb forms that get misspelt' },
    detalle: { es: 'dijiste, anduve, conduje, hubo, prevé…', en: 'dijiste, anduve, conduje, hubo, prevé…' },
    introduccion: mismo(`${AMPLIACION}
      <p>Hay formas de los verbos que se oyen mucho pero están mal: <i>dijistes, andé, conducí, haiga</i>.
      Lo correcto es <b>dijiste, anduve, conduje, haya</b>.</p>
      <p>Y una de gramática: cuando «haber» dice que algo existe, va <b>siempre en singular</b>: <i><b>hubo</b> dos accidentes, <b>había</b> muchos niños</i>.</p>`),
  },
  siglas: {
    nombre: { es: 'Siglas, abreviaturas y prefijos', en: 'Spanish spelling: acronyms, abbreviations and prefixes' },
    detalle: { es: 'DNI, las ONG, pág., exalumno, sub-21…', en: 'DNI, las ONG, pág., exalumno, sub-21…' },
    introduccion: mismo(`${AMPLIACION}
      <p>Las <b>siglas</b> van en mayúsculas, sin puntos y sin -s en plural: <i>el DNI, las ONG</i>.
      Las <b>abreviaturas</b>, con su punto y su tilde: <i>pág., Sr., etc.</i></p>
      <p>Los <b>prefijos</b> van pegados: <i>exalumna, antivirus</i>; separados si afectan a dos palabras (<i>ex primer ministro</i>),
      y con guion delante de una cifra o de una mayúscula (<i>sub-21</i>).</p>`),
  },
  avanzada: {
    nombre: { es: 'Puntuación avanzada', en: 'Spanish spelling: advanced punctuation' },
    detalle: { es: 'la raya, el punto y coma, comillas y paréntesis', en: 'the dash, the semicolon, quotes and brackets' },
    introduccion: mismo(`${AMPLIACION}
      <p>En los diálogos se usa la <b>raya</b> (—), pegada a lo que dice el personaje: <i>—Ya voy —dijo Hugo.</i></p>
      <p>El <b>punto</b> va fuera del paréntesis y de las comillas: <i>(por fin). «Prohibido el paso».</i></p>
      <p>El <b>punto y coma</b> separa partes que ya llevan comas: <i>Ana, de Lorca; Hugo, de Cieza.</i></p>`),
  },
};
