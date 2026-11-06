// Ortografía: las letras. Textos propios (los escribe la tarea 136). La práctica va
// siempre en español; solo `nombre` y `detalle` de cada ejercicio llevan también
// inglés («Spanish spelling: …»), porque los usan la portada y la tarea semanal.
// Los textos comunes de la ortografía están en ../_comun/ortografia.js (TXO).
// Las explicaciones de cada ítem (con su palabra) están en logica.js.

const mismo = texto => ({ es: texto, en: texto });

export const TX = {
  letra: '¿Qué letra va en el hueco?',
  letras: '¿Qué letras van en el hueco?',
  haches: {
    nombre: { es: 'hay, ahí, ay; a ver, haber', en: 'Spanish spelling: hay, ahí, ay; a ver, haber' },
    detalle: { es: 'Aquí hay un error; déjalo ahí; voy a ver si viene', en: 'Aquí hay un error; déjalo ahí; voy a ver si viene' },
    introduccion: mismo(`<p><b>hay</b> es del verbo <b>haber</b> y dice que algo existe: <i>hay pan, hay que madrugar</i>. Se puede cambiar por <i>había</i>.</p>
      <p><b>ahí</b> es un lugar: <i>déjalo ahí</i> (= allí). <b>ay</b> es un quejido: <i>¡ay, qué dolor!</i></p>
      <p><b>a ver</b> son dos palabras, la preposición <i>a</i> y el verbo <i>ver</i>: <i>vamos a ver si llega</i>. <b>haber</b> es el verbo entero, junto y con h: <i>va a haber examen, podría haber venido</i>.</p>
      <p>Cuando subas de nivel, también <b>a / ha</b>, <b>e / he</b>, <b>echo / hecho</b> y <b>habría / abría</b>.</p>`),
  },
  bv: {
    nombre: { es: '¿b o v?', en: 'Spanish spelling: b or v' },
    detalle: { es: 'cantaba, tuvo, también, invierno', en: 'cantaba, tuvo, también, invierno' },
    introduccion: mismo(`<p>La <b>b</b> y la <b>v</b> suenan igual. Se distinguen con reglas:</p>
      <p>Con <b>b</b>: <i>cantaba, jugaba</i> (imperfecto en -aba); <i>también, hombre</i> (después de m); <i>blanco, brazo</i> (bl, br); <i>escribir, recibir</i> (verbos en -bir); <i>iba</i> (de ir).</p>
      <p>Con <b>v</b>: <i>invierno, envidia</i> (después de n); <i>voy, vamos</i> (de ir); <i>nuevo, breve, activa</i> (adjetivos en -avo, -eve, -iva…); <i>tuve, estuve, anduve</i>.</p>
      <p>Cada vez que respondas, la regla de esa palabra aparece explicada. Las excepciones y los pares como <i>tubo / tuvo</i> llegan en el nivel 3.</p>`),
  },
  gj: {
    nombre: { es: '¿g o j? Y la diéresis', en: 'Spanish spelling: g or j, and the dieresis' },
    detalle: { es: 'garaje, origen, coger, pingüino', en: 'garaje, origen, coger, pingüino' },
    introduccion: mismo(`<p>Delante de <b>e</b> y de <b>i</b>, la <b>g</b> y la <b>j</b> suenan igual. Se distinguen con reglas:</p>
      <p>Con <b>j</b>: <i>garaje, viaje</i> (-aje); <i>relojero</i> (-jero); <i>ejercicio, ejemplo</i> (ej-); <i>dije, traje</i> (de decir y traer); <i>trabajar, bajar</i> (-jar).</p>
      <p>Con <b>g</b>: <i>origen, imagen</i> (-gen); <i>coger, elegir</i> (-ger, -gir); <i>magia, región</i>; <i>geografía</i> (geo-).</p>
      <p><b>gue, gui</b>: la u no suena (<i>guerra, guitarra</i>). Para que suene hay que poner la <b>diéresis</b>: <i>pingüino, cigüeña</i>.</p>`),
  },
  otras: {
    nombre: { es: 'Otras letras: ll, y, rr, c, z, x…', en: 'Spanish spelling: other letters' },
    detalle: { es: 'llave, también, perro, zapato, acción, extraño', en: 'llave, también, perro, zapato, acción, extraño' },
    introduccion: mismo(`<p><b>ll / y</b>: suenan casi igual, así que hay que fijarse: <i>yo, ya, hoy, ayer</i> con y; <i>llave, lluvia, calle</i> con ll.</p>
      <p><b>m</b> antes de <b>p</b> y <b>b</b> (<i>campo, también</i>); <b>n</b> delante de las demás (<i>banco, invitar</i>).</p>
      <p><b>r / rr</b>: entre vocales, <i>pero</i> suena suave y <i>perro</i> fuerte; al principio de palabra y detrás de n, l o s, el sonido fuerte lleva una sola r (<i>ratón, Enrique</i>).</p>
      <p><b>c / z / qu</b>: <i>cielo, zapato, quince</i>. Al final, <b>-d</b> o <b>-z</b>: dilo en plural (<i>verdades, lápices</i>). Y <b>cc</b> si hay «ct» en su familia (<i>acción</i>, de <i>acto</i>), y <b>x / s</b> (<i>extraño, estrella</i>).</p>`),
  },
};
