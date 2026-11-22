// Práctica «Caza el error» de la unidad 5: textos de la interfaz. Los nombres de los errores salen de
// `ERRORES_TIPICOS` (decimales.js) y las explicaciones con números, de las plantillas de logica.js.
// Reglas: producto con «·», división «:», sin letras, inglés sencillo, coma en español y punto en inglés.

import { ERRORES_TIPICOS, aTexto } from '../_comun/decimales.js';
import { fraccion, htmlFraccion } from '../_comun/fracciones.js';
import { PLANTILLA_POR_ID, htmlLinea, resultadoBueno, comoSeHace, LETRAS, explicaColumna, columnaConCeros } from './logica.js';
import { errorEnLinea, lineaN, LO_CORRECTO, reglaEnNegrita } from '../_comun/procedimiento.js';

/** La regla que rompe cada error, en negrita en el feedback y en el «No lo sé» (JL, 22-11). */
export const REGLAS = {
  'alinea-a-la-derecha': { es: 'Para sumar o restar decimales, se pone coma debajo de coma.', en: 'To add or subtract decimals, put the decimal points one under the other.' },
  'coma-mal-puesta': { es: 'El producto lleva tantas cifras decimales como los dos factores juntos.', en: 'The product has as many decimal places as the two factors together.' },
  'por-diez-anadiendo-cero': { es: 'Multiplicar por 10, 100 o 1000 es mover la coma 1, 2 o 3 lugares a la derecha.', en: 'Multiplying by 10, 100 or 1000 moves the point 1, 2 or 3 places to the right.' },
  'redondea-truncando': { es: 'Para redondear se mira la cifra siguiente: si es 5 o más, se redondea hacia arriba.', en: 'To round, look at the next digit: if it is 5 or more, round up.' },
  'redondea-en-cadena': { es: 'Para redondear solo se mira la cifra que va justo detrás, no las de más allá.', en: 'To round, look only at the digit right after the place you round to, not the ones further on.' },
  'olvida-coma-cociente': { es: 'Al dividir un decimal, la coma se pone en el cociente al bajar la primera cifra decimal.', en: 'When you divide a decimal, the point goes in the quotient when you bring down the first decimal digit.' },
  'coma-solo-en-divisor': { es: 'Para quitar la coma del divisor, se mueve la coma el mismo número de lugares en el dividendo y en el divisor.', en: 'To remove the point from the divisor, move the point the same number of places in both numbers.' },
  'resto-sin-deshacer': { es: 'El resto es el de la división original: si se ha movido la coma, hay que deshacer ese cambio en el resto.', en: 'The remainder belongs to the original division: if the point was moved, undo that change in the remainder.' },
  'fraccion-al-reves': { es: 'Una fracción es el numerador dividido entre el denominador.', en: 'A fraction is the numerator divided by the denominator.' },
  'periodico-por-redondeo': { es: 'Si la división no termina, el decimal es periódico: un número redondeado no es el valor exacto.', en: 'If the division never ends, the decimal repeats: a rounded number is not the exact value.' },
  'redondea-otro-orden': { es: 'Se redondea al orden que pide el enunciado, ni uno más ni uno menos.', en: 'Round to the place the question asks for, not one more or one less.' },
  'numerador-como-decimas': { es: 'Una fracción se calcula dividiendo el numerador entre el denominador; sus cifras no se escriben detrás de la coma.', en: 'A fraction is worked out by dividing the numerator by the denominator; its digits are not written after the point.' },
  'compara-por-cifras': { es: 'Para comparar decimales, se miran las cifras una a una desde las décimas: gana la primera que es mayor.', en: 'To compare decimals, look at the digits one by one from the tenths: the first bigger digit wins.' },
};

export const TX = {
  nombre: {
    donde: { es: '¿Dónde está el error?', en: 'Where is the mistake?' },
    que: { es: '¿Qué error es?', en: 'What went wrong?' },
    corrige: { es: 'Corrígelo', en: 'Fix it' },
  },
  detalle: {
    donde: { es: 'El mismo cálculo hecho por varios alumnos: toca el error de cada columna mala y di qué error es', en: 'The same calculation done by several students: tap the mistake in each wrong column and say what it is' },
    que: { es: 'Un cálculo con un error: elige cómo se llama', en: 'A calculation with a mistake: choose its name' },
    corrige: { es: 'Un cálculo con un error: escribe el resultado bien', en: 'A calculation with a mistake: write the right result' },
  },
  instruccion: {
    donde: { es: 'Varios alumnos han hecho el mismo cálculo, cada uno en una columna. Algunas columnas tienen un error. Toca la línea del error en cada columna que esté mal y pulsa «Comprobar».', en: 'Some students did the same calculation, one in each column. Some columns have a mistake. Tap the wrong line in each column that has a mistake and press “Check”.' },
    que: { es: 'Hay un error. ¿Qué ha hecho mal el compañero?', en: 'There is a mistake. What did the student do wrong?' },
    corrige: { es: 'Hay un error. Escribe el resultado bien de la última línea.', en: 'There is a mistake. Write the right result of the last line.' },
  },
  introduccion: {
    donde: {
      es: `<p>Verás el mismo cálculo hecho por varios alumnos, cada uno en una columna. Unas columnas están bien y otras tienen <strong>un error</strong>; no se dice cuántas. Cada línea tiene que valer lo mismo que la anterior.</p><p><strong>Ejemplo:</strong> 1,2 · 0,3</p><p>A<br>Sin comas: 12 · 3 = 36<br>1,2 · 0,3 = 0,36</p><p>B<br>Sin comas: 12 · 3 = 36<br>1,2 · 0,3 = 3,6</p><p>C<br>= 1,2 · 3 : 10<br>= 3,6 : 10<br>= 0,36</p><p>A y C están bien: hay más de una forma de hacerlo. B está mal en «1,2 · 0,3 = 3,6»: el producto lleva dos cifras decimales (una de cada factor), y sale 0,36.</p><p>Toca la línea mala de cada columna que esté mal, deja sin tocar las que estén bien y pulsa «Comprobar». Después dirás qué error es. Ojo: <strong>3,50 y 3,5 son el mismo número</strong>; los ceros al final no son un error.</p>`,
      en: `<p>You will see the same calculation done by several students, one in each column. Some columns are right and some have <strong>a mistake</strong>; you are not told how many. Each line has to be worth the same as the line before.</p><p><strong>Example:</strong> 1.2 · 0.3</p><p>A<br>Without the points: 12 · 3 = 36<br>1.2 · 0.3 = 0.36</p><p>B<br>Without the points: 12 · 3 = 36<br>1.2 · 0.3 = 3.6</p><p>C<br>= 1.2 · 3 : 10<br>= 3.6 : 10<br>= 0.36</p><p>A and C are right: there is more than one way to do it. B is wrong in “1.2 · 0.3 = 3.6”: the product has two decimal places (one from each factor), so it is 0.36.</p><p>Tap the wrong line in each column that has a mistake, leave the right ones alone and press “Check”. Then you will say what the mistake is. Careful: <strong>3.50 and 3.5 are the same number</strong>; zeros at the end are not a mistake.</p>`,
    },
    que: {
      es: `<p>Verás el cálculo de un compañero con un error. Tienes que elegir <strong>cómo se llama el error</strong>.</p><p><strong>Ejemplo:</strong><br>7,5 : 3<br>Sin la coma: 75 : 3 = 25<br>7,5 : 3 = 25</p><p>El error es: <em>Se ha olvidado de poner la coma en el cociente</em>. Bien hecho: 2,5.</p><p>Solo un nombre es verdadero; los otros son errores que el compañero no ha cometido.</p>`,
      en: `<p>You will see a student's calculation with a mistake. You have to choose <strong>the name of the mistake</strong>.</p><p><strong>Example:</strong><br>7.5 : 3<br>Without the point: 75 : 3 = 25<br>7.5 : 3 = 25</p><p>The mistake is: <em>Forgot the decimal point in the quotient</em>. The right way: 2.5.</p><p>Only one name is true; the others are mistakes that the student did not make.</p>`,
    },
    corrige: {
      es: `<p>Ya sabes cazar errores; ahora toca <strong>arreglarlos</strong>. Verás un cálculo con un error y escribirás el resultado bien.</p><p><strong>Ejemplo:</strong><br>3/4<br>= 4 : 3<br>= 1,33</p><p>Se ha dividido el denominador entre el numerador. Bien hecho: 3 : 4 = 0,75. Escribe 0,75.</p><p>Puedes escribir la coma o el punto. Si la línea pide un redondeo («a la décima»), escribe justo esas cifras decimales.</p>`,
      en: `<p>You can already spot mistakes; now you have to <strong>fix</strong> them. You will see a calculation with a mistake and you will write the right result.</p><p><strong>Example:</strong><br>3/4<br>= 4 : 3<br>= 1.33</p><p>The denominator was divided by the numerator. The right way: 3 : 4 = 0.75. Write 0.75.</p><p>You can type a comma or a point. If the line asks for rounding (“to one decimal place”), write exactly that many decimal places.</p>`,
    },
  },
  comprobar: { es: 'Comprobar', en: 'Check' },
  col_bien: { es: 'bien', en: 'right' },
  col_mal: { es: 'error', en: 'mistake' },
  columna: { es: 'Columna', en: 'Column' },
  pregunta_col: { es: l => `¿Qué error hay en la columna ${l}?`, en: l => `What is the mistake in column ${l}?` },
  la_linea_es: { es: 'El error está en esta línea:', en: 'The mistake is in this line:' },
  esta_bien: { es: 'Está bien.', en: 'It is right.' },
  ceros: { es: 'Ojo: un cero al final de los decimales (3,50) no cambia el número: 3,50 = 3,5. No es un error.', en: 'Careful: a zero at the end of the decimals (3.50) does not change the number: 3.50 = 3.5. It is not a mistake.' },
  resultado_bien: { es: 'El resultado correcto es:', en: 'The right result is:' },
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
/**
 * El nombre del error como frase, sin «Se llama:» delante (JL, 22-11). Si tras sus dos puntos repite la regla
 * («…del producto: lleva tantas cifras decimales…»), se corta ahí: la regla ya va en negrita.
 */
function frase(id, tt) {
  const nombre = nombreError(id, tt), i = nombre.indexOf(': ');
  const cola = i < 0 ? '' : nombre.slice(i + 2).toLowerCase();
  return `${cola && tt(REGLAS[id]).toLowerCase().includes(cola) ? nombre.slice(0, i) : nombre}.`;
}
const reglaRota = (item, tt) => reglaEnNegrita(tt(REGLAS[item.error]));
const reglaDe = (error, tt) => reglaEnNegrita(tt(REGLAS[error]));

/** La explicación: qué línea, qué error es, la regla rota en negrita, por qué y lo correcto (JL, 22-11). */
export function explicacionDe(item, { tt, idioma }, { escrito = null, resultado = null } = {}) {
  const p = PLANTILLA_POR_ID[item.plantilla];
  const buena = p.cadena(item.params, false).lineas[item.falsa];
  const tuyo = escrito !== null ? `${tt(TX.has_escrito)} ${cuenta(aTexto(escrito, idioma))}. ` : '';
  const aviso = resultado?.error === 'repite-el-error' ? `${tt(TX.repite)} ` : resultado?.error === 'cifras' ? `${tt(TX.cifras)} ` : '';
  return `${tuyo}${aviso}${errorEnLinea(item.falsa, idioma)} <span class="linea-mala">${linea(item.lineas[item.falsa], idioma)}</span>`
    + `<br>${frase(item.error, tt)}${reglaRota(item, tt)}${p.porque(item.params, idioma)}`
    + `<br>${tt(LO_CORRECTO)} <span class="linea-mala">${linea(buena, idioma)}</span>`;
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
function lineaMalaYBuena(item, { tt, idioma }, sinCual = false) {
  const como = comoSeHace(item, idioma);
  const buena = PLANTILLA_POR_ID[item.plantilla].cadena(item.params, false).lineas[item.falsa];
  const cual = sinCual ? dos('Esta línea falla:', 'This line is wrong:', idioma) : errorEnLinea(item.falsa, idioma);
  return `${cual} <span class="linea-mala">${linea(item.lineas[item.falsa], idioma)}</span>`
    + `${reglaRota(item, tt)}${como}<br>${tt(LO_CORRECTO)} ${linea(buena, idioma)}`;
}

// ─── Ejercicio 1 en columnas ───────────────────────────────────────────────────────────────────

export const enunciadoColumnas = (item, idioma) => linea(item.enunciado, idioma);
export const columnasDe = (item, idioma) => item.columnas.map((c, j) => ({
  letra: LETRAS[j], lineasHtml: c.lineas.slice(1).map(l => linea(l, idioma)),
}));

/** Columna a columna: si está bien (y cómo lo ha hecho), o la línea mala, qué error es, la regla y lo correcto. */
export function explicacionColumnas(item, { tt, idioma }) {
  return item.columnas.map((c, j) => {
    const { porque, corregida } = explicaColumna(item, c);
    const cabeza = `<strong>${tt(TX.columna)} ${LETRAS[j]}.</strong>`;
    if (!c.error) return `<p class="columna-explica">${cabeza} ${tt(TX.esta_bien)} ${porque(idioma)}${columnaConCeros(c) ? `<br>${tt(TX.ceros)}` : ''}</p>`;
    return `<p class="columna-explica">${cabeza} ${tt(TX.la_linea_es)} <span class="linea-mala">${linea(c.lineas[c.falsa], idioma)}</span>`
      + `<br>${frase(c.error, tt).replace(/(\d+)\/(\d+)/g, (_, n, d) => htmlFraccion(fraccion(Number(n), Number(d)), { compacta: true }))}${reglaDe(c.error, tt)}${porque(idioma)}`
      + `<br>${tt(LO_CORRECTO)} <span class="linea-mala">${linea(corregida, idioma)}</span></p>`;
  }).join('');
}

/** Las columnas malas: «la columna B» / «las columnas B y D» (en inglés, «column B» / «columns B and D»). */
function columnasMalas(item, idioma) {
  const l = item.columnas.map((c, j) => (c.error ? LETRAS[j] : null)).filter(Boolean);
  const lista = l.length === 1 ? l[0] : `${l.slice(0, -1).join(', ')} ${idioma === 'en' ? 'and' : 'y'} ${l.at(-1)}`;
  return idioma === 'en' ? `${l.length > 1 ? 'columns' : 'column'} ${lista}` : `${l.length > 1 ? 'las columnas' : 'la columna'} ${lista}`;
}

/** Ejercicio 1: ¿dónde está el error? */
export function explicaDonde(item, ctx) {
  const { idioma } = ctx;
  const regla = dos('Repasa cada columna línea a línea: cada línea tiene que valer lo mismo que la anterior. Una columna puede estar bien aunque lo haga de otra forma.',
    'Check each column line by line: each line has to be worth the same as the line before. A column can be right even if it does it another way.', idioma);
  return `${regla}${explicacionColumnas(item, ctx)}${fin(idioma, columnasMalas(item, idioma))}`;
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
