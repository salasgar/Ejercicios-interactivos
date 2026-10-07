// Potencias de 10 y números grandes: lógica pura (sin DOM ni red).
// Los generadores devuelven DATOS: números, textos y listas de índices, nunca HTML.
//
// Tres ejercicios:
//   1. Deslizador de ceros: 10ⁿ con su número, su nombre inglés y su nombre español.
//   2. La posición del «and» y números con ceros en cada grupo (inglés y español).
//   3. Billion (US), thousand million (GB), trillion (US) = billón español.
//
// Regla de las opciones falsas (ejercicio 3): «N billion es N · 10¹²» no se ofrece nunca
// como opción falsa (es el uso británico antiguo y confunde); las falsas son otras potencias.

// --- Números en palabras --------------------------------------------------------

const EN_UNOS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const EN_DECENAS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function enMenos100(n) {
  if (n < 20) return EN_UNOS[n];
  return EN_DECENAS[Math.floor(n / 10)] + (n % 10 ? `-${EN_UNOS[n % 10]}` : '');
}

/** Un grupo de tres cifras (1 a 999) en inglés: «four hundred and twenty». */
function enGrupo(g) {
  const h = Math.floor(g / 100), r = g % 100;
  const partes = [];
  if (h) partes.push(`${EN_UNOS[h]} hundred`);
  if (r) partes.push(h ? `and ${enMenos100(r)}` : enMenos100(r));
  return partes.join(' ');
}

/**
 * Número en inglés (hasta 999 999 999 999). El «and» va antes del grupo de las unidades
 * cuando este vale menos de 100 y hay algo antes («four hundred thousand and twenty»).
 * Con `gb`, el 10⁹ se llama «thousand million» (uso británico) en lugar de «billion».
 */
export function enNum(n, { gb = false } = {}) {
  if (n === 0) return 'zero';
  const escalas = [[1e12, 'trillion'], [1e9, gb ? 'thousand million' : 'billion'], [1e6, 'million'], [1e3, 'thousand']];
  const partes = [];
  let resto = n;
  for (const [valor, nombre] of escalas) {
    const g = Math.floor(resto / valor);
    resto -= g * valor;
    if (g) partes.push(`${enGrupo(g)} ${nombre}`);
  }
  if (resto) partes.push(partes.length && resto < 100 ? `and ${enGrupo(resto)}` : enGrupo(resto));
  return partes.join(' ');
}

const ES_UNOS = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
  'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte',
  'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
const ES_DECENAS = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const ES_CENTENAS = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

const apocopa = texto => texto.replace(/veintiuno$/, 'veintiún').replace(/uno$/, 'un');

function esMenos100(n) {
  if (n < 30) return ES_UNOS[n];
  return ES_DECENAS[Math.floor(n / 10)] + (n % 10 ? ` y ${ES_UNOS[n % 10]}` : '');
}

/** Un grupo de tres cifras (1 a 999) en español. */
function esGrupo(g) {
  if (g === 100) return 'cien';
  const h = Math.floor(g / 100), r = g % 100;
  return [h ? ES_CENTENAS[h] : '', r ? esMenos100(r) : ''].filter(Boolean).join(' ');
}

/** Un número menor que un millón en español («mil», «tres mil», «veintiún mil»). */
function esMenosMillon(n) {
  const miles = Math.floor(n / 1000), resto = n % 1000;
  const partes = [];
  if (miles) partes.push(miles === 1 ? 'mil' : `${apocopa(esGrupo(miles))} mil`);
  if (resto) partes.push(esGrupo(resto));
  return partes.join(' ');
}

/** Número en español (hasta 999 999 999 999): «un billón», «mil millones», «tres millones dos mil nueve». */
export function esNum(n) {
  if (n === 0) return 'cero';
  const partes = [];
  const billones = Math.floor(n / 1e12), r = n % 1e12;
  if (billones) partes.push(billones === 1 ? 'un billón' : `${apocopa(esGrupo(billones))} billones`);
  const millones = Math.floor(r / 1e6);
  if (millones) partes.push(millones === 1 ? 'un millón' : `${apocopa(esMenosMillon(millones))} millones`);
  if (r % 1e6) partes.push(esMenosMillon(r % 1e6));
  return partes.join(' ');
}

/** Cifras agrupadas de tres en tres con espacio duro: 1 000 000. */
export function agrupar(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export const potencia10 = n => 10 ** n;

// --- Ejercicio 1: el deslizador de ceros -----------------------------------------

export const N_MAXIMO = 9;
/** Lo que se pide: las cifras de un nombre inglés, la potencia de unas cifras, los ceros de una potencia. */
export const PIDE = ['cifras', 'potencia', 'ceros'];

/** Ítem: { tipo: 'deslizador', pide, n, inicio }. El alumno mueve el deslizador hasta n. */
export function generarDeslizador(rng) {
  const pide = rng.elegir(PIDE);
  const n = rng.entero(pide === 'ceros' ? 2 : 3, N_MAXIMO);
  let inicio = rng.entero(0, N_MAXIMO);
  if (inicio === n) inicio = (n + 3) % (N_MAXIMO + 1);
  return { tipo: 'deslizador', pide, n, inicio };
}

export function esRespuestaDeslizador(item, valor) {
  return Number(valor) === item.n;
}

/** Lo que enseña el deslizador en la posición n. */
export function mostrarDeslizador(n) {
  return {
    n,
    cifras: agrupar(10 ** n),
    ceros: n,
    en: enNum(10 ** n),
    enGb: n === 9 ? enNum(10 ** n, { gb: true }) : null,
    es: esNum(10 ** n),
  };
}

// --- Ejercicio 2a: dónde va el «and» ---------------------------------------------

/** Ítem: { tipo: 'and', nombres: [a, b], numeros: [x, y], solucion: [i, j] } (el número de cada nombre, por posición). */
export function generarAnd(rng) {
  const h = rng.entero(1, 9);
  const t = rng.elegir([10, 20, 30, 40, 50, 60, 70, 80, 90, 5, 9, 12, 15]);
  const A = h * 100000 + t;             // h hundred thousand and t
  const B = (h * 100 + t) * 1000;       // h hundred and t thousand
  let nombres = [enNum(A), enNum(B)], valores = [A, B];
  if (rng.azar() < 0.5) { nombres = nombres.reverse(); valores = valores.reverse(); }
  const numeros = rng.azar() < 0.5 ? [A, B] : [B, A];
  return { tipo: 'and', nombres, numeros, solucion: valores.map(v => numeros.indexOf(v)) };
}

// --- Ejercicio 2b: escribir con cifras un número con ceros en cada grupo ---------

function interiorConCeros(n) {
  return /[1-9]0+[1-9]/.test(String(n));
}

/** Ítem: { tipo: 'cifras', lengua: 'en' | 'es', n, texto }. */
export function generarCifras(rng) {
  const lengua = rng.azar() < 0.6 ? 'en' : 'es';
  const grupo = () => rng.elegir([0, rng.entero(1, 9), rng.entero(1, 9), rng.entero(10, 99), rng.entero(100, 999), rng.entero(1, 9) * 100]);
  let n = 0;
  for (let i = 0; i < 200; i++) {
    const m = rng.azar() < 0.7 ? rng.entero(1, 9) : rng.entero(10, 99);
    const k = grupo(), u = grupo();
    n = m * 1e6 + k * 1e3 + u;
    const gruposNoNulos = [m, k, u].filter(Boolean).length;
    if (gruposNoNulos >= 2 && interiorConCeros(n)) break;
  }
  if (!interiorConCeros(n)) n = 3002009;
  return { tipo: 'cifras', lengua, n, texto: lengua === 'en' ? enNum(n) : esNum(n) };
}

export function esRespuestaCifras(item, escrito) {
  return String(escrito).replace(/\D/g, '') === String(item.n);
}

/** Los tres grupos de un número (millones, miles, unidades) como textos de tres cifras. */
export function gruposDe(n) {
  const m = Math.floor(n / 1e6), k = Math.floor((n % 1e6) / 1e3), u = n % 1e3;
  const tres = x => String(x).padStart(3, '0');
  return { millones: m, miles: m ? tres(k) : String(k), unidades: tres(u) };
}

// --- Ejercicio 3: billion ---------------------------------------------------------

/** Exponentes entre los que se eligen las opciones falsas (hasta el 12: los nombres de más no se enseñan). */
const EXPONENTES = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/**
 * Nombre inglés de c · 10ᵉ en el uso que toque. Con e entre 9 y 11, `gb` pide «thousand million».
 * Etiqueta de uso: 'US' para billion y trillion, 'GB' para thousand million.
 */
function nombreEn(c, e, gb) {
  const v = c * 10 ** e;
  const usaGb = gb && e >= 9 && e < 12;
  return { texto: enNum(v, { gb: usaGb }), uso: usaGb ? 'GB' : (e >= 9 ? 'US' : ''), valor: v };
}

function falsosExponentes(rng, e, cuantos) {
  const prohibidos = new Set([e]);
  if (e === 9) prohibidos.add(12);      // «billion = 10¹²» nunca es una opción falsa
  if (e === 12) prohibidos.add(9);
  return rng.barajar(EXPONENTES.filter(x => !prohibidos.has(x))).slice(0, cuantos);
}

function barajarOpciones(rng, buena, falsas) {
  const lista = rng.barajar([buena, ...falsas]);
  return { opciones: lista, solucion: lista.indexOf(buena) };
}

/**
 * Ítem de billion. Cuatro clases:
 *   potencia  { clase, c, e, nombre, uso, opciones: [{ c, e }], solucion }       nombre inglés → potencia
 *   nombre    { clase, c, e, opciones: [texto], solucion }                        potencia → nombre inglés
 *   espanol   { clase, c, e, nombre, uso, opciones: [texto], solucion }           nombre inglés → nombre español
 *   mismo     { clase, c, a: {texto, uso}, b: {texto, uso}, verdad }              ¿nombran lo mismo?
 */
export function generarBillion(rng) {
  const clase = rng.elegir(['potencia', 'nombre', 'espanol', 'mismo']);
  const c = rng.entero(1, 9);
  if (clase === 'mismo') return generarMismo(rng, c);
  const e = rng.elegir([6, 9, 9, 12]);
  const gb = e === 9 && rng.azar() < 0.4;
  const nombre = nombreEn(c, e, gb);
  const falsos = falsosExponentes(rng, e, 3);
  if (clase === 'potencia') {
    const { opciones, solucion } = barajarOpciones(rng, { c, e }, falsos.map(x => ({ c, e: x })));
    return { tipo: 'billion', clase, c, e, nombre: nombre.texto, uso: nombre.uso, opciones, solucion };
  }
  if (clase === 'nombre') {
    const estilo = e === 9 ? rng.azar() < 0.5 : false;
    const buena = nombreEn(c, e, estilo).texto;
    const { opciones, solucion } = barajarOpciones(rng, buena, falsos.map(x => nombreEn(c, x, estilo).texto));
    return { tipo: 'billion', clase, c, e, opciones, solucion };
  }
  const { opciones, solucion } = barajarOpciones(rng, esNum(c * 10 ** e), falsos.map(x => esNum(c * 10 ** x)));
  return { tipo: 'billion', clase, c, e, nombre: nombre.texto, uso: nombre.uso, opciones, solucion };
}

function generarMismo(rng, c) {
  const verdad = rng.azar() < 0.5;
  const par = verdad
    ? [nombreEn(c, 9, false), nombreEn(c, 9, true)]
    : rng.elegir([
      [nombreEn(c, 9, false), nombreEn(c, 12, false)],
      [nombreEn(c, 9, true), nombreEn(c, 12, false)],
      [nombreEn(c, 9, false), nombreEn(c, 6, false)],
      [nombreEn(c, 9, true), nombreEn(c, 6, false)],
    ]);
  const [a, b] = rng.azar() < 0.5 ? par : [par[1], par[0]];
  return { tipo: 'billion', clase: 'mismo', c, a, b, verdad };
}

/** Todas las formas de nombrar c · 10ᵉ, para la explicación. */
export function formasDe(c, e) {
  const v = c * 10 ** e;
  return {
    cifras: agrupar(v),
    en: enNum(v),
    enGb: e >= 9 && e < 12 ? enNum(v, { gb: true }) : null,
    es: esNum(v),
  };
}
