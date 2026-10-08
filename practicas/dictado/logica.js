// Dictado de números: lógica pura (sin DOM ni red).
// Los generadores devuelven DATOS (números, textos, listas), nunca HTML.
//
// Tres ejercicios:
//   1. Dictado en inglés: se oye un número de 3 a 5 cifras y se escribe con cifras.
//   2. -teen o -ty (oído) y cómo se escribe (ortografía inglesa).
//   3. Ortografía española con fichas de palabras, y dictado en español.
//
// Los números en palabras salen de los constructores de `../potencias10/logica.js`
// (probados allí con analizadores independientes).

import { enNum, esNum, agrupar } from '../potencias10/logica.js';

export { enNum, esNum, agrupar };

export const interiorConCeros = n => /[1-9]0+[1-9]/.test(String(n));

// --- Ejercicio 1: dictado en inglés ---------------------------------------------------

/** Ítem: { tipo: 'dictado', n, texto }. El 40 % lleva ceros interiores. */
export function generarDictado(rng) {
  return numeroDictado(rng, 3, 5, 0.4, 'dictado', enNum);
}

function numeroDictado(rng, minCifras, maxCifras, probCeros, tipo, nombre) {
  const queCeros = rng.azar() < probCeros;
  for (let i = 0; i < 1000; i++) {
    const cifras = rng.entero(minCifras, maxCifras);
    const n = rng.entero(10 ** (cifras - 1), 10 ** cifras - 1);
    if (interiorConCeros(n) === queCeros) return { tipo, n, texto: nombre(n) };
  }
  const n = queCeros ? 6014 : 5463;
  return { tipo, n, texto: nombre(n) };
}

/** ¿Es correcto lo escrito? Valen las cifras con o sin separadores. */
export function esRespuestaDictado(item, escrito) {
  return String(escrito).replace(/\D/g, '') === String(item.n);
}

/** Los grupos de un número con el valor de cada uno, para la explicación: [{ nombre, valor }]. */
export function gruposConValor(n) {
  const m = Math.floor(n / 1e6), k = Math.floor((n % 1e6) / 1e3), u = n % 1e3;
  const lista = [];
  if (m) lista.push({ clave: 'millones', valor: m * 1e6, texto: enNum(m * 1e6) });
  if (k) lista.push({ clave: 'miles', valor: k * 1e3, texto: enNum(k * 1e3) });
  if (u) lista.push({ clave: 'unidades', valor: u, texto: enNum(u) });
  return lista;
}

// --- Ejercicio 2a: -teen o -ty ---------------------------------------------------------

/** Pares que se confunden al oírlos: [teen, ty]. */
export const PARES_TEEN = [[13, 30], [14, 40], [15, 50], [16, 60], [17, 70], [18, 80], [19, 90]];

/** Ítem: { tipo: 'teen', n, texto, base: [teen, ty], opciones: [a, b], solucion }. */
export function generarTeen(rng) {
  const par = rng.elegir(PARES_TEEN);
  const escala = rng.elegir([1, 1000]);
  const [teen, ty] = par;
  const esTeen = rng.azar() < 0.5;
  const n = (esTeen ? teen : ty) * escala;
  const opciones = rng.barajar([teen * escala, ty * escala]);
  return { tipo: 'teen', n, texto: enNum(n), base: par, escala, opciones, solucion: opciones.indexOf(n) };
}

// --- Ejercicio 2b: cómo se escribe -------------------------------------------------------

/** Errores típicos de ortografía, tres por palabra. Ninguno es una palabra inglesa válida. */
export const MAL_ESCRITAS = {
  thirteen: ['thirten', 'threeteen', 'thirtheen'],
  fourteen: ['forteen', 'fourteene', 'fourtheen'],
  fifteen: ['fiveteen', 'fiftheen', 'fifthteen'],
  sixteen: ['sixten', 'sixtheen', 'sixteene'],
  seventeen: ['seventen', 'sevnteen', 'seventeene'],
  eighteen: ['eightteen', 'eigtheen', 'eighten'],
  nineteen: ['ninteen', 'nineten', 'nineteene'],
  twenty: ['twenny', 'twentie', 'twinty'],
  thirty: ['thirdy', 'thirthy', 'thirtie'],
  forty: ['fourty', 'fortie', 'forthy'],
  fifty: ['fivty', 'fiftie', 'fifthy'],
  sixty: ['sixy', 'sixtie', 'sixthy'],
  seventy: ['sevinty', 'seventie', 'sevventy'],
  eighty: ['eigthy', 'eightty', 'eightie'],
  ninety: ['ninty', 'ninetty', 'ninetie'],
};

/**
 * Ítem de escritura. Clases:
 *   compuesto  21-99 con guion: falsas con espacio, pegado y una decena mal escrita.
 *   decena     13-19 o decena exacta: tres escrituras erróneas.
 *   plural     «three hundred» / «five thousand»: plural de más y dos erratas.
 * { tipo: 'escritura', clase, n, opciones: [texto], solucion }
 */
export function generarEscritura(rng) {
  const clase = rng.elegir(['compuesto', 'decena', 'plural']);
  let n, buena, falsas;
  if (clase === 'compuesto') {
    do { n = rng.entero(21, 99); } while (n % 10 === 0);
    buena = enNum(n);
    const [decena, unidad] = buena.split('-');
    falsas = [`${decena} ${unidad}`, `${decena}${unidad}`, `${rng.elegir(MAL_ESCRITAS[decena])}-${unidad}`];
  } else if (clase === 'decena') {
    n = rng.elegir([13, 14, 15, 16, 17, 18, 19, 20, 30, 40, 50, 60, 70, 80, 90]);
    buena = enNum(n);
    falsas = MAL_ESCRITAS[buena].slice();
  } else {
    const c = rng.entero(2, 9);
    const palabra = rng.elegir(['hundred', 'thousand']);
    n = c * (palabra === 'hundred' ? 100 : 1000);
    buena = enNum(n);
    const mal = palabra === 'hundred' ? ['hundread', 'hunderd'] : ['thousend', 'thousan'];
    falsas = [`${enNum(c)} ${palabra}s`, `${enNum(c)} ${mal[0]}`, `${enNum(c)} ${mal[1]}`];
  }
  const opciones = rng.barajar([buena, ...falsas]);
  return { tipo: 'escritura', clase, n, opciones, solucion: opciones.indexOf(buena) };
}

// --- Ejercicio 3: ortografía española con fichas ------------------------------------------

/** Fichas erróneas que se pueden añadir, y cuándo. */
const FALSAS_CENTENAS = { setecientos: 'sietecientos', novecientos: 'nuevecientos', quinientos: 'cincocientos' };

/**
 * Ítem de fichas: { tipo: 'fichas', n, texto, fichas: [palabra], sobran: [palabra] }.
 * `fichas` incluye las buenas y las erróneas mezcladas; `sobran` dice cuáles son las erróneas.
 * Solo vale la secuencia que forma exactamente `texto`.
 */
export function generarFichas(rng) {
  const miles = rng.azar() < 0.7 ? rng.entero(2, 9) : rng.entero(10, 99);
  const k = rng.azar() < 0.15 ? 1 : miles;
  const h = rng.elegir([0, 1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 9]);
  const r = rng.elegir([0, rng.entero(1, 9), rng.entero(10, 99), rng.entero(16, 19), rng.entero(21, 29), rng.entero(31, 99)]);
  const n = k * 1000 + h * 100 + r;
  const texto = esNum(n);
  const buenas = texto.split(' ');
  const sobran = ['miles'];
  if (!buenas.includes('un')) sobran.push('un');
  for (const [bien, mal] of Object.entries(FALSAS_CENTENAS)) if (buenas.includes(bien)) sobran.push(mal);
  if (!buenas.includes('y')) sobran.push('y');
  const falsas = rng.barajar(sobran).slice(0, rng.entero(2, 3))  // al menos «miles» siempre está disponible;
  return { tipo: 'fichas', n, texto, fichas: rng.barajar([...buenas, ...falsas]), sobran: falsas };
}

/** ¿La secuencia de fichas forma el número del ítem? */
export function esSecuenciaCorrecta(item, secuencia) {
  return secuencia.join(' ') === item.texto;
}

/** Ítem: { tipo: 'dictado_es', n, texto }. Cuatro o cinco cifras, la mayoría con cero interior. */
export function generarDictadoEs(rng) {
  return numeroDictado(rng, 4, 5, 0.7, 'dictado_es', esNum);
}

/** Qué se dice de cada ficha errónea (la clave es la ficha). */
export const NOTAS_FICHAS = {
  miles: 'mil',
  un: 'un',
  y: 'y',
  sietecientos: 'setecientos',
  nuevecientos: 'novecientos',
  cincocientos: 'quinientos',
};
