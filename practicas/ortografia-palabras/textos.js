// Ortografía: palabras que se confunden. Textos propios (tarea 138). La práctica va siempre
// en español; solo `nombre` y `detalle` de cada ejercicio llevan también inglés («Spanish
// spelling: …»), porque los usan la portada y la tarea semanal. Las introducciones dicen la
// regla y un ejemplo; lo demás lo dice la explicación de cada ítem (logica.js).
// Los textos comunes de la ortografía están en ../_comun/ortografia.js (TXO).

const mismo = texto => ({ es: texto, en: texto });

export const TX = {
  juntas: {
    nombre: { es: '¿Junto o separado?', en: 'Spanish spelling: one word or two?' },
    detalle: { es: 'sino / si no, también / tan bien, a veces…', en: 'sino / si no, también / tan bien, a veces…' },
    introduccion: mismo(`<p>Algunas palabras se escriben <b>juntas</b> o <b>separadas</b> según lo que quieren decir:
      <i>No es rojo, <b>sino</b> azul</i> (contrapone) frente a <i><b>Si no</b> vienes, me voy</i> (una condición).</p>
      <p>Otras se escriben <b>siempre igual</b>: <i>a veces, de repente, por favor</i> van separadas; <i>adelante, conmigo</i>, juntas.</p>
      <p><b>Truco:</b> lee la frase entera con cada opción y piensa qué quiere decir.</p>`),
  },
  homofonos: {
    nombre: { es: 'Suenan igual, se escriben distinto', en: 'Spanish spelling: sound-alikes' },
    detalle: { es: 'tubo / tuvo, hola / ola, vaya / valla…', en: 'tubo / tuvo, hola / ola, vaya / valla…' },
    introduccion: mismo(`<p>Hay palabras que <b>suenan igual</b> pero se escriben distinto porque <b>significan</b> cosas distintas:
      <i>el fontanero cambió el <b>tubo</b></i> (un cilindro) frente a <i>mi tía <b>tuvo</b> gemelos</i> (del verbo tener).</p>
      <p><b>Truco:</b> piensa qué significa la palabra en esa frase; si es un verbo, de qué verbo viene (tener → tuvo, ir → vaya).</p>`),
  },
  numeros: {
    nombre: { es: 'Números y símbolos', en: 'Spanish spelling: numbers and symbols' },
    detalle: { es: 'veinticinco, cien / ciento, 5 kg, 2026…', en: 'veinticinco, cien / ciento, 5 kg, 2026…' },
    introduccion: mismo(`<p>Del 16 al 29, los números se escriben en <b>una sola palabra</b>: <i>dieciséis, veinticinco</i>. Las centenas, también: <i>doscientos, quinientos</i>.</p>
      <p>Delante de un nombre se dice <b>cien</b> (<i>cien euros</i>), y delante de otro número, <b>ciento</b> (<i>ciento veinte</i>). Los años van <b>sin punto</b>: <i>2026</i>.</p>
      <p>Los <b>símbolos</b> no llevan punto ni plural y van detrás del número: <i>5 kg, 30 min, 3 €</i>.</p>`),
  },
};
