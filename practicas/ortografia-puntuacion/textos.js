// Ortografía: puntuación y mayúsculas. Textos propios (tarea 137). La práctica va
// siempre en español; solo `nombre` y `detalle` de cada ejercicio llevan también inglés
// («Spanish spelling: …»), porque los usan la portada y la tarea semanal. Los textos
// comunes de la ortografía están en ../_comun/ortografia.js (TXO).

const mismo = html => ({ es: html, en: html });

export const TX = {
  mayusculas: {
    nombre: { es: 'Mayúsculas', en: 'Spanish spelling: capital letters' },
    detalle: { es: 'Toca las palabras con una mayúscula o una minúscula mal puesta', en: 'Spanish spelling: tap the words with a wrong capital or small letter' },
    instruccion: 'Toca las palabras que tienen una mayúscula o una minúscula mal puesta y pulsa «Comprobar».',
    introduccion: mismo(`<p>Llevan <b>mayúscula</b> la primera palabra de la frase (y la que sigue a un punto) y los <b>nombres propios</b>: <i>Marta</i>, <i>Murcia</i>, <i>España</i>.</p>
      <p>Llevan <b>minúscula</b> los nombres comunes, los <b>días</b>, los <b>meses</b>, las <b>estaciones</b> y los idiomas y gentilicios: <i>el lunes</i>, <i>en enero</i>, <i>en verano</i>, <i>murciano</i>, <i>inglés</i>.</p>
      <p>En cada frase hay de una a tres palabras mal escritas, y a veces la letra que sobra es una <b>mayúscula</b>. Toca solo las que estén mal.</p>`),
  },
  puntoComa: {
    nombre: { es: 'El punto y la coma', en: 'Spanish spelling: full stop and comma' },
    detalle: { es: 'Comas en las listas y tras los conectores; punto y mayúscula', en: 'Spanish spelling: commas in lists and after connectors; full stop and capital' },
    instruccion: '¿Cuál está bien escrita?',
    introduccion: mismo(`<p>En una <b>lista</b>, entre los elementos va coma, pero <b>no</b> delante de la «y» final: <i>Compré pan, leche y fruta.</i></p>
      <p>Después de un <b>punto</b> se empieza con mayúscula: <i>Llegué tarde. El profesor ya había empezado.</i></p>
      <p>Llevan coma <i>pero</i> y <i>sino</i> (<i>Quería ir, pero llovía</i>) y los conectores del principio (<i>Sin embargo, no fui</i>). En las tres frases solo cambian los signos: lee con calma.</p>`),
  },
  dosPuntos: {
    nombre: { es: 'Dos puntos, puntos suspensivos y el saludo', en: 'Spanish spelling: colon, ellipsis and greetings' },
    detalle: { es: 'Hola, Marta: (con dos puntos) y no «Hola Marta,»', en: 'Spanish spelling: «Hola, Marta:» (with a colon), not «Hola Marta,»' },
    instruccion: '¿Cuál está bien escrita?',
    introduccion: mismo(`<p>El saludo de una carta o de un correo lleva <b>dos puntos</b> y, después, <b>mayúscula</b>:</p>
      <p><i>Hola, Juan Luis:</i><br><i>He terminado la tarea.</i></p>
      <p>Los dos puntos anuncian también una lista o una cita (<i>Necesitas tres cosas: regla, compás y lápiz</i>). Los <b>puntos suspensivos</b> son <b>tres</b>, pegados a la palabra anterior. Y en un diálogo, la raya (—) se pega a la primera palabra.</p>`),
  },
  correos: {
    nombre: { es: 'El correo al profesor', en: 'Spanish spelling: an email to your teacher' },
    detalle: { es: 'Mensajes bien escritos, y qué va en el asunto y qué en el cuerpo', en: 'Spanish spelling: well-written messages, and what goes in the subject and in the body' },
    instruccion: '¿Cuál es el mensaje bien escrito?',
    instruccionAsunto: '¿Dónde va esto, en el asunto o en el cuerpo del correo?',
    introduccion: mismo(`<p>Un correo a tu profesor se escribe <b>entero</b>, sin abreviaturas del chat (<i>q</i>, <i>xq</i>, <i>tb</i>, <i>porfa</i>), con <b>mayúscula</b> al empezar, con las <b>tildes</b> y con <b>¿ ¡</b> al abrir.</p>
      <p>Lleva un saludo con dos puntos (<i>Hola, Juan Luis:</i>), lo que quieres decir y una despedida con coma y tu nombre debajo (<i>Un saludo,</i> / <i>Marta</i>).</p>
      <p>El <b>asunto</b> es el título, con pocas palabras (<i>Duda del ejercicio 4</i>). Lo que cuentas o preguntas va en el <b>cuerpo</b>.</p>`),
  },
};
