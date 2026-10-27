// Práctica «Simplifica» (PU2, tarea 101): lógica pura (sin DOM ni red), probada en
// `tests/practicas-simplifica.test.js`. Los generadores devuelven DATOS ({ num, den }
// con el signo en el numerador), nunca HTML: la base vuelve a montar el mismo ítem al
// cambiar de idioma. Las fracciones no se simplifican solas (`fracciones.js`).
//
// Cotas (realismo, regla de Juan Luis del 16-10): no hay contexto, solo números;
// todos los términos son enteros de 1 a 100 (en el ejercicio 2, hasta 99).
//
// Errores típicos que pueden salir (ids de ERRORES_TIPICOS, de la 98, salvo los tres
// propios): simplifica-a-medias · simplifica-solo-numerador · simplifica-solo-denominador ·
// signo-perdido-al-simplificar · y propios: no-divide-a-los-dos, cree-irreducible,
// cree-reducible, cree-irreducible-si-impares, signo-cambiado, irreducible-mal,
// mcd-no-es-el-mayor, mcd-mal.

import { fraccion, htmlFraccion, htmlCuenta, ERRORES_TIPICOS } from '../_comun/fracciones.js';
import { mcd } from '../_comun/aritmetica.js';
import { TX } from './textos.js';

export const BOTONES = [2, 3, 5, 7];
export const MAX_TERMINO = 100;

const abs = Math.abs;
const compacta = f => htmlFraccion(f, { compacta: true });
const coprimos = (a, b) => mcd(a, b) === 1;
const soloBotones = n => { for (const p of BOTONES) while (n % p === 0) n /= p; return n === 1; };
const esCompuesto = n => n > 3 && Array.from({ length: Math.floor(Math.sqrt(n)) - 1 }, (_, i) => i + 2).some(d => n % d === 0);

/** p/q irreducible con 2 ≤ q ≤ qmax y pmin ≤ p < q. */
function irreducibleCon(rng, qmax, pmin = 1) {
  for (;;) {
    const q = rng.entero(Math.max(2, pmin + 1), qmax);
    const p = rng.entero(pmin, q - 1);
    if (coprimos(p, q)) return [p, q];
  }
}

const conSigno = (rng, num, den, probabilidad) => ({ num: rng.azar() < probabilidad ? -num : num, den });

// --- Ejercicio 1: paso a paso ---------------------------------------------------

/** Divisores comunes posibles: solo con primos de los botones (2, 3, 5, 7), hasta 50. */
const MCDS_PASOS = Array.from({ length: 49 }, (_, i) => i + 2).filter(soloBotones);
const MCDS_VARIOS_PASOS = MCDS_PASOS.filter(g => !BOTONES.includes(g));

/** Ítem: { num, den }; m.c.d. > 1 (solo con primos 2, 3, 5, 7), términos hasta 100; ~30 % negativas. */
export function generarPasos(rng) {
  const g = rng.elegir(rng.azar() < 0.35 ? BOTONES : MCDS_VARIOS_PASOS);
  const [p, q] = irreducibleCon(rng, Math.floor(MAX_TERMINO / g));
  return conSigno(rng, g * p, g * q, 0.3);
}

export const fraccionDe = item => fraccion(item.num, item.den);

/** El menor botón que divide a los dos términos, o null si ya es irreducible. */
export function menorDivisorComun(f) {
  return BOTONES.find(k => f.num % k === 0 && f.den % k === 0) ?? null;
}

/**
 * Pulsar «:k» sobre f. { resultado: 'correcto', fraccion } si k divide a los dos;
 * si no, 'solo-numerador', 'solo-denominador' o 'ninguno' (a cuál divide) y el error típico.
 */
export function evaluarPaso(f, k) {
  const dn = f.num % k === 0, dd = f.den % k === 0;
  if (dn && dd) return { resultado: 'correcto', fraccion: f.simplificarPor(k) };
  if (dn) return { resultado: 'solo-numerador', error: 'simplifica-solo-numerador' };
  if (dd) return { resultado: 'solo-denominador', error: 'simplifica-solo-denominador' };
  return { resultado: 'ninguno', error: 'no-divide-a-los-dos' };
}

/** Aviso al intentar dividir entre algo que no divide a los dos términos. */
export function avisoNoDivide(f, k, idioma) {
  const cual = { 'solo-numerador': 'numerador', 'solo-denominador': 'denominador', ninguno: 'ninguno' }[evaluarPaso(f, k).resultado];
  return TX.pasos.no_divide[idioma](k, abs(f.num), f.den, cual);
}

/** Pulsar «Es irreducible» sobre f: { correcto: true } o { correcto: false, k, error } (todavía se puede entre k). */
export function evaluarIrreducible(f) {
  const k = menorDivisorComun(f);
  return k === null ? { correcto: true } : { correcto: false, k, error: 'simplifica-a-medias' };
}

export function avisoTodavia(f, idioma) {
  return TX.pasos.todavia[idioma](menorDivisorComun(f), abs(f.num), f.den);
}

/** Feedback final del ejercicio 1: la cadena 36/48 = 18/24 = … y por qué ya no se puede. */
export function explicarPasos(cadena, idioma) {
  const ultima = cadena.at(-1);
  const partes = cadena.flatMap((f, i) => (i ? ['=', f] : [f]));
  const signo = ultima.num < 0 ? ` ${TX.pasos.signo[idioma]}` : '';
  return TX.pasos.final[idioma](htmlCuenta(partes, { compacta: true }), abs(ultima.num), ultima.den) + signo;
}

// --- Ejercicio 2: ¿irreducible? --------------------------------------------------

const PAREJAS = [];                 // p/q irreducible, 2 ≤ p < q ≤ 75
for (let q = 3; q <= 75; q++) for (let p = 2; p < q; p++) if (coprimos(p, q)) PAREJAS.push([p, q]);
const PAREJAS_FEAS = PAREJAS.filter(([p, q]) => esCompuesto(p) && esCompuesto(q));   // 14/25, 15/28, 9/16…

const MCDS_REDUCIBLES = [2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const MCDS_IMPARES = [3, 3, 5, 7, 9, 11, 13];

/** Reducible con m.c.d. g: g·a / g·q, a < q coprimos, términos < 100. Con `impares`, a y q impares (9/15, 21/35…). */
function reducible(rng, g, impares) {
  const qmax = Math.floor(99 / g);
  for (;;) {
    const q = rng.entero(3, qmax);
    const a = rng.entero(1, q - 1);
    if (coprimos(a, q) && (!impares || (a % 2 === 1 && q % 2 === 1))) return [g * a, g * q];
  }
}

export const esIrreduciblePar = ({ num, den }) => coprimos(abs(num), den);

/**
 * Ítem: { fracs: [{ num, den } × 4] }. Entre 1 y 3 irreducibles (una de ellas «fea», con los dos
 * términos compuestos: 14/25) y al menos una reducible con los dos términos impares (9/15, 21/35).
 * Ninguna se repite ni equivale a otra (ni siquiera con el signo cambiado). ~50 % llevan una negativa.
 */
export function generarIrreducibles(rng) {
  for (;;) {
    const c = rng.elegir([1, 2, 2, 3]);
    const lista = [rng.elegir(PAREJAS_FEAS)];
    while (lista.length < c) lista.push(rng.elegir(PAREJAS));
    lista.push(reducible(rng, rng.elegir(MCDS_IMPARES), true));
    while (lista.length < 4) lista.push(reducible(rng, rng.elegir(MCDS_REDUCIBLES), false));
    const claves = new Set(lista.map(([n, d]) => fraccion(n, d).clave()));
    if (claves.size < 4) continue;
    const fracs = rng.barajar(lista).map(([num, den]) => ({ num, den }));
    if (rng.azar() < 0.5) fracs[rng.entero(0, 3)].num *= -1;
    return { fracs };
  }
}

/** Qué casillas son las irreducibles (índices). */
export const irreduciblesDe = item => item.fracs.flatMap((f, i) => (esIrreduciblePar(f) ? [i] : []));

/**
 * Error típico de lo marcado: si dio por irreducible una reducible con los dos términos impares,
 * 'cree-irreducible-si-impares'; otra reducible marcada, 'cree-irreducible'; y si dejó sin marcar
 * una irreducible, 'cree-reducible'. null si acertó.
 */
export function errorIrreducibles(item, marcadas) {
  const buenas = new Set(irreduciblesDe(item));
  const m = new Set(marcadas);
  const demas = [...m].filter(i => !buenas.has(i));
  if (demas.length) return demas.some(i => abs(item.fracs[i].num) % 2 === 1 && item.fracs[i].den % 2 === 1) ? 'cree-irreducible-si-impares' : 'cree-irreducible';
  if ([...buenas].some(i => !m.has(i))) return 'cree-reducible';
  return null;
}

/** Feedback del ejercicio 2: una línea por fracción con sus números. */
export function explicarIrreducibles(item, marcadas, idioma) {
  const m = new Set(marcadas);
  const x = TX.irred;
  return item.fracs.map((f, i) => {
    const fr = fraccion(f.num, f.den);
    const n = abs(f.num), d = f.den;
    if (esIrreduciblePar(f)) return x.irreducible[idioma](compacta(fr), n, d);
    const g = mcd(n, d);
    const linea = x.reducible[idioma](compacta(fr), g, n, d, compacta(fr.simplificar()));
    return m.has(i) && n % 2 === 1 && d % 2 === 1 ? `${linea} ${x.impares[idioma]}` : linea;
  }).join('<br>');
}

// --- Ejercicio 3: de una vez ----------------------------------------------------

const MCDS_VEZ = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 14, 15, 16, 18, 20, 21, 24, 25];

/** Ítem: { num, den, mcd }. Un tercio con m.c.d. 1 (ya irreducible); ~30 % negativas; términos hasta 100. */
export function generarDeUnaVez(rng) {
  if (rng.azar() < 1 / 3) {
    const [p, q] = rng.elegir(PAREJAS);
    return { ...conSigno(rng, p, q, 0.3), mcd: 1 };
  }
  const g = rng.elegir(MCDS_VEZ);
  const [p, q] = irreducibleCon(rng, Math.floor(MAX_TERMINO / g));
  return { ...conSigno(rng, g * p, g * q, 0.3), mcd: g };
}

export const irreducibleDe = item => fraccion(item.num, item.den).simplificar();

/**
 * Corrige lo que escribe el alumno: { mcd, num, den, negativo } (num y den ≥ 0 tal como los teclea;
 * el signo va aparte). Devuelve { acierto, error } con el primer error por orden de importancia.
 */
export function evaluarDeUnaVez(item, respuesta) {
  const { mcd: m, num, den, negativo } = respuesta;
  const buena = irreducibleDe(item);
  const suya = den > 0 ? fraccion(negativo ? -num : num, den) : null;
  const fraccionOk = suya !== null && suya.mismaForma(buena);
  const mcdOk = m === item.mcd;
  return { ...errorDeUnaVez(item, { m, buena, suya, fraccionOk, mcdOk }), mcdOk, fraccionOk };
}

function errorDeUnaVez(item, { m, buena, suya, fraccionOk, mcdOk }) {
  if (fraccionOk && mcdOk) return { acierto: true, error: null };
  const dato = fraccionDe(item);
  if (!fraccionOk) {
    if (suya === null) return { acierto: false, error: 'irreducible-mal' };
    if (suya.equals(dato)) return { acierto: false, error: 'simplifica-a-medias' };
    if (abs(suya.num) === abs(buena.num) && suya.den === buena.den) {
      return { acierto: false, error: buena.num < 0 ? 'signo-perdido-al-simplificar' : 'signo-cambiado' };
    }
    if (suya.den === dato.den && abs(suya.num) < abs(dato.num) && abs(dato.num) % abs(suya.num || 1) === 0) {
      return { acierto: false, error: 'simplifica-solo-numerador' };
    }
    if (suya.num === dato.num && suya.den < dato.den && dato.den % suya.den === 0) {
      return { acierto: false, error: 'simplifica-solo-denominador' };
    }
    return { acierto: false, error: 'irreducible-mal' };
  }
  const esDivisorComun = m > 1 && item.mcd % m === 0 && m < item.mcd;
  return { acierto: false, error: esDivisorComun ? 'mcd-no-es-el-mayor' : 'mcd-mal' };
}

/** La respuesta del alumno como texto corto (para el registro de fallos): «12; −3/4». */
export function respuestaDeUnaVez({ mcd: m, num, den, negativo }) {
  return `${m ?? '?'}; ${negativo ? '−' : ''}${num ?? '?'}/${den ?? '?'}`;
}

/** Feedback del ejercicio 3: lo que falló (con sus números) y la cuenta buena. */
export function explicarDeUnaVez(item, error, respuesta, idioma) {
  const x = TX.vez;
  const f = fraccionDe(item);
  const buena = irreducibleDe(item);
  const cuenta = x.cuenta[idioma](abs(item.num), item.den, item.mcd, compacta(f), { num: buena.num, den: buena.den, html: compacta(buena) });
  let aviso = '';
  if (error) {
    const { mcd: m, num, den, negativo } = respuesta;
    const r = den > 0 ? compacta(fraccion(negativo ? -num : num, den)) : '';
    aviso = x.errores[error][idioma](error.startsWith('mcd') ? m : r, item.mcd) + ' ';
  }
  return `${aviso}${cuenta}`;
}

// Los errores propios de esta práctica se registran con su nombre; los de la 98, con el suyo.
export const ERRORES_PROPIOS = [
  'no-divide-a-los-dos', 'cree-irreducible', 'cree-reducible', 'cree-irreducible-si-impares',
  'signo-cambiado', 'irreducible-mal', 'mcd-no-es-el-mayor', 'mcd-mal',
];
export const ERRORES_DE_LA_BASE = ['simplifica-a-medias', 'simplifica-solo-numerador', 'simplifica-solo-denominador', 'signo-perdido-al-simplificar']
  .filter(id => ERRORES_TIPICOS[id]);
