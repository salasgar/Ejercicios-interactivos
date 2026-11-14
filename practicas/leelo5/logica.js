// Práctica «Léelo en inglés» de la unidad 5 (Decimals): lógica pura (sin DOM ni red).
// Cuatro ejercicios, todos de elegir una opción entre cuatro:
//   1. La palabra   un término del vocabulario de la unidad y cuatro significados (o al revés)
//   2. Léelo        un decimal, una cantidad de dinero o una cuenta y cuatro lecturas; y al revés,
//                   una lectura (en inglés o en español) y cuatro escrituras con cifras
//   3. La consigna  una instrucción de examen en inglés y cuatro traducciones al español
//   4. Completa     una frase en inglés con un hueco y cuatro palabras
//
// Un ítem es DATOS: { plantilla, instruccion, notacion (html), opciones, solucion, sesion } con
// `opciones` ya barajada: { texto, correcta, error, por_que } donde `error` es el id de un error
// típico (de ERRORES_TIPICOS de `_comun/decimales.js` o de ERRORES_LEELO, aquí) y `por_que`
// {es, en} dice qué pasa con los números del ítem. Ninguna falsa es otra forma válida de decir lo
// mismo (nought / zero, proof / test, decimal places / digits after the point, to one decimal place /
// to the nearest tenth…) y dos opciones nunca valen lo mismo (se comprueba por valor, con la
// aritmética exacta de `decimales.js`, nunca con Number).
//
// Los números nunca son los de la hoja de la unidad (en claro: `RESERVADOS_HOJA`) ni los del
// examen semanal (por huella FNV-1a calculada fuera del repositorio: `HUELLAS_EXAMEN`; la tarea de
// publicación de la semana 2 coteja el resto).
//
// `sesion` es la primera sesión de la unidad en la que el ítem tiene sentido (inventario: 1B-01…1B-05
// en la 1, 1B-07 en la 2, 1B-06 en la 3, 2B-01 en la 5, 2B-02 y 2B-03 en la 5-6). Esta práctica es de
// toda la unidad; el campo existe para que la tarea de la semana 1 pueda restringir a `sesion <= 3`.

import { numeroAIngles, numeroAEspanol } from '../../src/ejercicios/palabras.js';
import {
  decimal, aTexto, deTexto, enPalabras, lecturasValidas, esLecturaValida, dinero, lecturasDinero,
  porPotenciaDe10, multiplicar, dividir, sumar, restar, comparar, mismoValor, ORDENES, MENOS,
  ERRORES_TIPICOS, alinearDerecha, comaMalPuesta, olvidarComaCociente, compararPorCifras,
} from '../_comun/decimales.js';
import { fraccion, htmlFraccion, aTexto as aTextoFraccion } from '../_comun/fracciones.js';

export { numeroAIngles, numeroAEspanol };
const w = numeroAIngles;

// ─── Errores propios de la práctica (los de los cálculos están en ERRORES_TIPICOS) ──────────

export const ERRORES_LEELO = {
  // Ejercicio 1
  'vocabulario-confundido': { nombre: { es: 'Ha tomado un término por la traducción de otro', en: 'Mixed up a term with the translation of another one' } },
  'confunde-parecidas': { nombre: { es: 'Ha confundido dos palabras que se parecen (tenths y tens, hundredths y hundreds…)', en: 'Mixed up two words that look alike (tenths and tens, hundredths and hundreds…)' } },
  'confunde-contrarios': { nombre: { es: 'Ha confundido dos palabras contrarias (greater y less, ascending y descending, dividend y divisor…)', en: 'Mixed up two opposite words (greater and less, ascending and descending, dividend and divisor…)' } },
  // Ejercicio 2
  'coma-mal-colocada': { nombre: { es: 'Ha leído la coma en otro sitio', en: 'Read the decimal point in the wrong place' } },
  'cifras-cambiadas': { nombre: { es: 'Ha cambiado el orden de las cifras', en: 'Changed the order of the digits' } },
  'ignora-el-punto': { nombre: { es: 'Ha leído todas las cifras como un solo número, sin el punto decimal', en: 'Read all the digits as one number, ignoring the decimal point' } },
  'omite-un-cero': { nombre: { es: 'Se ha saltado un cero (los ceros de en medio cuentan)', en: 'Left out a zero (the zeros in the middle count)' } },
  'cero-de-mas': { nombre: { es: 'Ha añadido un cero que no estaba', en: 'Added a zero that was not there' } },
  'decimales-como-numero': { nombre: { es: 'Ha leído las cifras de después del punto como un solo número, no una a una', en: 'Read the digits after the point as one number, not one by one' } },
  'euros-y-centimos-cambiados': { nombre: { es: 'Ha cambiado los euros por los céntimos', en: 'Swapped the euros and the cents' } },
  'orden-mal-nombrado': { nombre: { es: 'Ha nombrado mal el último orden (décimas, centésimas, milésimas)', en: 'Named the last place wrongly (tenths, hundredths, thousandths)' } },
  'operacion-cambiada': { nombre: { es: 'Ha cambiado la operación', en: 'Changed the operation' } },
  // Ejercicio 3
  'confunde-orden-de-redondeo': { nombre: { es: 'Ha confundido a qué orden se redondea (la unidad, la décima, la centésima)', en: 'Mixed up the place to round to (unit, tenth, hundredth)' } },
  'confunde-la-operacion-pedida': { nombre: { es: 'Ha entendido otra operación u otra tarea distinta de la que pide la consigna', en: 'Understood a different operation or task from the one the instruction asks for' } },
  'confunde-la-forma-pedida': { nombre: { es: 'Ha confundido la forma que pide (fracción, decimal, palabras…)', en: 'Mixed up the form asked for (fraction, decimal, words…)' } },
  'confunde-estimar-con-calcular': { nombre: { es: 'Ha confundido estimar con calcular el resultado exacto', en: 'Mixed up estimating with working out the exact answer' } },
  'divisor-y-dividendo-cambiados': { nombre: { es: 'Ha cambiado el dividendo y el divisor', en: 'Swapped the dividend and the divisor' } },
  'confunde-lo-que-se-pide': { nombre: { es: 'Ha entendido otra pregunta distinta de la que se hace', en: 'Understood a different question from the one that is asked' } },
  // Ejercicio 4
  'otro-orden': { nombre: { es: 'Ha elegido otro orden (otra posición de la cifra)', en: 'Chose another place (another position of the digit)' } },
  'cuenta-todas-las-cifras': { nombre: { es: 'Ha contado también las cifras de antes del punto', en: 'Counted the digits before the point too' } },
  'cuenta-mal-las-cifras': { nombre: { es: 'Ha contado mal las cifras de después del punto', en: 'Miscounted the digits after the point' } },
  'palabra-parecida': { nombre: { es: 'Ha elegido una palabra que se parece, pero no es la del enunciado', en: 'Chose a word that looks alike but is not the right one' } },
  'palabra-que-no-encaja': { nombre: { es: 'Ha elegido una palabra que no encaja con la frase', en: 'Chose a word that does not fit the sentence' } },
  'confunde-el-papel-del-numero': { nombre: { es: 'Ha confundido el papel de un número en la división (dividend, divisor, quotient, remainder)', en: 'Mixed up the role of a number in the division (dividend, divisor, quotient, remainder)' } },
  'confunde-periodico-con-exacto': { nombre: { es: 'Ha confundido un decimal periódico con uno exacto', en: 'Mixed up a recurring decimal with a terminating one' } },
  'confunde-el-signo-de-comparar': { nombre: { es: 'Ha elegido la comparación al revés', en: 'Chose the comparison the wrong way round' } },
  'confunde-los-separadores': { nombre: { es: 'Ha confundido el punto y la coma: en inglés es al revés que en español', en: 'Mixed up the point and the comma: in English it is the other way round from Spanish' } },
};

/** Nombre {es, en} de cualquier error de la práctica. */
export const nombreDe = id => (ERRORES_TIPICOS[id] ?? ERRORES_LEELO[id])?.nombre;
export const ESTA_DEFINIDO = id => Boolean(nombreDe(id));
const minus = s => s.charAt(0).toLowerCase() + s.slice(1);

// ─── Casos reservados: la hoja de la unidad (en claro) y el examen semanal (por huella) ─────

/** FNV-1a de 32 bits (base 36): los casos de examen no se escriben en claro en el código publicado. */
export const huella = s => { let h = 0x811c9dc5; for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); };
/** Huellas de `aTexto(normalizado, 'en')` de los decimales de un solo valor de los exámenes semanales 1 y 2 y del final (60). */
export const HUELLAS_EXAMEN = new Set(["1kfyr0v","ad121r","8jo1lp","10he2ti","qw1ls2","15100ji","14iyva9","iyx1u7","ms9w10","1q9n93b","1y8w6mx","d5wduu","147talk","1ata0jh","1b65xl6","o0tqbc","1b3cotw","yqznr7","15g7hwv","mkvgwe","1kflphe","1g4e7f3","1r2vszr","qga3s1","1et2127","1qhjj8g","1i63a1t","1fsk7dm","9o6p3d","1xs1m16","khz6fy","1aam1sg","1t3kc5f","csnlf9","12jd62a","by18bs","1uresta","1wffkh3","dc2eam","z4ky8h","1oemsf4","1c3m5vy","1hn5pz8","10cbsoz","1whu9q1","y5czx","1ymkpgn","dk4y9i","19feh0v","1sik2qy","124erqn","1oryhub","oxra4h","1pcfobw","cgbrr6","ibgecm","1igldxc","ns1bn0","15gvs0g","11c6j3m"]);

// Todos los decimales que aparecen en las hojas de las semanas 1 y 2 (alumnos y soluciones): ninguno sale como caso.
const DECIMALES_DE_LA_HOJA = `0.001 0.003 0.004 0.0049 0.006 0.008 0.01 0.012 0.027 0.03 0.04 0.042 0.045 0.05 0.052 0.059 0.06 0.07 0.072
0.08 0.09 0.1 0.12 0.125 0.13 0.15 0.1666 0.17 0.2 0.20 0.24 0.25 0.27 0.3 0.36 0.37 0.38 0.4 0.40 0.41 0.42 0.44 0.456 0.46
0.5 0.509 0.51 0.58 0.59 0.6 0.601 0.61 0.63 0.64 0.65 0.7 0.72 0.75 0.78 0.8 0.80 0.819 0.82 0.84 0.85 0.9 0.90 0.92 0.996
1.04 1.05 1.07 1.1 1.2 1.20 1.25 1.3 1.30 1.4 1.5 1.6 1.61 1.69 1.7 1.8 1.85 1.9 11.35 12.09 12.1 12.400 12.5 12.6 12.65
12.849 12.9 13.8 14.6 14.9 15.08 15.19 15.2 15.996 2.04 2.08 2.1 2.10 2.14 2.2 2.3 2.4 2.5 2.50 2.53 2.6 2.7 2.75 2.8 2.80
2.85 2.9 20.00 21.4 21.6 22.9 23.8 3.005 3.04 3.05 3.096 3.1 3.2 3.25 3.4 3.40 3.45 3.5 3.50 3.6 3.60 3.65 3.7 3.70 3.8
3.85 3.9 31.2 32.9 4.0 4.1 4.10 4.12 4.2 4.25 4.3 4.37 4.5 4.50 4.6 4.7 4.726 4.8 4.98 41.4 45.6 5.0 5.00 5.07 5.093
5.16 5.2 5.3 5.6 5.60 5.7 5.79 5.791 5.8 5.847 5.85 5.9 5.97 56.2 6.03 6.1 6.2 6.25 6.28 6.3 6.30 6.300 6.318 6.349
6.35 6.4 6.5 6.65 6.7 6.8 6.82 6.9 60.3 7.050 7.2 7.206 7.35 7.354 7.4 7.5 7.64 7.75 74.40 8.03 8.033 8.12 8.15 8.19
8.263 8.3 8.31 8.6 8.60 8.602 8.62 8.7 8.70 81.9 9.05 9.1 9.153 9.2 9.25 9.3 9.304 9.6 9.8 15.06 2.005 0.2 0.20 0.007 4.08 0.009`;
export const RESERVADOS_HOJA = new Set(DECIMALES_DE_LA_HOJA.split(/\s+/).map(t => deTexto(t).clave()));

// Fracciones de las hojas (dfrac): no salen en la consigna de convertir.
const FRACCIONES_DE_LA_HOJA = new Set(['11/5', '11/8', '19/20', '1/100', '1/10', '1/2', '1/4', '1/5', '1/8', '22/10', '2/5', '31/10',
  '36/100', '3/4', '463/100', '4/5', '4/9', '5/3', '7/25', '8/10', '9/1000', '9/25', '9/40', '1/6', '1/3', '2/3'].map(t => { const [n, d] = t.split('/').map(Number); return fraccion(n, d).simplificar().clave(); }));

export const esReservado = d => {
  const n = d.normalizar();
  return RESERVADOS_HOJA.has(n.clave()) || HUELLAS_EXAMEN.has(huella(aTexto(n, 'en')));
};
const fraccionReservada = f => FRACCIONES_DE_LA_HOJA.has(f.simplificar().clave());

// ─── Utilidades ──────────────────────────────────────────────────────────────────────────

class ItemPobre extends Error {}

const par = (es, en) => ({ es, en });
const num = (d, idioma) => aTexto(d, idioma);
const partes = d => { const [e, dec = ''] = aTexto(d, 'en').split('.'); return { e, dec }; };
const SIN_CEROS_FINALES = d => d.normalizar().k === d.k;

/** Una de cada error primero (al azar), luego las que sobren, sin textos repetidos ni valores repetidos. */
function elegirFalsas(rng, falsas, n = 3) {
  const vistos = new Set();
  const vistosValor = new Set();
  const unicas = [];
  for (const f of rng.barajar(falsas)) {
    if (vistos.has(f.texto)) continue;
    if (f.valor !== undefined) {
      const clave = f.valor.clave();
      if (vistosValor.has(clave)) continue;
      vistosValor.add(clave);
    }
    vistos.add(f.texto);
    unicas.push(f);
  }
  const elegidas = [];
  const errores = new Set();
  for (const f of unicas) {
    if (elegidas.length >= n) break;
    if (!errores.has(f.error)) { errores.add(f.error); elegidas.push(f); }
  }
  for (const f of unicas) {
    if (elegidas.length >= n) break;
    if (!elegidas.includes(f)) elegidas.push(f);
  }
  return elegidas;
}

function armar(rng, { plantilla, instruccion, notacion = '', correcta, falsas, solucion, sesion, minFalsas = 3 }) {
  const buenas = elegirFalsas(rng, falsas.filter(f => f.texto !== correcta.texto));
  if (buenas.length < minFalsas) throw new ItemPobre(plantilla);
  const quitar = ({ valor, ...resto }) => resto;       // el valor interno no va en el ítem
  const opciones = rng.barajar([{ ...quitar(correcta), correcta: true, error: null }, ...buenas.map(f => ({ ...quitar(f), correcta: false }))]);
  return { plantilla, instruccion, notacion, opciones, solucion, sesion };
}

/** Elige una plantilla y repite hasta que el ítem salga con las opciones suficientes. */
function generarDe(rng, plantillas, sesion) {
  for (let i = 0; i < 80; i++) {
    try {
      return rng.elegir(plantillas)(rng, sesion);
    } catch (e) {
      if (!(e instanceof ItemPobre)) throw e;
    }
  }
  throw new Error('No se ha podido generar un ítem');
}

/** Un decimal con `k` cifras (sin ceros al final), parte entera en `entera`, que no sea un caso reservado. */
function decimalAzar(rng, { k = [1, 2, 3], entera = [1, 99], ceroEnMedio = false } = {}) {
  for (let i = 0; i < 400; i++) {
    const kk = Array.isArray(k) ? rng.elegir(k) : k;
    if (ceroEnMedio && kk < 2) continue;
    const e = rng.entero(entera[0], entera[1]);
    const dig = Array.from({ length: kk }, () => rng.entero(0, 9));
    dig[kk - 1] = rng.entero(1, 9);
    if (ceroEnMedio) dig[rng.entero(0, kk - 2)] = 0;
    const d = decimal(e * 10 ** kk + Number(dig.join('')), kk);
    if (!esReservado(d)) return d;
  }
  throw new Error('No se ha podido sacar un decimal libre');
}

const entera01 = rng => (rng.azar() < 0.25 ? [0, 0] : [1, 99]);
const notacionDe = (texto, clase = 'operacion') => `<div class="${clase}">${texto}</div>`;
const frase = (texto, lang = 'en') => `<p class="texto-en" lang="${lang}">${texto}</p>`;

// ─── Ejercicio 1 · La palabra ────────────────────────────────────────────────────────────
//
// Cada término lleva una `familia`: en un ítem no entran dos de la misma, porque serían casi
// sinónimos y el alumno podría darlos por buenos. `contrario` es el término con el que más se
// confunde; `confusion` es una palabra que no está en la lista pero se parece (tens, hundreds…).
// *nought* y *zero*, *proof* y *test* valen las dos: solo una de cada pareja es término.

export const VOCABULARIO = [
  // sesión 1-3 (U5-1B-04, 1B-06, 1B-07)
  { id: 'decimal-point', en: 'decimal point', es: 'la coma decimal', sesion: 1, familia: 'coma' },
  { id: 'decimal-places', en: 'decimal places', es: 'las cifras decimales', sesion: 1, familia: 'cifra' },
  { id: 'digit', en: 'digit', es: 'cifra', sesion: 1, familia: 'cifra' },
  { id: 'whole-part', en: 'whole part', es: 'parte entera', sesion: 1, familia: 'parte' },
  { id: 'tenths', en: 'tenths', es: 'décimas', sesion: 1, familia: 'decimas', confusion: { en: 'tens', es: 'decenas' } },
  { id: 'hundredths', en: 'hundredths', es: 'centésimas', sesion: 1, familia: 'centesimas', confusion: { en: 'hundreds', es: 'centenas' } },
  { id: 'thousandths', en: 'thousandths', es: 'milésimas', sesion: 1, familia: 'milesimas', confusion: { en: 'thousands', es: 'unidades de millar' } },
  { id: 'nought', en: 'nought', es: 'cero', sesion: 1, familia: 'cero' },
  { id: 'greater', en: 'greater than', es: 'mayor que', sesion: 2, familia: 'mayor', contrario: 'less' },
  { id: 'less', en: 'less than', es: 'menor que', sesion: 2, familia: 'menor', contrario: 'greater' },
  { id: 'between', en: 'between', es: 'entre (en medio de)', sesion: 2, familia: 'entre' },
  { id: 'ascending', en: 'in ascending order', es: 'de menor a mayor', sesion: 2, familia: 'ascendente', contrario: 'descending' },
  { id: 'descending', en: 'in descending order', es: 'de mayor a menor', sesion: 2, familia: 'descendente', contrario: 'ascending' },
  { id: 'round', en: 'to round', es: 'redondear', sesion: 2, familia: 'redondear' },
  { id: 'nearest-whole', en: 'to the nearest whole number', es: 'a la unidad más cercana', sesion: 2, familia: 'redondeo-unidad', contrario: 'one-place' },
  { id: 'one-place', en: 'to one decimal place', es: 'a la décima', sesion: 2, familia: 'redondeo-decima', contrario: 'two-places' },
  { id: 'two-places', en: 'to two decimal places', es: 'a la centésima', sesion: 2, familia: 'redondeo-centesima', contrario: 'one-place' },
  { id: 'estimate', en: 'to estimate', es: 'estimar (calcular a ojo)', sesion: 2, familia: 'estimar' },
  { id: 'change', en: 'change', es: 'la vuelta (lo que te devuelven al pagar)', sesion: 3, familia: 'vuelta' },
  { id: 'lap', en: 'lap', es: 'vuelta a la pista', sesion: 2, familia: 'vuelta' },
  { id: 'per-litre', en: 'per litre', es: 'por litro', sesion: 3, familia: 'por-litro' },
  { id: 'weighs', en: 'weighs', es: 'pesa', sesion: 3, familia: 'pesa' },
  { id: 'cents', en: 'cents', es: 'céntimos', sesion: 3, familia: 'centimos' },
  // sesión 5-6 (U5-2B-01, 2B-02)
  { id: 'dividend', en: 'dividend', es: 'dividendo', sesion: 5, familia: 'dividendo', contrario: 'divisor' },
  { id: 'divisor', en: 'divisor', es: 'divisor', sesion: 5, familia: 'divisor', contrario: 'dividend' },
  { id: 'quotient', en: 'quotient', es: 'cociente', sesion: 5, familia: 'cociente', contrario: 'remainder' },
  { id: 'remainder', en: 'remainder', es: 'resto', sesion: 5, familia: 'resto', contrario: 'quotient' },
  { id: 'proof', en: 'proof', es: 'la prueba (de la división)', sesion: 5, familia: 'prueba' },
  { id: 'convert', en: 'to convert', es: 'pasar de una forma a otra (convertir)', sesion: 5, familia: 'convertir' },
  { id: 'recurring', en: 'recurring decimal', es: 'decimal periódico', sesion: 5, familia: 'periodico', contrario: 'terminating' },
  { id: 'terminating', en: 'terminating decimal', es: 'decimal exacto (que termina)', sesion: 5, familia: 'exacto', contrario: 'recurring' },
  { id: 'simplest', en: 'in its simplest form', es: 'en su forma más simple (irreducible)', sesion: 5, familia: 'irreducible' },
];

const POR_ID = new Map(VOCABULARIO.map(v => [v.id, v]));
export const terminoDe = id => POR_ID.get(id);

/** Parejas de sinónimos válidos: nunca se enfrentan en un ítem (las comprueba el test). */
export const SINONIMOS = [
  ['nought', 'zero'], ['proof', 'test'], ['proof', 'check'], ['decimal places', 'digits after the decimal point'],
  ['to one decimal place', 'to the nearest tenth'], ['to two decimal places', 'to the nearest hundredth'],
  ['to the nearest whole number', 'to the nearest unit'], ['terminating decimal', 'exact decimal'], ['recurring decimal', 'repeating decimal'],
  ['in its simplest form', 'in lowest terms'], ['decimal point', 'decimal comma'],
];

/** Un término del vocabulario y cuatro significados en español, o un significado y cuatro términos en inglés. */
export function generarPalabra(rng, sesion) {
  const t = rng.elegir(VOCABULARIO);
  const sentido = rng.elegir(['en-es', 'es-en']);
  const opcion = (v, error, extra = {}) => (sentido === 'en-es'
    ? { texto: v.es, error, por_que: par(`«${v.es}» se dice «${v.en}» en inglés, no «${t.en}» (${t.es}).`, `“${v.es}” is “${v.en}” in English, not “${t.en}” (${t.es}).`), ...extra }
    : { texto: v.en, error, por_que: par(`«${v.en}» significa «${v.es}», no «${t.es}».`, `“${v.en}” means “${v.es}”, not “${t.es}”.`), ...extra });
  const falsas = [];
  if (t.confusion) falsas.push(opcion(t.confusion, 'confunde-parecidas'));
  if (t.contrario) falsas.push(opcion(POR_ID.get(t.contrario), 'confunde-contrarios'));
  const familias = new Set([t.familia, ...(t.contrario ? [POR_ID.get(t.contrario).familia] : [])]);
  for (const v of rng.barajar(VOCABULARIO)) {
    if (falsas.length >= 6) break;
    if (familias.has(v.familia)) continue;
    familias.add(v.familia);
    falsas.push(opcion(v, 'vocabulario-confundido'));
  }
  // La del contrario o la parecida van siempre; las demás, al azar.
  const fijas = falsas.filter(f => f.error !== 'vocabulario-confundido');
  const otras = rng.barajar(falsas.filter(f => f.error === 'vocabulario-confundido'));
  const elegidas = [...fijas, ...otras].slice(0, 3);
  const correcta = sentido === 'en-es' ? { texto: t.es } : { texto: t.en };
  const apoyo = t.id === 'proof' ? par(' (También se dice «test».)', ' (It is also called “test”.)') : t.id === 'nought' ? par(' (También se dice «zero».)', ' (It is also called “zero”.)') : par('', '');
  return armar(rng, {
    plantilla: sentido === 'en-es' ? 'palabra_en_es' : 'palabra_es_en',
    instruccion: sentido === 'en-es' ? 'palabra_en_es' : 'palabra_es_en',
    notacion: sentido === 'en-es' ? frase(`<strong>${t.en}</strong>`) : frase(`<strong>${t.es}</strong>`, 'es'),
    correcta, falsas: elegidas, sesion: t.sesion,
    solucion: par(`«${t.en}» significa «${t.es}».${apoyo.es}`, `“${t.en}” means “${t.es}”.${apoyo.en}`),
  });
}

// ─── Ejercicio 2 · Léelo ─────────────────────────────────────────────────────────────────

const falsaLectura = (d, v, texto, error) => ({
  texto, valor: v, error,
  por_que: par(`«${texto}» es ${num(v, 'es')}, no ${num(d, 'es')}: ${minus(nombreDe(error).es)}.`, `“${texto}” is ${num(v, 'en')}, not ${num(d, 'en')}: ${minus(nombreDe(error).en)}.`),
});

/** Los decimales equivocados de los errores típicos de lectura y escritura (todos de valor distinto del bueno). */
function decimalesMalos(d) {
  const { e, dec } = partes(d);
  const lista = [];
  const poner = (v, error) => { if (v && !v.equals(d) && SIN_CEROS_FINALES(v)) lista.push({ v, error }); };
  poner(porPotenciaDe10(d, 1), 'coma-mal-colocada');
  poner(porPotenciaDe10(d, -1), 'coma-mal-colocada');
  // Cifras cambiadas: la entera (si tiene una cifra) con la primera decimal; si no, las decimales al revés.
  if (e.length === 1 && e[0] !== dec[0]) poner(deTexto(`${dec[0]}.${e}${dec.slice(1)}`), 'cifras-cambiadas');
  else if (dec.length >= 2) poner(deTexto(`${e}.${[...dec].reverse().join('')}`), 'cifras-cambiadas');
  poner(decimal(Number(e + dec), 0), 'ignora-el-punto');
  const cero = dec.slice(0, -1).indexOf('0');
  if (cero >= 0) poner(deTexto(`${e}.${dec.slice(0, cero)}${dec.slice(cero + 1)}`), 'omite-un-cero');
  if (dec.length < 3) poner(deTexto(`${e}.0${dec}`), 'cero-de-mas');
  return lista;
}

function leerDecimalItem(rng, sesion) {
  const idi = sesion?.idioma ?? 'es';
  const d = decimalAzar(rng, { k: [1, 2, 2, 3, 3], entera: entera01(rng) });
  const { e, dec } = partes(d);
  const validas = lecturasValidas(d, 'en');
  const buena = rng.elegir(validas);
  const falsas = [];
  for (const { v, error } of decimalesMalos(d)) {
    const texto = ['ignora-el-punto'].includes(error) ? enPalabras(v, 'en') : enPalabras(v, 'en');
    if (esLecturaValida(d, texto, 'en')) continue;
    falsas.push(falsaLectura(d, v, texto, error));
  }
  if (dec.length === 3 && dec[0] !== '0') {
    const texto = `${e === '0' ? 'nought' : w(Number(e))} point ${w(Number(dec))}`;
    falsas.push({ texto, error: 'decimales-como-numero', por_que: par(`«${texto}» lee las cifras de después del punto como un solo número; hay que decirlas una a una.`, `“${texto}” reads the digits after the point as one number; you have to say them one by one.`) });
  }
  const otras = validas.filter(l => l !== buena).slice(0, 2);
  const tambien = idioma => (otras.length ? (idioma === 'es' ? `; también vale ${otras.map(o => `«${o}»`).join(' o ')}` : `; ${otras.map(o => `“${o}”`).join(' or ')} also works`) : '');
  return armar(rng, {
    plantilla: 'leer_decimal', instruccion: 'leer_decimal', notacion: notacionDe(num(d, idi)),
    correcta: { texto: buena }, falsas, sesion: 1,
    solucion: par(`${num(d, 'es')} se lee «${buena}»${tambien('es')}. Después de la coma (en inglés, «point»), las cifras se dicen una a una.`,
      `${num(d, 'en')} is read “${buena}”${tambien('en')}. After the point, the digits are said one by one.`),
  });
}

// Dinero: euros y céntimos.
const eurosEn = n => `${w(n)} ${n === 1 ? 'euro' : 'euros'}`;
const centsEn = n => `${w(n)} ${n === 1 ? 'cent' : 'cents'}`;
const dineroEn = (eur, cts) => (eur > 0 && cts > 0 ? `${eurosEn(eur)} ${w(cts)}` : eur > 0 ? eurosEn(eur) : centsEn(cts));
const aDinero = (eur, cts) => decimal(eur * 100 + cts, 2);

function leerDineroItem(rng, sesion) {
  const idi = sesion?.idioma ?? 'es';
  let eur, cts, d;
  for (;;) {
    eur = rng.azar() < 0.3 ? 0 : rng.entero(1, 59);
    cts = rng.elegir([...Array.from({ length: 99 }, (_, i) => i + 1), 5, 5, 10, 20, 25, 50, 50, 75, 90]);
    d = aDinero(eur, cts);
    if (!esReservado(d.normalizar())) break;
  }
  const buena = rng.elegir(lecturasDinero(d, 'en'));
  const validas = lecturasDinero(d, 'en').map(t => t.toLowerCase());
  const falsas = [];
  const poner = (eur2, cts2, error) => {
    if (eur2 < 0 || cts2 < 0 || cts2 > 99 || eur2 + cts2 === 0 || (eur2 === eur && cts2 === cts)) return;
    const texto = dineroEn(eur2, cts2);
    if (validas.includes(texto)) return;
    const v = aDinero(eur2, cts2);
    falsas.push({
      texto, valor: v, error,
      por_que: par(`«${texto}» es ${dinero(v, 'es')}, no ${dinero(d, 'es')}: ${minus(nombreDe(error).es)}.`, `“${texto}” is ${dinero(v, 'en')}, not ${dinero(d, 'en')}: ${minus(nombreDe(error).en)}.`),
    });
  };
  if (eur > 0) poner(cts, eur, 'euros-y-centimos-cambiados');                      // seventy-five euros three
  if (cts >= 10 && cts % 11 !== 0 && cts % 10 !== 0) poner(eur, Number(String(cts).split('').reverse().join('')), 'cifras-cambiadas');
  poner(eur * 100 + cts, 0, 'ignora-el-punto');                                       // three hundred and seventy-five euros
  if (cts < 10) poner(eur, cts * 10, 'decimas-por-centesimas');                        // 3.05 → three euros fifty
  else if (cts % 10 === 0) poner(eur, cts / 10, 'decimas-por-centesimas');             // 3.50 → three euros five
  if (eur === 0) poner(cts, 0, 'euros-y-centimos-cambiados');                          // fifty cents → fifty euros
  return armar(rng, {
    plantilla: 'leer_dinero', instruccion: 'leer_dinero', notacion: notacionDe(dinero(d, idi)),
    correcta: { texto: buena }, falsas, sesion: 3,
    solucion: par(`${dinero(d, 'es')} se lee «${buena}». (Con «and … cents» y sin «cents» también vale.)`,
      `${dinero(d, 'en')} is read “${buena}”. (With “and … cents” and without “cents” also works.)`),
  });
}

// Las lecturas al revés: de las palabras (en inglés o en español) a las cifras.
function deLecturaACifras(rng, sesion, { idiomaPalabras, plantilla, instruccion }) {
  const idi = sesion?.idioma ?? 'es';
  const d = decimalAzar(rng, { k: [2, 2, 3], entera: entera01(rng), ceroEnMedio: rng.azar() < 0.6 });
  let validas = lecturasValidas(d, idiomaPalabras);
  if (idiomaPalabras === 'es') validas = validas.filter(t => !/\bcoma\b/.test(t) || rng.azar() < 0.4);
  const palabras = rng.elegir(validas);
  const falsas = decimalesMalos(d).map(({ v, error }) => ({
    texto: num(v, idi), valor: v, error,
    por_que: par(`${num(v, 'es')} se lee «${enPalabras(v, idiomaPalabras)}»; el ejercicio dice «${palabras}».`, `${num(v, 'en')} is read “${enPalabras(v, idiomaPalabras)}”; the exercise says “${palabras}”.`),
  }));
  return armar(rng, {
    plantilla, instruccion, notacion: frase(palabras, idiomaPalabras),
    correcta: { texto: num(d, idi) }, falsas, sesion: 1,
    solucion: par(`«${palabras}» se escribe ${num(d, 'es')}.`, `“${palabras}” is written ${num(d, 'en')}.`),
  });
}
const palabrasACifrasEn = (rng, sesion) => deLecturaACifras(rng, sesion, { idiomaPalabras: 'en', plantilla: 'cifras_de_palabras_en', instruccion: 'cifras_de_palabras' });
const palabrasACifrasEs = (rng, sesion) => deLecturaACifras(rng, sesion, { idiomaPalabras: 'es', plantilla: 'cifras_de_palabras_es', instruccion: 'cifras_de_palabras' });

// De las cifras a la lectura en español con los nombres de los órdenes (U5-1B-02).
const femenino = t => t.replace(/ientos\b/g, 'ientas').replace(/uno$/, 'una').replace(/\bun$/, 'una');
const lecturaConOrdenes = (entera, decEntero, k) => {
  const orden = ORDENES[-k];
  const unidades = `${femenino(numeroAEspanol(entera))} ${entera === 1 ? 'unidad' : 'unidades'}`;
  return `${unidades} y ${femenino(numeroAEspanol(decEntero))} ${decEntero === 1 ? orden.singular.es : orden.es}`;
};

function leerEnEspanolItem(rng, sesion) {
  const idi = sesion?.idioma ?? 'es';
  const d = decimalAzar(rng, { k: [1, 2, 3], entera: [1, 99] });
  const { e, dec } = partes(d);
  const k = dec.length;
  const buena = lecturaConOrdenes(Number(e), Number(dec), k);
  if (!esLecturaValida(d, buena, 'es')) throw new ItemPobre('leer_en_espanol');
  const falsas = [];
  for (const k2 of [1, 2, 3]) {
    if (k2 === k) continue;
    const texto = lecturaConOrdenes(Number(e), Number(dec), k2);
    falsas.push({
      texto, error: 'orden-mal-nombrado',
      por_que: par(`«${dec}» después de la coma son ${k} cifras: se llaman ${ORDENES[-k].es}, no ${ORDENES[-k2].es}.`, `${dec} after the point is ${k} digits: they are ${ORDENES[-k].es}, not ${ORDENES[-k2].es}.`),
    });
  }
  for (const [v, error] of [[porPotenciaDe10(d, 1), 'coma-mal-colocada'], [porPotenciaDe10(d, -1), 'coma-mal-colocada']]) {
    const p = partes(v);
    if (p.dec.length > 3) continue;
    const texto = p.dec ? lecturaConOrdenes(Number(p.e), Number(p.dec), p.dec.length) : `${femenino(numeroAEspanol(Number(p.e)))} unidades`;
    if (esLecturaValida(d, texto, 'es')) continue;
    falsas.push({
      texto, error,
      por_que: par(`Eso es ${num(v, 'es')}, no ${num(d, 'es')}: ${minus(nombreDe(error).es)}.`, `That is ${num(v, 'en')}, not ${num(d, 'en')}: ${minus(nombreDe(error).en)}.`),
    });
  }
  return armar(rng, {
    plantilla: 'leer_en_espanol', instruccion: 'leer_en_espanol', notacion: notacionDe(num(d, idi)),
    correcta: { texto: buena }, falsas, sesion: 1,
    solucion: par(`${num(d, 'es')} se lee «${buena}»: la última cifra manda el nombre (${ORDENES[-k].es}).`, `${num(d, 'en')} is read “${buena}” in Spanish: the last digit gives the name (${ORDENES[-k].es}).`),
  });
}

// Una cuenta con decimales y su resultado (U5-2B-03).
const SIMBOLO = { '+': '+', '-': MENOS, '*': '·', ':': ':' };
const OTRA_OP = { '+': '-', '-': '+', '*': ':', ':': '*' };
const leerEn = d => enPalabras(d, 'en');

function operandos(rng, op) {
  for (let i = 0; i < 300; i++) {
    let a, b, c;
    if (op === '+' || op === '-') {
      a = decimalAzar(rng, { k: [1, 2], entera: [1, 40] });
      b = decimalAzar(rng, { k: [1, 2], entera: [0, 30] });
      if (op === '-') { if (comparar(a, b) <= 0) continue; c = restar(a, b); } else c = sumar(a, b);
    } else if (op === '*') {
      a = decimalAzar(rng, { k: 1, entera: [1, 9] });
      b = rng.azar() < 0.4 ? decimal(rng.entero(2, 9), 0) : decimalAzar(rng, { k: [1, 2], entera: [0, 9] });
      c = multiplicar(a, b);
    } else {
      const divisor = decimal(rng.entero(2, 9), 0);
      c = decimalAzar(rng, { k: [1, 2], entera: [1, 9] });
      b = divisor;
      a = multiplicar(c, b);
      if (esReservado(a.normalizar())) continue;
    }
    if (!SIN_CEROS_FINALES(c) || c.k > 3 || esReservado(c.normalizar())) continue;
    if (op === ':' ? !SIN_CEROS_FINALES(a) : false) continue;
    return { a, b, c };
  }
  throw new ItemPobre('leer_cuenta');
}

function leerCuentaItem(op, sesion) {
  return (rng, ses) => {
    const idi = ses?.idioma ?? 'es';
    const { a, b, c } = operandos(rng, op);
    const est = { por: rng.elegir(['times', 'multiplied by']), igual: rng.elegir(['equals', 'is']) };
    const VERBOS = { '+': 'plus', '-': 'minus', '*': est.por, ':': 'divided by' };
    const lee = (x, o, y, z) => `${leerEn(x)} ${VERBOS[o]} ${leerEn(y)} ${est.igual} ${leerEn(z)}`;
    const buena = lee(a, op, b, c);
    const cuenta = x => `${num(x[0], idi)} ${SIMBOLO[x[1]]} ${num(x[2], idi)} = ${num(x[3], idi)}`;
    const cuentaIdioma = (x, i) => `${num(x[0], i)} ${SIMBOLO[x[1]]} ${num(x[2], i)} = ${num(x[3], i)}`;
    const falsas = [{
      texto: lee(a, OTRA_OP[op], b, c), error: 'operacion-cambiada',
      por_que: par(`El signo es «${SIMBOLO[op]}», no «${SIMBOLO[OTRA_OP[op]]}»: se lee «${VERBOS[op]}», no «${VERBOS[OTRA_OP[op]]}».`, `The sign is “${SIMBOLO[op]}”, not “${SIMBOLO[OTRA_OP[op]]}”: it is read “${VERBOS[op]}”, not “${VERBOS[OTRA_OP[op]]}”.`),
    }];
    const resultados = [];
    const poner = (v, error) => { if (v && v.m > 0 && !v.equals(c) && !resultados.some(r => r.v.equals(v)) && SIN_CEROS_FINALES(v)) resultados.push({ v, error }); };
    if (op === '+' || op === '-') poner(alinearDerecha(a, b, op), 'alinea-a-la-derecha');
    if (op === '*') poner(comaMalPuesta(a, b), 'coma-mal-puesta');
    if (op === ':') poner(olvidarComaCociente(a, b), 'olvida-coma-cociente');
    poner(porPotenciaDe10(c, 1), 'coma-mal-colocada');
    poner(porPotenciaDe10(c, -1), 'coma-mal-colocada');
    for (const { v, error } of resultados) {
      falsas.push({
        texto: lee(a, op, b, v), error,
        por_que: par(`El resultado es ${num(c, 'es')}, no ${num(v, 'es')}: ${minus(nombreDe(error).es)}.`, `The answer is ${num(c, 'en')}, not ${num(v, 'en')}: ${minus(nombreDe(error).en)}.`),
      });
    }
    for (const [cual, x] of [['primer', a], ['segundo', b]]) {
      const v = x.k > 0 ? porPotenciaDe10(x, -1) : null;
      if (!v || !SIN_CEROS_FINALES(v)) continue;
      falsas.push({
        texto: cual === 'primer' ? lee(v, op, b, c) : lee(a, op, v, c),
        error: 'coma-mal-colocada',
        por_que: par(`El ${cual} número es ${num(x, 'es')}, no ${num(v, 'es')}: ${minus(nombreDe('coma-mal-colocada').es)}.`, `The ${cual === 'primer' ? 'first' : 'second'} number is ${num(x, 'en')}, not ${num(v, 'en')}: ${minus(nombreDe('coma-mal-colocada').en)}.`),
      });
    }
    return armar(rng, {
      plantilla: `leer_cuenta_${{ '+': 'suma', '-': 'resta', '*': 'producto', ':': 'cociente' }[op]}`, instruccion: 'leer_cuenta',
      notacion: notacionDe(cuenta([a, op, b, c])), correcta: { texto: buena }, falsas, sesion,
      solucion: par(`${cuentaIdioma([a, op, b, c], 'es')} se lee «${buena}». («${op === '*' ? 'times» y «multiplied by» valen las dos; «' : ''}equals» e «is» valen las dos.)`,
        `${cuentaIdioma([a, op, b, c], 'en')} is read “${buena}”. (${op === '*' ? '“times” and “multiplied by” are both fine; ' : ''}“equals” and “is” are both fine.)`),
    });
  };
}

export const PLANTILLAS_LEELO = [
  leerDecimalItem, leerDecimalItem, leerDecimalItem,
  leerDineroItem, leerDineroItem,
  palabrasACifrasEn, palabrasACifrasEn, palabrasACifrasEs, leerEnEspanolItem,
  leerCuentaItem('+', 5), leerCuentaItem('-', 5), leerCuentaItem('*', 5), leerCuentaItem(':', 5),
];
export const generarLeelo = (rng, sesion) => generarDe(rng, PLANTILLAS_LEELO, sesion);

// ─── Ejercicio 3 · La consigna ───────────────────────────────────────────────────────────
//
// La instrucción va en inglés y las cuatro opciones son la instrucción en español. No hay que
// calcular: la palabra que decide está en la consigna y la solución dice qué significa.

const REDONDEO = [
  { c: 0, en: 'to the nearest whole number', es: 'a la unidad más cercana' },
  { c: 1, en: 'to one decimal place', es: 'a la décima' },
  { c: 2, en: 'to two decimal places', es: 'a la centésima' },
];

const consigna = (rng, { plantilla, en, ok, falsas, solucion, sesion }) => armar(rng, {
  plantilla, instruccion: 'consigna', notacion: frase(en), correcta: { texto: ok }, falsas, solucion, sesion,
});

function consignaRedondear(rng) {
  const d = decimalAzar(rng, { k: 3, entera: [1, 99] });
  const R = rng.elegir(REDONDEO);
  const x = num(d, 'en'), xe = num(d, 'es');
  const falsas = REDONDEO.filter(o => o.c !== R.c).map(o => ({
    texto: `Redondea ${xe} ${o.es}`, error: 'confunde-orden-de-redondeo',
    por_que: par(`«${o.en}» es «${o.es}»; la consigna dice «${R.en}» (${R.es}).`, `“${o.en}” is “${o.es}” in Spanish; the instruction says “${R.en}” (${R.es}).`),
  }));
  falsas.push({
    texto: `Corta ${xe} ${R.es}, sin redondear`, error: 'redondea-truncando',
    por_que: par('«Round» es redondear (mirar la cifra siguiente), no cortar; cortar se diría «cut».', '“Round” means looking at the next digit, not cutting the number off; cutting would be “cut”.'),
  });
  return consigna(rng, {
    plantilla: 'consigna_redondear', en: `Round ${x} ${R.en}.`, ok: `Redondea ${xe} ${R.es}`, falsas, sesion: 2,
    solucion: par(`«Round ${R.en}» es «redondea ${R.es}».`, `“Round ${R.en}” means: look at the next digit and round ${R.en}.`),
  });
}

function consignaFraccion(rng) {
  const d = decimalAzar(rng, { k: [2, 3], entera: [0, 2] });
  const x = num(d, 'en'), xe = num(d, 'es');
  return consigna(rng, {
    plantilla: 'consigna_fraccion', en: `Write ${x} as a fraction in its simplest form.`, ok: `Escribe ${xe} como fracción irreducible (la más simple)`,
    falsas: [
      { texto: `Escribe ${xe} como fracción decimal, sin simplificar`, error: 'confunde-la-forma-pedida', por_que: par('«In its simplest form» pide simplificar al máximo; sin simplificar sería la fracción decimal.', '“In its simplest form” asks for the smallest numbers; without simplifying it would be the decimal fraction.') },
      { texto: `Escribe ${xe} con palabras, en inglés`, error: 'confunde-la-forma-pedida', por_que: par('«As a fraction» pide una fracción, no escribir el número con palabras.', '“As a fraction” asks for a fraction, not for the number in words.') },
      { texto: `Redondea ${xe} a la décima`, error: 'confunde-la-operacion-pedida', por_que: par('«Write … as a fraction» no es redondear.', '“Write … as a fraction” does not mean round.') },
    ],
    solucion: par(`«As a fraction in its simplest form» es «como fracción irreducible».`, '“In its simplest form” means the fraction cannot be made any simpler.'),
    sesion: 6,
  });
}

function consignaEntre(rng) {
  const a = decimalAzar(rng, { k: 1, entera: [1, 20] });
  const b = sumar(a, decimal(1, 1));
  if (esReservado(b.normalizar())) throw new ItemPobre('consigna_entre');
  const A = [num(a, 'en'), num(b, 'en')], Ae = [num(a, 'es'), num(b, 'es')];
  return consigna(rng, {
    plantilla: 'consigna_entre', en: `Write a decimal that is between ${A[0]} and ${A[1]}.`, ok: `Escribe un decimal que esté entre ${Ae[0]} y ${Ae[1]}`,
    falsas: [
      { texto: `Escribe un decimal mayor que ${Ae[0]} y ${Ae[1]}`, error: 'confunde-contrarios', por_que: par('«Between» es «entre»: en medio de los dos, no mayor que los dos.', '“Between” means in the middle of the two, not greater than both.') },
      { texto: `Escribe un decimal menor que ${Ae[0]} y ${Ae[1]}`, error: 'confunde-contrarios', por_que: par('«Between» es «entre»: en medio de los dos, no menor que los dos.', '“Between” means in the middle of the two, not less than both.') },
      { texto: `Escribe la suma de ${Ae[0]} y ${Ae[1]}`, error: 'confunde-la-operacion-pedida', por_que: par('«Write a decimal that is between…» no pide sumar.', '“Write a decimal that is between…” does not ask you to add.') },
    ],
    solucion: par('«Between … and …» es «entre … y …».', '“Between … and …” means in the middle of the two numbers.'), sesion: 2,
  });
}

function consignaOrden(rng) {
  const lista = [];
  while (lista.length < 3) {
    const d = decimalAzar(rng, { k: [1, 2, 3], entera: [0, 9] });
    if (!lista.some(x => x.equals(d))) lista.push(d);
  }
  const asc = rng.azar() < 0.5;
  const E = lista.map(d => num(d, 'en')).join(', '), Es = [num(lista[0], 'es'), num(lista[1], 'es')].join('; ') + ' y ' + num(lista[2], 'es');
  const dir = asc ? par('de menor a mayor', 'ascending') : par('de mayor a menor', 'descending');
  return consigna(rng, {
    plantilla: 'consigna_orden', en: `Write ${E} in ${asc ? 'ascending' : 'descending'} order.`, ok: `Ordena ${Es} ${dir.es}`,
    falsas: [
      { texto: `Ordena ${Es} ${asc ? 'de mayor a menor' : 'de menor a mayor'}`, error: 'confunde-contrarios', por_que: par(`«${asc ? 'Ascending' : 'Descending'}» es «${dir.es}», no al revés.`, `“${asc ? 'Ascending' : 'Descending'}” means ${asc ? 'from the smallest to the largest' : 'from the largest to the smallest'}, not the other way round.`) },
      { texto: `Elige el mayor de ${Es}`, error: 'confunde-lo-que-se-pide', por_que: par('«Order» pide poner los tres en fila, no elegir uno.', '“Write … in order” asks for all three numbers in a row, not for just one.') },
      { texto: `Elige el menor de ${Es}`, error: 'confunde-lo-que-se-pide', por_que: par('«Order» pide poner los tres en fila, no elegir uno.', '“Write … in order” asks for all three numbers in a row, not for just one.') },
    ],
    solucion: par(`«${asc ? 'In ascending order' : 'In descending order'}» es «${dir.es}».`, `“${asc ? 'Ascending' : 'Descending'}” means ${asc ? 'from the smallest to the largest' : 'from the largest to the smallest'}.`), sesion: 2,
  });
}

function consignaMayor(rng) {
  const a = decimalAzar(rng, { k: [1, 2], entera: [1, 9] });
  const b = decimalAzar(rng, { k: [1, 2, 3], entera: [1, 9] });
  if (comparar(a, b) === 0) throw new ItemPobre('consigna_mayor');
  const mayor = rng.elegir([true, false]);
  const [x, y] = rng.azar() < 0.5 ? [a, b] : [b, a];
  const cual = mayor ? par('mayor', 'greater') : par('menor', 'smaller');
  const err = compararPorCifras(x, y) !== null ? 'compara-por-cifras' : null;
  return consigna(rng, {
    plantilla: 'consigna_mayor', en: `Which number is ${mayor ? 'greater' : 'smaller'}, ${num(x, 'en')} or ${num(y, 'en')}?`, ok: `¿Qué número es ${cual.es}, ${num(x, 'es')} o ${num(y, 'es')}?`,
    falsas: [
      { texto: `¿Qué número es ${mayor ? 'menor' : 'mayor'}, ${num(x, 'es')} o ${num(y, 'es')}?`, error: 'confunde-contrarios', por_que: par(`«${cual.en}» es «${cual.es}», no «${mayor ? 'menor' : 'mayor'}».`, `“${cual.en}” means ${cual.es === 'mayor' ? 'bigger' : 'smaller'}, not ${mayor ? 'smaller' : 'bigger'}.`) },
      { texto: `¿Cuántas cifras decimales tiene ${num(x, 'es')}?`, error: err ?? 'confunde-lo-que-se-pide', por_que: par('La pregunta compara los dos números; no habla de contar cifras.', 'The question compares the two numbers; it does not ask you to count digits.') },
      { texto: `¿Cuánto suman ${num(x, 'es')} y ${num(y, 'es')}?`, error: 'confunde-la-operacion-pedida', por_que: par('«Which number is…» pide elegir uno de los dos, no sumarlos.', '“Which number is…” asks you to choose one of the two, not to add them.') },
    ],
    solucion: par(`«${mayor ? 'Greater' : 'Smaller'}» es «${cual.es}».`, `“${mayor ? 'Greater' : 'Smaller'}” means ${cual.es}.`), sesion: 2,
  });
}

function consignaEstimar(rng) {
  const a = decimalAzar(rng, { k: 1, entera: [3, 40] }), b = decimalAzar(rng, { k: 1, entera: [3, 30] });
  const A = num(a, 'en'), B = num(b, 'en'), Ae = num(a, 'es'), Be = num(b, 'es');
  return consigna(rng, {
    plantilla: 'consigna_estimar', en: `Estimate ${A} + ${B} by rounding to the nearest whole number.`, ok: `Estima ${Ae} + ${Be} redondeando a la unidad más cercana`,
    falsas: [
      { texto: `Calcula ${Ae} + ${Be} exactamente, con todas las cifras`, error: 'confunde-estimar-con-calcular', por_que: par('«Estimate» es estimar, aproximar; el resultado exacto no se pide.', '“Estimate” means to find an approximate answer; the exact result is not asked for.') },
      { texto: `Calcula ${Ae} − ${Be} redondeando a la unidad más cercana`, error: 'confunde-la-operacion-pedida', por_que: par(`El signo de la consigna es +, no ${MENOS}.`, `The sign in the instruction is +, not ${MENOS}.`) },
      { texto: `Redondea el resultado de ${Ae} + ${Be} a la décima`, error: 'confunde-orden-de-redondeo', por_que: par('Hay que redondear cada número a la unidad antes de sumar, no el resultado a la décima.', 'You round each number to the nearest whole number before adding, not the answer to one decimal place.') },
    ],
    solucion: par('«Estimate» es «estimar»: ya con números redondeados, se suma a ojo.', '“Estimate” means to find an approximate answer: you round the numbers first and then add.'), sesion: 2,
  });
}

function consignaConvertir(rng) {
  let f;
  for (let i = 0; i < 100; i++) {
    const den = rng.elegir([8, 20, 25, 40, 50]);
    const num_ = rng.elegir([1, 3, 7, 9, 11, 13, 17, 19, 21, 23]);
    if (num_ >= den) continue;
    f = fraccion(num_, den);
    if (!f.esIrreducible() || fraccionReservada(f)) { f = null; continue; }
    break;
  }
  if (!f) throw new ItemPobre('consigna_convertir');
  const H = htmlFraccion(f, { compacta: true }), T = aTextoFraccion(f);
  // `texto` en claro (registro de fallos, comparaciones); `html` lo que ve el alumno, con la fracción con raya.
  const conHtml = o => ({ ...o, html: o.texto.split(T).join(H) });
  const item = consigna(rng, {
    plantilla: 'consigna_convertir', en: `Convert ${H} to a decimal.`, ok: `Pasa ${T} a decimal`,
    falsas: [
      { texto: `Simplifica la fracción ${T}`, error: 'confunde-la-operacion-pedida', por_que: par('«Convert … to a decimal» pide un decimal, no simplificar.', '“Convert … to a decimal” asks for a decimal, not for simplifying.') },
      { texto: `Calcula ${T} de 100`, error: 'confunde-la-operacion-pedida', por_que: par('«Convert» es pasar de una forma a otra, no calcular una parte de 100.', '“Convert” means to change one form into another, not to find a part of 100.') },
      { texto: `Pasa ${T} a fracción decimal`, error: 'confunde-la-forma-pedida', por_que: par('«To a decimal» pide un decimal (con coma), no otra fracción.', '“To a decimal” asks for a decimal (with a point), not another fraction.') },
    ],
    solucion: par('«Convert» es «pasar de una forma a otra»: de fracción a decimal se divide el numerador entre el denominador.', '“Convert” means to change from one form to another: from a fraction to a decimal, you divide the numerator by the denominator.'), sesion: 5,
  });
  return { ...item, opciones: item.opciones.map(conHtml) };
}

function consignaDividir(rng) {
  let a, b;
  for (let i = 0; i < 100; i++) {
    a = decimalAzar(rng, { k: [1, 2], entera: [5, 99] });
    b = decimal(rng.entero(3, 49), 0);
    if (comparar(a, b) > 0) break;
    a = null;
  }
  if (!a) throw new ItemPobre('consigna_dividir');
  const A = num(a, 'en'), Ae = num(a, 'es');
  return consigna(rng, {
    plantilla: 'consigna_dividir', en: `Divide ${A} by ${num(b, 'en')} with two decimal places in the quotient.`,
    ok: `Divide ${Ae} entre ${num(b, 'es')} con dos cifras decimales en el cociente`,
    falsas: [
      { texto: `Divide ${num(b, 'es')} entre ${Ae} con dos cifras decimales en el cociente`, error: 'divisor-y-dividendo-cambiados', por_que: par(`«Divide … by …» pone primero el dividendo: ${Ae} : ${num(b, 'es')}; el ${Ae} es el dividendo.`, `“Divide ${A} by ${num(b, 'en')}” is ${A} : ${num(b, 'en')}; ${A} is the dividend.`) },
      { texto: `Multiplica ${Ae} por ${num(b, 'es')} con dos cifras decimales`, error: 'confunde-la-operacion-pedida', por_que: par('«Divide» es dividir, no multiplicar.', '“Divide” means to divide, not to multiply.') },
      { texto: `Divide ${Ae} entre ${num(b, 'es')} y da solo el resto`, error: 'confunde-lo-que-se-pide', por_que: par('«Quotient» es el cociente; el resto es «remainder».', '“Quotient” is the result of the division; the “remainder” is what is left over.') },
    ],
    solucion: par('«Quotient» es «cociente»: el resultado de la división, con dos cifras decimales.', 'The “quotient” is the result of the division, here with two decimal places.'), sesion: 5,
  });
}

export const PLANTILLAS_CONSIGNA = [
  consignaRedondear, consignaRedondear, consignaFraccion, consignaEntre, consignaOrden, consignaOrden,
  consignaMayor, consignaEstimar, consignaConvertir, consignaDividir,
];
export const generarConsigna = (rng, sesion) => generarDe(rng, PLANTILLAS_CONSIGNA, sesion);

// ─── Ejercicio 4 · Completa ──────────────────────────────────────────────────────────────
//
// Una frase en inglés con un hueco y cuatro palabras. Cada falsa es una palabra que NO encaja
// (por la gramática o por el significado), nunca otra forma válida de decirlo.

const HUECO = '<span class="hueco hueco--corto" aria-label="blank"></span>';
const NOMBRES = ['Ana', 'Lucas', 'Sara', 'Marcos', 'Lucía', 'Hugo', 'Carmen', 'Pablo', 'Elena', 'Álvaro'];

/** Cotas de realismo de cada contexto (se escriben en la ENTREGA y las comprueba el test). */
// Todo en enteros de la unidad pequeña (nunca un Number con coma): euros enteros, céntimos, litros, décimas de kg.
export const COTAS = {
  libro: { min: 3, max: 30, billetes: [5, 10, 20, 50] },     // € enteros: precio de un libro o una prenda pequeña, y con qué billete se paga
  gasolina: { min: 120, max: 200 },                          // céntimos por litro (1,20-2,00 €)
  litros: { min: 5, max: 70 },
  bolsa: { min: 5, max: 50 },                                // décimas de kg de una bolsa de patatas (0,5-5 kg)
  paquete: { min: 1, max: 300 },                             // décimas de kg (0,1-30 kg)
  recien: { min: 25, max: 45 },                              // décimas de kg (2,5-4,5 kg)
  persona: { min: 300, max: 1200 },                          // décimas de kg (30-120 kg)
};

const completa = (rng, { plantilla, en, ok, falsas, solucion, sesion }) => armar(rng, {
  plantilla, instruccion: 'completa', notacion: frase(en), correcta: { texto: ok }, falsas, solucion, sesion,
});
const noEncaja = (texto, error, porQue) => ({ texto, error, por_que: porQue });

function completaOrden(rng) {
  for (let i = 0; i < 100; i++) {
    const d = decimalAzar(rng, { k: [2, 3], entera: [1, 99] });
    const { e, dec } = partes(d);
    const todas = e + dec;
    const posiciones = [...dec].map((c, i2) => ({ c, i: i2 + 1 })).filter(p => p.c !== '0' && todas.split(p.c).length === 2);
    if (!posiciones.length) continue;
    const p = rng.elegir(posiciones);
    const nombre = ORDENES[-p.i].en;
    const con = { 1: 'tens', 2: 'hundreds', 3: 'thousands' }[p.i];
    const otros = [1, 2, 3].filter(k => k !== p.i && k <= 3).map(k => ORDENES[-k].en);
    const x = num(d, 'en');
    const falsas = [
      noEncaja(con, 'confunde-parecidas', par(`«${con}» son las ${{ tens: 'decenas', hundreds: 'centenas', thousands: 'unidades de millar' }[con]}, que están a la izquierda del punto; «${nombre}» están a la derecha.`, `“${con}” are on the left of the point; “${nombre}” are on the right.`)),
      ...otros.map(o => noEncaja(o, 'otro-orden', par(`El ${p.c} es la cifra número ${p.i} después del punto: son los «${nombre}», no los «${o}».`, `The ${p.c} is digit number ${p.i} after the point: that is the “${nombre}”, not the “${o}”.`))),
    ];
    return completa(rng, {
      plantilla: 'completa_orden', en: `In ${x}, the ${p.c} is in the ${HUECO} place.`, ok: nombre, falsas, sesion: 1,
      solucion: par(`En ${num(d, 'es')} el ${p.c} es la cifra ${p.i} después de la coma: «${nombre}».`, `In ${x}, the ${p.c} is the ${p.i === 1 ? 'first' : p.i === 2 ? 'second' : 'third'} digit after the point: the “${nombre}” place.`),
    });
  }
  throw new ItemPobre('completa_orden');
}

function completaLugares(rng) {
  const d = decimalAzar(rng, { k: [1, 2, 3], entera: [1, 99] });
  const { e, dec } = partes(d);
  const k = dec.length, total = e.length + k;
  const candidatas = [
    { n: total, error: 'cuenta-todas-las-cifras' },
    ...[k - 1, k + 1, k + 2].map(n => ({ n, error: 'cuenta-mal-las-cifras' })),
  ].filter(c => c.n >= 1 && c.n !== k);
  const vistos = new Set([k]);
  const falsas = [];
  for (const c of candidatas) {
    if (vistos.has(c.n)) continue;
    vistos.add(c.n);
    falsas.push(noEncaja(w(c.n), c.error, par(c.error === 'cuenta-todas-las-cifras' ? `Has contado también las cifras de antes del punto (${e.length}). Los «decimal places» son solo las de después: ${k}.` : `Después del punto hay ${k} cifras (${dec}), no ${c.n}.`,
      c.error === 'cuenta-todas-las-cifras' ? `You counted the digits before the point too (${e.length}). “Decimal places” are only the digits after it: ${k}.` : `There are ${k} digits after the point (${dec}), not ${c.n}.`)));
  }
  return completa(rng, {
    plantilla: 'completa_lugares', en: `${num(d, 'en')} has ${HUECO} decimal ${k === 1 ? 'place' : 'places'}.`, ok: w(k), falsas, sesion: 1,
    solucion: par(`Las cifras decimales son las de después de la coma: «${dec}» tiene ${k}.`, `Decimal places are the digits after the point: “${dec}” has ${k}.`),
  });
}

function completaComparar(rng) {
  const a = decimalAzar(rng, { k: [1, 2], entera: [1, 9] });
  const b = decimalAzar(rng, { k: [1, 2, 3], entera: [1, 9] });
  if (comparar(a, b) === 0) throw new ItemPobre('completa_comparar');
  const ent = rng.azar() < 0.3;
  if (ent) {
    // «x is ___ y and z»: x entre dos consecutivos de un orden.
    const lo = decimalAzar(rng, { k: 1, entera: [1, 9] });
    const hi = sumar(lo, decimal(1, 1));
    const medio = deTexto(`${aTexto(lo, 'en')}${rng.entero(1, 9)}`);
    if (esReservado(hi.normalizar()) || esReservado(medio.normalizar())) throw new ItemPobre('completa_comparar');
    return completa(rng, {
      plantilla: 'completa_entre', en: `${num(medio, 'en')} is ${HUECO} ${num(lo, 'en')} and ${num(hi, 'en')}.`, ok: 'between',
      falsas: [
        noEncaja('greater than', 'confunde-el-signo-de-comparar', par(`${num(medio, 'es')} no es mayor que ${num(hi, 'es')}: está en medio de los dos.`, `${num(medio, 'en')} is not greater than ${num(hi, 'en')}: it is in the middle of the two.`)),
        noEncaja('less than', 'confunde-el-signo-de-comparar', par(`${num(medio, 'es')} no es menor que ${num(lo, 'es')}: está en medio de los dos.`, `${num(medio, 'en')} is not less than ${num(lo, 'en')}: it is in the middle of the two.`)),
        noEncaja('equal to', 'palabra-que-no-encaja', par(`${num(medio, 'es')} no es igual a ninguno de los dos.`, `${num(medio, 'en')} is not equal to either of them.`)),
      ],
      solucion: par(`${num(medio, 'es')} está entre ${num(lo, 'es')} y ${num(hi, 'es')}: «between».`, `${num(medio, 'en')} is between ${num(lo, 'en')} and ${num(hi, 'en')}.`), sesion: 2,
    });
  }
  const c = comparar(a, b);
  const ok = c > 0 ? 'greater than' : 'less than';
  const otro = c > 0 ? 'less than' : 'greater than';
  return completa(rng, {
    plantilla: 'completa_comparar', en: `${num(a, 'en')} is ${HUECO} ${num(b, 'en')}.`, ok,
    falsas: [
      noEncaja(otro, compararPorCifras(a, b) !== null ? 'compara-por-cifras' : 'confunde-el-signo-de-comparar', par(`${num(a, 'es')} ${c > 0 ? 'es mayor' : 'es menor'} que ${num(b, 'es')} (hay que igualar las cifras decimales: ${num(a.conCifras(Math.max(a.k, b.k)), 'es')} y ${num(b.conCifras(Math.max(a.k, b.k)), 'es')}).`, `${num(a, 'en')} is ${c > 0 ? 'greater' : 'less'} than ${num(b, 'en')} (write them with the same number of decimal places: ${num(a.conCifras(Math.max(a.k, b.k)), 'en')} and ${num(b.conCifras(Math.max(a.k, b.k)), 'en')}).`)),
      noEncaja('equal to', 'palabra-que-no-encaja', par('Los dos números no valen lo mismo.', 'The two numbers are not the same.')),
      noEncaja('between', 'palabra-que-no-encaja', par('«Between» necesita dos números: «entre … y …».', '“Between” needs two numbers: “between … and …”.')),
    ],
    solucion: par(`${num(a, 'es')} es ${c > 0 ? 'mayor' : 'menor'} que ${num(b, 'es')}: «${ok}».`, `${num(a, 'en')} is ${ok} ${num(b, 'en')}.`), sesion: 2,
  });
}

function completaVuelta(rng) {
  const N = rng.elegir(NOMBRES);
  const { min, max, billetes } = COTAS.libro;
  for (let i = 0; i < 100; i++) {
    const billete = rng.elegir(billetes);
    const precio = decimal(rng.entero(min * 100, Math.min(max, billete - 1) * 100), 2);
    if (comparar(precio, billete) >= 0 || precio.m % 5 !== 0) continue;
    const cambio = restar(billete, precio);
    if (esReservado(precio.normalizar()) || esReservado(cambio.normalizar())) continue;
    return completa(rng, {
      plantilla: 'completa_vuelta', en: `${N} pays with a €${billete} note (billete) and the book costs ${dinero(precio, 'en')}. ${N}'s ${HUECO} is ${dinero(cambio, 'en')}.`, ok: 'change',
      falsas: [
        noEncaja('price', 'palabra-que-no-encaja', par(`El precio del libro es ${dinero(precio, 'es')}; ${dinero(cambio, 'es')} es lo que le devuelven.`, `The price of the book is ${dinero(precio, 'en')}; ${dinero(cambio, 'en')} is what ${N} gets back.`)),
        noEncaja('total', 'palabra-que-no-encaja', par(`El total de la compra es ${dinero(precio, 'es')}; ${dinero(cambio, 'es')} es la vuelta.`, `The total of the purchase is ${dinero(precio, 'en')}; ${dinero(cambio, 'en')} is the change.`)),
        noEncaja('discount', 'palabra-que-no-encaja', par('Un «discount» es un descuento; aquí nadie rebaja el precio.', 'A “discount” is a reduction of the price; nobody lowers the price here.')),
      ],
      solucion: par(`«Change» es «la vuelta»: ${billete} − ${num(precio, 'es')} = ${num(cambio, 'es')} €.`, `“Change” is the money you get back: ${billete} − ${num(precio, 'en')} = ${num(cambio, 'en')}.`), sesion: 3,
    });
  }
  throw new ItemPobre('completa_vuelta');
}

function completaLitro(rng) {
  const precio = decimal(rng.entero(COTAS.gasolina.min, COTAS.gasolina.max), 2);
  if (esReservado(precio.normalizar())) throw new ItemPobre('completa_litro');
  const litros = rng.entero(COTAS.litros.min, COTAS.litros.max);
  const en = rng.azar() < 0.5 ? `Petrol costs ${dinero(precio, 'en')} ${HUECO} litre.` : `${rng.elegir(NOMBRES)} buys ${litros} litres of petrol at ${dinero(precio, 'en')} ${HUECO} litre.`;
  return completa(rng, {
    plantilla: 'completa_litro', en, ok: 'per',
    falsas: [
      noEncaja('by', 'palabra-parecida', par('«By litre» no se dice así; «por litro» es «per litre».', '“By litre” is not said like that; “por litro” is “per litre”.')),
      noEncaja('in', 'palabra-parecida', par('«In litre» no se dice así; «por litro» es «per litre».', '“In litre” is not said like that; “por litro” is “per litre”.')),
      noEncaja('with', 'palabra-que-no-encaja', par('«With litre» no tiene sentido aquí; «por litro» es «per litre».', '“With litre” makes no sense here; “por litro” is “per litre”.')),
    ],
    solucion: par(`«Per litre» es «por litro»: ${dinero(precio, 'es')} cada litro.`, `“Per litre” means for each litre: ${dinero(precio, 'en')} each litre.`), sesion: 3,
  });
}

function completaPesa(rng) {
  const caso = rng.elegir([
    { sujeto: 'A bag of potatoes', ...COTAS.bolsa },
    { sujeto: 'A parcel', ...COTAS.paquete },
    { sujeto: 'A newborn baby', ...COTAS.recien },
    { sujeto: `${rng.elegir(NOMBRES)}`, ...COTAS.persona },
  ]);
  const d = decimal(rng.entero(caso.min, caso.max), 1);
  if (!SIN_CEROS_FINALES(d) || esReservado(d)) throw new ItemPobre('completa_pesa');
  return completa(rng, {
    plantilla: 'completa_pesa', en: `${caso.sujeto} ${HUECO} ${num(d, 'en')} kg.`, ok: 'weighs',
    falsas: [
      noEncaja('weight', 'palabra-parecida', par('«Weight» es el nombre (el peso); el verbo es «weighs» (pesa).', '“Weight” is the noun; the verb is “weighs”.')),
      noEncaja('weights', 'palabra-parecida', par('«Weights» son pesas; el verbo es «weighs» (pesa).', '“Weights” are the objects you lift; the verb is “weighs”.')),
      noEncaja('costs', 'palabra-que-no-encaja', par(`«Costs» es «cuesta»; ${num(d, 'es')} kg es un peso, no un precio.`, `“Costs” is about money; ${num(d, 'en')} kg is a weight, not a price.`)),
    ],
    solucion: par(`«Weighs» es «pesa»: ${num(d, 'es')} kg es lo que pesa.`, `“Weighs” means has a weight of: ${num(d, 'en')} kg is its weight.`), sesion: 3,
  });
}

function completaRol(rng) {
  for (let i = 0; i < 100; i++) {
    const a = decimalAzar(rng, { k: [1, 2], entera: [5, 99] });
    const b = decimal(rng.entero(3, 49), 0);
    if (b.m % 10 === 0) continue;
    const { cociente, resto } = dividir(a, b, 2);
    if (resto.esCero() || cociente.esCero()) continue;
    const valores = [a, b, cociente, resto];
    if (new Set(valores.map(v => v.clave())).size < 4) continue;
    if (valores.some(v => esReservado(v.normalizar()))) continue;
    const ROL = ['dividend', 'divisor', 'quotient', 'remainder'];
    const i = rng.entero(0, 3);
    const ok = ROL[i];
    const cuenta = `${num(a, 'en')} : ${num(b, 'en')} = ${num(cociente, 'en')}, remainder ${num(resto, 'en')}`;
    const ES = { dividend: 'dividendo', divisor: 'divisor', quotient: 'cociente', remainder: 'resto' };
    const falsas = ROL.filter(r => r !== ok).map(r => noEncaja(r, 'confunde-el-papel-del-numero', par(`${num(valores[ROL.indexOf(ok)], 'es')} es el ${ES[ok]}; el ${ES[r]} es ${num(valores[ROL.indexOf(r)], 'es')}.`, `${num(valores[ROL.indexOf(ok)], 'en')} is the ${ok}; the ${r} is ${num(valores[ROL.indexOf(r)], 'en')}.`)));
    return completa(rng, {
      plantilla: 'completa_rol', en: `In ${cuenta}, the number ${num(valores[i], 'en')} is the ${HUECO}.`, ok, falsas, sesion: 5,
      solucion: par(`En ${num(a, 'es')} : ${num(b, 'es')} = ${num(cociente, 'es')}, resto ${num(resto, 'es')}: ${num(a, 'es')} es el dividendo, ${num(b, 'es')} el divisor, ${num(cociente, 'es')} el cociente y ${num(resto, 'es')} el resto.`,
        `In ${num(a, 'en')} : ${num(b, 'en')} = ${num(cociente, 'en')}, remainder ${num(resto, 'en')}: ${num(a, 'en')} is the dividend, ${num(b, 'en')} the divisor, ${num(cociente, 'en')} the quotient and ${num(resto, 'en')} the remainder.`),
    });
  }
  throw new ItemPobre('completa_rol');
}

const PERIODICAS = [[1, 3], [2, 3], [5, 6], [1, 9], [2, 9], [5, 9], [7, 9], [8, 9], [7, 6], [4, 3], [5, 12].filter(() => false)].filter(p => p.length === 2);
const EXACTAS = [[3, 8], [5, 8], [7, 8], [7, 20], [11, 20], [13, 20], [3, 25], [11, 25], [13, 40], [1, 20], [3, 20], [9, 20], [21, 25], [17, 20]];

function completaTipo(rng) {
  const periodica = rng.azar() < 0.5;
  const [n, dn] = rng.elegir(periodica ? PERIODICAS : EXACTAS);
  const f = fraccion(n, dn);
  if (!periodica && fraccionReservada(f)) throw new ItemPobre('completa_tipo');
  const dec = dividir(n, dn, 3).cociente;
  const texto = periodica ? `${num(dec, 'en')}…` : num(dividir(n, dn).cociente, 'en');
  const H = htmlFraccion(f, { compacta: true });
  const ok = periodica ? 'recurring' : 'terminating';
  const otro = periodica ? 'terminating' : 'recurring';
  return completa(rng, {
    plantilla: 'completa_tipo', en: `${H} = ${texto} is a ${HUECO} decimal.`, ok,
    falsas: [
      noEncaja(otro, 'confunde-periodico-con-exacto', par(periodica ? 'Una fracción como esta no termina nunca: las cifras se repiten, es periódica (recurring).' : 'Esta fracción da un decimal que termina: es exacto (terminating).', periodica ? 'A fraction like this never ends: the digits repeat, so it is recurring.' : 'This fraction gives a decimal that ends, so it is terminating.')),
      noEncaja('negative', 'palabra-que-no-encaja', par('El número es positivo.', 'The number is positive.')),
      noEncaja('whole', 'palabra-que-no-encaja', par('El número tiene cifras decimales; un número «whole» no las tiene.', 'The number has decimal places; a “whole” number does not.')),
    ],
    solucion: par(periodica ? 'Las cifras se repiten para siempre: es un decimal «recurring» (periódico).' : 'La división termina: es un decimal «terminating» (exacto).', periodica ? 'The digits repeat for ever: it is a recurring decimal.' : 'The division ends: it is a terminating decimal.'), sesion: 5,
  });
}

function completaSeparador(rng) {
  if (rng.azar() < 0.5) {
    return completa(rng, {
      plantilla: 'completa_separador_decimal', en: `In English, the decimal separator is a ${HUECO}.`, ok: 'point',
      falsas: [
        noEncaja('comma', 'confunde-los-separadores', par('La coma es el separador decimal en español; en inglés es el punto.', 'The comma is the decimal separator in Spanish; in English it is the point.')),
        noEncaja('space', 'palabra-que-no-encaja', par('Un espacio no separa la parte entera de la decimal.', 'A space does not separate the whole part from the decimal part.')),
        noEncaja('dash', 'palabra-que-no-encaja', par('Un guion no separa la parte entera de la decimal.', 'A dash does not separate the whole part from the decimal part.')),
      ],
      solucion: par('En inglés el separador decimal es el punto y en español, la coma.', 'In English the decimal separator is a point; in Spanish it is a comma.'), sesion: 1,
    });
  }
  const n = rng.entero(1, 9) * 1000 + rng.entero(100, 999);
  const t = `${Math.floor(n / 1000)},${String(n % 1000).padStart(3, '0')}`;
  return completa(rng, {
    plantilla: 'completa_separador_millares', en: `In English, the comma in ${t} is the ${HUECO} separator.`, ok: 'thousands',
    falsas: [
      noEncaja('decimal', 'confunde-los-separadores', par(`En inglés ${t} es ${w(n)}: la coma separa los millares, no los decimales.`, `In English ${t} is ${w(n)}: the comma separates the thousands, not the decimals.`)),
      noEncaja('hundreds', 'palabra-parecida', par('La coma separa los millares («thousands»), no las centenas.', 'The comma separates the thousands, not the hundreds.')),
      noEncaja('tenths', 'palabra-parecida', par('Las décimas («tenths») están después del punto, no de la coma.', 'The “tenths” come after the decimal point, not the comma.')),
    ],
    solucion: par(`En inglés, ${t} se lee «${w(n)}»: la coma separa los millares («thousands»).`, `In English, ${t} is read “${w(n)}”: the comma separates the thousands.`), sesion: 1,
  });
}

export const PLANTILLAS_COMPLETA = [
  completaOrden, completaOrden, completaLugares, completaComparar, completaComparar, completaVuelta, completaLitro,
  completaPesa, completaRol, completaTipo, completaSeparador,
];
export const generarCompleta = (rng, sesion) => generarDe(rng, PLANTILLAS_COMPLETA, sesion);

/** Para que la base no repita el mismo ítem dos veces seguidas. */
export const claveItem = item => `${item.plantilla}|${item.notacion ?? ''}|${item.solucion?.es ?? ''}`;
