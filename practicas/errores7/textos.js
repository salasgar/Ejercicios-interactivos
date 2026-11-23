// Práctica «Caza el error» de la unidad 7: textos de la interfaz. Los nombres de los errores salen de
// `ERRORES_TIPICOS` (proporcion.js) y las explicaciones con números, de las plantillas de logica.js.
// Reglas: producto con «·», división «:», inglés sencillo.

import { ERRORES_TIPICOS } from '../_comun/proporcion.js';
import { aTexto } from '../_comun/proporcion.js';
import { htmlLinea, lineaBuena, lineasBuenas, porque, resultadoBueno, LETRAS, CUENTA } from './logica.js';
import { errorEnLinea, LO_CORRECTO, reglaEnNegrita } from '../_comun/procedimiento.js';

/** La regla que rompe cada error, en negrita en el feedback y en el «No lo sé» (JL, 22-11). */
export const REGLAS = {
  'razonar-sumando': { es: 'En una proporción directa, si una cantidad se multiplica por un número, la otra también: no se suma.', en: 'In direct proportion, if one amount is multiplied by a number, so is the other: you do not add.' },
  'porcentaje-entre-mil': { es: 'El tanto por ciento es entre 100: el 20 % es 20 : 100 = 0,2.', en: 'Per cent means divided by 100: 20% is 20 : 100 = 0.2.' },
  'porcentaje-entre-diez': { es: 'El tanto por ciento es entre 100: el 20 % es 20 : 100 = 0,2.', en: 'Per cent means divided by 100: 20% is 20 : 100 = 0.2.' },
  'dividir-entre-el-porcentaje': { es: 'Para calcular un porcentaje de una cantidad, se multiplica: el 20 % de 150 es 0,2 · 150.', en: 'To find a percentage of an amount, multiply: 20% of 150 is 0.2 · 150.' },
  'restar-el-porcentaje-como-numero': { es: 'Para aplicar un descuento, primero se calcula el porcentaje de la cantidad y después se resta.', en: 'To apply a discount, first find the percentage of the amount and then take it away.' },
  'descuento-por-precio-final': { es: 'Lo que se paga es el precio menos el descuento.', en: 'What you pay is the price minus the discount.' },
  'escala-sin-cambio-de-unidad': { es: 'Los dos números de una escala van en la misma unidad: luego hay que pasar a la que pide el problema.', en: 'Both numbers of a scale are in the same unit: then change to the unit the problem asks for.' },
  // Los que solo salen en las columnas del ejercicio 1.
  'inversa-en-directa': { es: 'En una proporción directa, si una cantidad se multiplica por un número, la otra también se multiplica por él: no se divide.', en: 'In direct proportion, if one amount is multiplied by a number, the other is multiplied by it too: you do not divide.' },
  'contestar-otra-cosa': { es: 'Antes de contestar, vuelve a leer la pregunta: el precio de uno es un paso, no la respuesta.', en: 'Before you answer, read the question again: the price of one is a step, not the answer.' },
  'porcentaje-sin-dividir': { es: 'El tanto por ciento es entre 100: el 20 % de 150 es 20 · 150 : 100.', en: 'Per cent means divided by 100: 20% of 150 is 20 · 150 : 100.' },
  'aumento-por-descuento': { es: 'Un descuento se resta: se paga el 100 % menos el descuento.', en: 'A discount is taken away: you pay 100% minus the discount.' },
};

export const TX = {
  nombre: {
    donde: { es: '¿Dónde está el error?', en: 'Where is the mistake?' },
    que: { es: '¿Qué error es?', en: 'What went wrong?' },
    corrige: { es: 'Corrígelo', en: 'Fix it' },
  },
  detalle: {
    donde: { es: 'El mismo problema resuelto de varias formas: toca el error de cada columna mala y di qué error es', en: 'The same problem solved in several ways: tap the mistake in each wrong column and say what it is' },
    que: { es: 'Una resolución con un error: elige cómo se llama', en: 'A solution with a mistake: choose its name' },
    corrige: { es: 'Una resolución con un error: escribe el resultado bien', en: 'A solution with a mistake: write the right answer' },
  },
  instruccion: {
    donde: { es: 'Varios compañeros han resuelto el mismo problema, cada uno en una columna. Algunas columnas tienen un error. Toca la línea del error en cada columna que esté mal y pulsa «Comprobar».', en: 'Some students solved the same problem, one in each column. Some columns have a mistake. Tap the wrong line in each column that has a mistake and press “Check”.' },
    que: { es: 'Hay un error. ¿Qué ha hecho mal el compañero?', en: 'There is a mistake. What did the student do wrong?' },
    corrige: { es: 'Hay un error. Escribe el resultado bien.', en: 'There is a mistake. Write the right answer.' },
  },
  introduccion: {
    donde: {
      es: `<p>Verás el mismo problema resuelto por varios compañeros, cada uno en una columna. Unas columnas están bien y otras tienen <strong>un error</strong>; no se dice cuántas. Hay más de una forma correcta de resolverlo.</p><p><strong>Ejemplo:</strong> 2 cuadernos cuestan 5,00 €. ¿Cuánto cuestan 4?<br><strong>A:</strong> 4 es el doble de 2, así que cuestan el doble. Después, 2 · 5,00 € = 10,00 €.<br><strong>B:</strong> Son 2 cuadernos más, así que cuestan 2,00 € más. Después, 5,00 € + 2,00 € = 7,00 €.<br><strong>C:</strong> Un cuaderno cuesta 5,00 € : 2 = 2,50 €. Después, 4 · 2,50 € = 10,00 €.</p><p>A y C están bien, cada una a su manera. B está mal en «Son 2 cuadernos más, así que cuestan 2,00 € más»: cada cuaderno cuesta 2,50 €, no 1,00 €. No se suma: se multiplica.</p><p>Toca la línea mala de cada columna que esté mal, deja sin tocar las que estén bien y pulsa «Comprobar». Después dirás qué error es.</p>`,
      en: `<p>You will see the same problem solved by several students, one in each column. Some columns are right and some have <strong>a mistake</strong>; you are not told how many. There is more than one right way to solve it.</p><p><strong>Example:</strong> 2 notebooks cost €5.00. How much do 4 cost?<br><strong>A:</strong> 4 is twice 2, so they cost twice as much. Then 2 · €5.00 = €10.00.<br><strong>B:</strong> There are 2 more notebooks, so they cost €2.00 more. Then €5.00 + €2.00 = €7.00.<br><strong>C:</strong> One notebook costs €5.00 : 2 = €2.50. Then 4 · €2.50 = €10.00.</p><p>A and C are right, each in its own way. B is wrong in “There are 2 more notebooks, so they cost €2.00 more”: each notebook costs €2.50, not €1.00. You do not add: you multiply.</p><p>Tap the wrong line in each column that has a mistake, leave the right ones alone and press “Check”. Then you will say what the mistake is.</p>`,
    },
    que: {
      es: `<p>Verás un problema resuelto por un compañero con un error. Tienes que elegir <strong>cómo se llama el error</strong>.</p><p><strong>Ejemplo:</strong><br>El 5 % de 200 alumnos…<br>5 % = 5 : 10 = 0,5<br>0,5 · 200 = 100</p><p>El error es: <em>Ha dividido entre 10: el tanto por ciento es entre 100</em>.</p><p>Solo un nombre es verdadero; los otros son errores que el compañero no ha cometido.</p>`,
      en: `<p>You will see a problem solved by a student with a mistake. You have to choose <strong>the name of the mistake</strong>.</p><p><strong>Example:</strong><br>5% of 200 students…<br>5% = 5 : 10 = 0.5<br>0.5 · 200 = 100</p><p>The mistake is: <em>Divided by 10: per cent means divided by 100</em>.</p><p>Only one name is true; the others are mistakes that the student did not make.</p>`,
    },
    corrige: {
      es: `<p>Ya sabes cazar errores; ahora toca <strong>arreglarlos</strong>. Verás una resolución con un error y escribirás el resultado bien.</p><p><strong>Ejemplo:</strong><br>Un jersey cuesta 50,00 € y tiene un 20 % de descuento. ¿Cuánto se paga?<br>20 % de 50,00 € = 20,00 €<br>50,00 € − 20,00 € = 30,00 €</p><p>El 20 % de 50,00 € son 10,00 €, no 20,00 €. Bien hecho: 50,00 € − 10,00 € = 40,00 €. Escribe 40.</p><p>Escribe solo el número; la unidad ya está puesta.</p>`,
      en: `<p>You can already spot mistakes; now you have to <strong>fix</strong> them. You will see a solution with a mistake and you will write the right answer.</p><p><strong>Example:</strong><br>A jumper costs €50.00 and has a 20% discount. How much do you pay?<br>20% of €50.00 = €20.00<br>€50.00 − €20.00 = €30.00</p><p>20% of €50.00 is €10.00, not €20.00. The right way: €50.00 − €10.00 = €40.00. Write 40.</p><p>Write only the number; the unit is already there.</p>`,
    },
  },
  comprobar: { es: 'Comprobar', en: 'Check' },
  col_bien: { es: 'bien', en: 'right' },
  col_mal: { es: 'error', en: 'mistake' },
  columna: { es: 'Columna', en: 'Column' },
  pregunta_col: { es: l => `¿Qué error hay en la columna ${l}?`, en: l => `What is the mistake in column ${l}?` },
  fallo_cuenta: { es: 'Se ha equivocado al hacer la cuenta.', en: 'Made a mistake in the calculation.' },
  la_linea_es: { es: 'El error está en esta línea:', en: 'The mistake is in this line:' },
  resultado_bien: { es: 'El resultado correcto es:', en: 'The right answer is:' },
  has_escrito: { es: 'Has escrito', en: 'You wrote' },
  repite: { es: 'Es el mismo resultado equivocado.', en: 'That is the same wrong result.' },
  nombre_resultado: { es: 'Resultado', en: 'Answer' },
  en_blanco: { es: 'Escribe un número', en: 'Write a number' },
};

export const nombreError = (id, tt) => tt(ERRORES_TIPICOS[id].nombre);
export const cuenta = html => `<span class="cuenta">${html}</span>`;
const linea = (l, idioma) => cuenta(htmlLinea(l, idioma));

/** El nombre del error como frase, sin «Se llama:» delante (JL, 22-11). */
const frase = (id, tt) => `${nombreError(id, tt)}.`;

/** La explicación de los ej. 2 y 3: la línea con ordinal, qué error es, la regla rota en negrita, por qué y lo correcto (JL, 22-11). */
export function explicacion(item, { tt, idioma }, { escrito = null, resultado = null } = {}) {
  const tuyo = escrito !== null ? `${tt(TX.has_escrito)} ${cuenta(aTexto(escrito, idioma))}. ` : '';
  const aviso = resultado?.error === 'repite-el-error' ? `${tt(TX.repite)} ` : '';
  return `${tuyo}${aviso}${errorEnLinea(item.falsa, idioma)} <span class="linea-mala">${linea(item.lineas[item.falsa], idioma)}</span>`
    + `<br>${frase(item.error, tt)}${reglaEnNegrita(tt(REGLAS[item.error]))}${porque(item, idioma)}`
    + `<br>${tt(LO_CORRECTO)} <span class="linea-mala">${linea(lineaBuena(item), idioma)}</span>`;
}

// ─── Ejercicio 1 en columnas (JL, 22-11) ───────────────────────────────────────

/** El enunciado, una sola vez encima de las columnas. */
export const enunciadoColumnas = (item, idioma) => linea(item.enunciado, idioma);
/** Las columnas para `columnasPulsables` y `columnasFijas`: sus pasos, sin el enunciado. */
export const columnasDe = (item, idioma) => item.columnas.map((c, j) => ({ letra: LETRAS[j], lineasHtml: c.lineas.slice(1).map(l => linea(l, idioma)) }));

/** Columna a columna: si está bien (y por qué) o su línea mala, qué error es, la regla en negrita, por qué y lo correcto. */
export function explicacionColumnas(item, { tt, idioma }) {
  return item.columnas.map((c, j) => {
    const cabeza = `<strong>${tt(TX.columna)} ${LETRAS[j]}.</strong>`;
    if (!c.error) return `<p class="columna-explica">${cabeza} ${c.porque[idioma]}</p>`;
    // El fallo de cuenta no tiene nombre en el catálogo ni regla rota: solo la cuenta bien hecha (JL, 23-11).
    const que = c.error === CUENTA ? `${tt(TX.fallo_cuenta)}<br>` : `${frase(c.error, tt)}${reglaEnNegrita(tt(REGLAS[c.error]))}`;
    return `<p class="columna-explica">${cabeza} ${tt(TX.la_linea_es)} <span class="linea-mala">${linea(c.lineas[c.falsa], idioma)}</span>`
      + `<br>${que}${c.porque[idioma]}`
      + `<br>${tt(LO_CORRECTO)} <span class="linea-mala">${linea(c.corregida, idioma)}</span></p>`;
  }).join('');
}

/** Las columnas malas: «la columna B» / «las columnas B y D» (en inglés, «column B» / «columns B and D»). */
function columnasMalas(item, idioma) {
  const l = item.columnas.map((c, j) => (c.error ? LETRAS[j] : null)).filter(Boolean);
  const lista = l.length === 1 ? l[0] : `${l.slice(0, -1).join(', ')} ${idioma === 'en' ? 'and' : 'y'} ${l.at(-1)}`;
  return idioma === 'en' ? `${l.length > 1 ? 'columns' : 'column'} ${lista}` : `${l.length > 1 ? 'las columnas' : 'la columna'} ${lista}`;
}

/** Ejercicio 1: ¿dónde está el error? (la explicación de cada columna y, al final, cuáles están mal). */
export function explicaDonde(item, ctx) {
  const { tt, idioma } = ctx;
  const regla = tt({
    es: 'Repasa cada columna línea a línea: cada línea tiene que salir de la anterior con una cuenta bien hecha y con sentido para lo que pregunta el problema. Una columna puede estar bien aunque lo haga de otra forma.',
    en: 'Check each column line by line: each line must follow from the one before with a correct calculation that makes sense for what the problem asks. A column can be right even if it does it another way.',
  });
  return `${regla}${explicacionColumnas(item, ctx)}${tt({ es: 'El error está en', en: 'The mistake is in' })} <strong>${columnasMalas(item, idioma)}</strong>.`;
}

/** Ejercicio 2: ¿qué error es? */
export function explicaQue(item, ctx) {
  const regla = ctx.tt({
    es: 'Busca la línea que no sale bien de la anterior y piensa qué se ha hecho distinto de lo correcto: ese es el nombre del error.',
    en: 'Find the line that does not follow correctly from the one before and think what was done differently from the right way: that is the name of the mistake.',
  });
  return `${regla}<br>${explicacion(item, ctx)}`;
}

/** Ejercicio 3: corrígelo (la explicación acaba en el resultado). */
export function explicaCorrige(item, ctx) {
  const { tt, idioma } = ctx;
  const regla = tt({
    es: 'Encuentra la línea mala, hazla bien y sigue desde ahí hasta el resultado.',
    en: 'Find the wrong line, do it right and carry on from there to the answer.',
  });
  const despues = lineasBuenas(item).slice(item.falsa + 1);
  const sigue = despues.length
    ? `<br>${tt({ es: 'Desde ahí:', en: 'From there:' })} ${despues.map(l => linea(l, idioma)).join(' → ')}`
    : '';
  const fin = `${tt({ es: 'La respuesta es', en: 'The answer is' })} ${cuenta(aTexto(resultadoBueno(item), idioma))}.`;
  return `${regla}<br>${explicacion(item, ctx)}${sigue}<br>${fin}`;
}
