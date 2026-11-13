// Práctica «Caza el error» de la unidad 5: textos de la interfaz. Los nombres de los errores salen de
// `ERRORES_TIPICOS` (decimales.js) y las explicaciones con números, de las plantillas de logica.js.
// Reglas: producto con «·», división «:», sin letras, inglés sencillo, coma en español y punto en inglés.

import { ERRORES_TIPICOS, aTexto } from '../_comun/decimales.js';
import { fraccion, htmlFraccion } from '../_comun/fracciones.js';
import { PLANTILLA_POR_ID, htmlLinea, tieneCerosFinales, resultadoBueno, comoSeHace } from './logica.js';

export const TX = {
  nombre: {
    donde: { es: '¿Dónde está el error?', en: 'Where is the mistake?' },
    que: { es: '¿Qué error es?', en: 'What went wrong?' },
    corrige: { es: 'Corrígelo', en: 'Fix it' },
  },
  detalle: {
    donde: { es: 'Un cálculo de tres líneas: toca la línea mala, o «Todo está bien»', en: 'A calculation in three lines: tap the wrong line, or “All correct”' },
    que: { es: 'Un cálculo con un error: elige cómo se llama', en: 'A calculation with a mistake: choose its name' },
    corrige: { es: 'Un cálculo con un error: escribe el resultado bien', en: 'A calculation with a mistake: write the right result' },
  },
  instruccion: {
    donde: { es: 'Toca la línea donde está el error. Si todo está bien, toca «Todo está bien».', en: 'Tap the line where the mistake is. If everything is right, tap “All correct”.' },
    que: { es: 'Hay un error. ¿Qué ha hecho mal el compañero?', en: 'There is a mistake. What did the student do wrong?' },
    corrige: { es: 'Hay un error. Escribe el resultado bien de la última línea.', en: 'There is a mistake. Write the right result of the last line.' },
  },
  introduccion: {
    donde: {
      es: `<p>Verás el cálculo de un compañero, con las líneas numeradas. A veces tiene un paso mal y a veces está todo bien.</p><p><strong>Ejemplo:</strong><br>1. 1,2 · 0,3<br>2. = 12 · 3 = 36<br>3. = 3,6</p><p>El error está en la <strong>línea 3</strong>: el producto lleva dos cifras decimales (una de cada factor), y sale 0,36.</p><p>Toca la línea mala. Si todo está bien, toca «Todo está bien». Ojo: <strong>3,50 y 3,5 son el mismo número</strong>; los ceros al final no son un error.</p>`,
      en: `<p>You will see a student's calculation, with numbered lines. Sometimes one step is wrong and sometimes everything is right.</p><p><strong>Example:</strong><br>1. 1.2 · 0.3<br>2. = 12 · 3 = 36<br>3. = 3.6</p><p>The mistake is in <strong>line 3</strong>: the product has two decimal places (one from each factor), so it is 0.36.</p><p>Tap the wrong line. If everything is right, tap “All correct”. Careful: <strong>3.50 and 3.5 are the same number</strong>; zeros at the end are not a mistake.</p>`,
    },
    que: {
      es: `<p>Verás el cálculo de un compañero con un error. Tienes que elegir <strong>cómo se llama el error</strong>.</p><p><strong>Ejemplo:</strong><br>1. 7,5 : 3<br>2. = 75 : 3 = 25<br>3. = 25</p><p>El error se llama: <em>Se ha olvidado de poner la coma en el cociente</em>. Bien hecho: 2,5.</p><p>Solo un nombre es verdadero; los otros son errores que el compañero no ha cometido.</p>`,
      en: `<p>You will see a student's calculation with a mistake. You have to choose <strong>the name of the mistake</strong>.</p><p><strong>Example:</strong><br>1. 7.5 : 3<br>2. = 75 : 3 = 25<br>3. = 25</p><p>The mistake is called: <em>Forgot the decimal point in the quotient</em>. The right way: 2.5.</p><p>Only one name is true; the others are mistakes that the student did not make.</p>`,
    },
    corrige: {
      es: `<p>Ya sabes cazar errores; ahora toca <strong>arreglarlos</strong>. Verás un cálculo con un error y escribirás el resultado bien.</p><p><strong>Ejemplo:</strong><br>1. 3/4<br>2. = 4 : 3<br>3. = 1,33</p><p>Se ha dividido el denominador entre el numerador. Bien hecho: 3 : 4 = 0,75. Escribe 0,75.</p><p>Puedes escribir la coma o el punto. Si la línea pide un redondeo («a la décima»), escribe justo esas cifras decimales.</p>`,
      en: `<p>You can already spot mistakes; now you have to <strong>fix</strong> them. You will see a calculation with a mistake and you will write the right result.</p><p><strong>Example:</strong><br>1. 3/4<br>2. = 4 : 3<br>3. = 1.33</p><p>The denominator was divided by the numerator. The right way: 3 : 4 = 0.75. Write 0.75.</p><p>You can type a comma or a point. If the line asks for rounding (“to one decimal place”), write exactly that many decimal places.</p>`,
    },
  },
  todo_bien: { es: 'Todo está bien', en: 'All correct' },
  todo_bien_es: { es: 'Está todo bien: no hay ningún error.', en: 'Everything is right: there is no mistake.' },
  ceros: { es: 'Ojo: un cero al final de los decimales (3,50) no cambia el número: 3,50 = 3,5. No es un error.', en: 'Careful: a zero at the end of the decimals (3.50) does not change the number: 3.50 = 3.5. It is not a mistake.' },
  la_linea_es: { es: n => `El error está en la línea ${n}:`, en: n => `The mistake is in line ${n}:` },
  se_llama: { es: 'Se llama:', en: 'It is called:' },
  bien_es: { es: 'Bien hecho es:', en: 'The right way is:' },
  resultado_bien: { es: 'El resultado bien es:', en: 'The right result is:' },
  has_escrito: { es: 'Has escrito', en: 'You wrote' },
  repite: { es: 'Es el mismo resultado equivocado.', en: 'That is the same wrong result.' },
  cifras: { es: 'El valor está bien, pero la línea pide otro número de cifras decimales.', en: 'The value is right, but the line asks for a different number of decimal places.' },
  nombre_resultado: { es: 'Resultado', en: 'Result' },
  en_blanco: { es: 'Escribe un número', en: 'Write a number' },
};

// ─── La explicación del ítem (feedback de siempre y «No lo sé») ────────────────────────────────

const cuenta = html => `<span class="cuenta">${html}</span>`;
/** Una línea del cálculo (la 1 tal cual; las demás ya empiezan por «= » o por su texto). */
export const linea = (l, idioma) => cuenta(htmlLinea(l, idioma));
export const nombreError = (id, tt) => tt(ERRORES_TIPICOS[id].nombre);

/** La explicación: qué línea, cómo se llama, por qué y cómo se hace bien (movida desde practica.js sin cambios). */
export function explicacionDe(item, { tt, idioma }, { escrito = null, resultado = null } = {}) {
  const p = PLANTILLA_POR_ID[item.plantilla];
  if (item.falsa === null) return `${tt(TX.todo_bien_es)}${tieneCerosFinales(item) ? `<br>${tt(TX.ceros)}` : ''}`;
  const buena = p.cadena(item.params, false).lineas[item.falsa];
  const tuyo = escrito !== null ? `${tt(TX.has_escrito)} ${cuenta(aTexto(escrito, idioma))}. ` : '';
  const aviso = resultado?.error === 'repite-el-error' ? `${tt(TX.repite)} ` : resultado?.error === 'cifras' ? `${tt(TX.cifras)} ` : '';
  return `${tuyo}${aviso}${tt(TX.la_linea_es)(item.falsa + 1)} <span class="linea-mala">${linea(item.lineas[item.falsa], idioma)}</span>`
    + `<br>${tt(TX.se_llama)} ${nombreError(item.error, tt)}`
    + `<br>${p.porque(item.params, idioma)}`
    + `<br>${tt(TX.bien_es)} <span class="linea-mala">${linea(buena, idioma)}</span>`;
}

// ─── «No lo sé»: cómo se hace cada ejercicio (la regla, el paso del ítem y la respuesta) ──────

// La tarjeta no copia `explicacionDe` (el feedback): «Se llama:» repetía la respuesta del ej. 2 y en los
// otros no hace falta; «Está todo bien» no decía por qué; y el «por qué» del feedback lleva la frase del
// error, que con «· 1000» dice «añadir un cero» y en el redondeo en cadena enseña mal la cadena. Aquí: la
// línea mala, cómo se hace bien con los números del ítem (`comoSeHace`) y la línea buena.

const fin = (idioma, txt) => `<br>${idioma === 'es' ? 'La respuesta es' : 'The answer is'} <strong>${txt}</strong>.`;
const dos = (es, en, idioma) => (idioma === 'es' ? es : en);
const opcion = (txt, idioma) => (idioma === 'es' ? `«${txt}»` : `“${txt}”`);
/** El nombre de un error con sus fracciones con raya («1/3 es 0,333…» → raya). */
const nombreConRaya = (id, tt) => nombreError(id, tt).replace(/(\d+)\/(\d+)/g, (_, a, b) => htmlFraccion(fraccion(Number(a), Number(b)), { compacta: true }));

/** Lo común: la línea mala, cómo se hace bien y la línea buena (o, sin error, por qué todo cuadra). */
function lineaMalaYBuena(item, { tt, idioma }) {
  const como = comoSeHace(item, idioma);
  if (item.falsa === null) return `${tt(TX.todo_bien_es)} ${como}${tieneCerosFinales(item) ? `<br>${tt(TX.ceros)}` : ''}`;
  const buena = PLANTILLA_POR_ID[item.plantilla].cadena(item.params, false).lineas[item.falsa];
  return `${tt(TX.la_linea_es)(item.falsa + 1)} <span class="linea-mala">${linea(item.lineas[item.falsa], idioma)}</span>`
    + `<br>${como}<br>${tt(TX.bien_es)} ${linea(buena, idioma)}`;
}

/** Ejercicio 1: ¿dónde está el error? */
export function explicaDonde(item, ctx) {
  const { idioma, tt } = ctx;
  const regla = dos('Repite cada paso con sus números: la línea que no cuadra es la mala. Si todas cuadran, todo está bien.',
    'Repeat each step with its numbers: the line that does not fit is the wrong one. If all of them fit, everything is right.', idioma);
  const resp = item.falsa === null ? opcion(tt(TX.todo_bien), idioma) : dos(`la línea ${item.falsa + 1}`, `line ${item.falsa + 1}`, idioma);
  return `${regla}<br>${lineaMalaYBuena(item, ctx)}${fin(idioma, resp)}`;
}

/** Ejercicio 2: ¿qué error es? */
export function explicaQue(item, ctx) {
  const { idioma, tt } = ctx;
  const regla = dos('Busca la línea que está mal y compárala con cómo se hace bien: lo que cambia da el nombre del error.',
    'Find the wrong line and compare it with the right way: what is different gives the name of the mistake.', idioma);
  return `${regla}<br>${lineaMalaYBuena(item, ctx)}${fin(idioma, opcion(nombreConRaya(item.solucion, tt), idioma))}`;
}

/** Ejercicio 3: corrígelo. */
export function explicaCorrige(item, ctx) {
  const { idioma } = ctx;
  const regla = dos('Busca la línea mala, haz bien ese paso y sigue con las líneas que faltan hasta el resultado.',
    'Find the wrong line, do that step right and carry on with the remaining lines to the result.', idioma);
  return `${regla}<br>${lineaMalaYBuena(item, ctx)}${fin(idioma, aTexto(resultadoBueno(item), idioma, item.cifras))}`;
}
