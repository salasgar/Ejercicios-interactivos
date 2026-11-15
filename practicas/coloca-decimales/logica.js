// Coloca los paréntesis. Con decimales (U5): los generadores. Lógica pura, sin DOM ni red.
// Todo lo demás (árboles, pasos, coma o punto según el idioma, pistas, un chip por valor) es del motor
// común, `../_comun/parentesis-motor.js`, con enteros escalados (nunca coma flotante).

import { crearMotor, aritmeticaDecimales, huella } from '../_comun/parentesis-motor.js';
import { decimal, deTexto } from '../_comun/decimales.js';

/** Todo valor, intermedio o final: no negativo, con tres cifras decimales como mucho, divisiones exactas, hasta 500. */
export const CIFRAS = 3;
export const TOPE = 500;
const ARITMETICA = aritmeticaDecimales({ cifras: CIFRAS, tope: TOPE, negativos: false });
export const M = crearMotor(ARITMETICA);

// ─── Casos que no pueden salir ───────────────────────────────────────────────────────────────
// La cuenta sin paréntesis (números en orden, operaciones y exponente; `M.claveExpresion`) de las combinadas de
// las hojas de la U5 y de los ejemplos del inventario va en claro; la de los exámenes semanales y del final,
// por huella FNV-1a calculada fuera del repositorio (el repositorio y GitHub Pages son públicos).

export const CASOS_HOJA = new Set([
  '0,06 42,16 0,0004|*+|', '0,1 0,1 0,1|**|', '0,1||3', '0,3 16,66 0,002|*+|', '0,5||2', '0,6 5,16 0,004|*+|',
  '0,6||2', '0,7 11,64 0,002|*+|', '0,7 11,64 0,02|*+|', '1,1||2', '1,8 1,3 2|+*|', '10 2 3,5 1,25|-*-|',
  '10 2,4 3|-*|', '12 3 2,6 0,15|-*+|', '12 3 2,75|-*|', '15 0,7 4,25|++|', '2 3,45 1,3|*+|', '2,5 1,2 3|+*|',
  '2,5 1,5 0,3|+*|', '20 2 3,45 1,3|-*+|', '20 3,85 6,5|--|', '20 6,9 1,3|-+|', '200 1 0,2 0,3|*-*|2',
  '25 12 1,5 0,5|-*/|', '25 18 0,5|-/|', '3 4,96 0,02|*+|', '3,5 4 0,25|+*|', '3,65 2,1 1,2|++|', '4,5 1,2 3|-*|',
  '4,5 1,7 0,5|-*|', '5,02 200 0,087|+*|', '6 0,35 2,4|++|', '6 3,83 0,02|*+|', '6,4 2,9 0,2|-*|', '7 0,2 0,006|++|',
  '7,2 4 1,3 2|/+*|', '8 1,5 2|-*|', '9 2,4 1,75|--|',
  ]);

export const HUELLAS_EXAMEN = new Set([
  '1018hc7', '10tfl0q', '110v3y0', '115d741', '11kbyp4', '121pf9t', '123b8e5', '12gny6l', '136wi8y', '144prbt',
  '14ghngj', '14lcizn', '14lg7q3', '15bp5er', '15t0tjk', '16c12c3', '179e4rm', '17fgk45', '183onq', '18d2k7t',
  '18ppd6m', '192m3to', '19paqer', '1a5nkk3', '1agit93', '1ahg6fl', '1bveemm', '1cdad68', '1d584t0', '1e4lzmr',
  '1e9ro6i', '1ebqgxt', '1f03yri', '1f6gppg', '1fjzitb', '1g09svb', '1ga6jdj', '1glkmkh', '1hxz0ae', '1j1sdvk',
  '1kfjhdj', '1kxgs1l', '1lkmhtt', '1lq1vt1', '1lr7uli', '1lzz8fl', '1mg65ab', '1nkajyu', '1nuiapa', '1nv1qv8',
  '1o3sxgq', '1o7wqei', '1oimawd', '1ood0vd', '1p6sqk8', '1p7shx5', '1pfc70y', '1pie9cn', '1ps9f2x', '1r25lzd',
  '1r97c5n', '1rh7ab0', '1szparc', '1t4sdf7', '1tya8qs', '1u9ykw5', '1uke7n0', '1uxwprb', '1v0rwhe', '1v64lvn',
  '1vix2wu', '1vq3td6', '1vqt6dq', '1vrkb8i', '1vz5rrp', '1we848n', '1wftfym', '1x9pfti', '1xzsxq9', '1yjak3h',
  '2deecu', '2kbaeb', '3juqmk', '3nny4p', '3ypq6l', '3zq959', '4bkvs', '4pg6kf', '4u5x6s', '4xe7jx', '4zd9so',
  '5qe72', '5s1bhx', '5ssxn2', '5tkwc9', '6f5z1x', '6rgr2n', '6w94xq', '6xe83w', '71omik', '76vdl8', '7nur7z',
  '7pw0eu', '7tarfp', '7uno9g', '82a63z', '8z77my', '90xa71', '96evvt', '9l1o6l', 'a0884y', 'a2i52f', 'aw57j',
  'awb35v', 'b69wut', 'bedy0c', 'bsd2rn', 'c18lyp', 'cl6vlv', 'cwuykw', 'dkwiv', 'dok5s5', 'doy3gh', 'e0guah',
  'ehvrlw', 'exj2pu', 'eze5sc', 'fc21cr', 'fnigby', 'g18s15', 'g1dd29', 'gudqpc', 'h3h0bv', 'h9vbkz', 'htaw1o',
  'i1hs55', 'id8lr9', 'iw1751', 'j0gxsh', 'jtmo1o', 'k9cll0', 'ksv6m7', 'kzmezh', 'l4gizx', 'lhly7w', 'm1ywk2',
  'm33f9k', 'mc3lwh', 'mhh9zb', 'mmbxli', 'n0afvi', 'nao4nw', 'ndeygx', 'no0zuo', 'nwmzly', 'o5iazo', 'ogzo59',
  'oiuft9', 'p76a9h', 'plkz2g', 'pmzi4a', 'pogjws', 'pvyqda', 'q7ys8n', 'qt03aa', 'qvt9zl', 'rrl6td', 'rrvia7',
  'th4buw', 'tivoku', 'trz9mt', 'ts6mj9', 'tt1wu1', 'uxgs62', 'v004ct', 'vgbpr8', 'w8gr0c', 'wdc9r6', 'x47ene',
  'x7luks', 'xfl3pl', 'yjyp5n', 'z3fp8v', 'zjkzhs',
]);

export const esCasoDelPapel = e => { const k = M.claveExpresion(e); return CASOS_HOJA.has(k) || HUELLAS_EXAMEN.has(huella(k)); };

// ─── Divisores ───────────────────────────────────────────────────────────────────────────────
// Los de la U5 (los de `multiplica-divide-decimales`, ejercicio 6): un divisor, también el que sale de un
// paréntesis, vale uno de estos.

export const DIVISORES = ['2', '4', '5', '8', '0.5', '0.25', '0.2'].map(t => deTexto(t));
const CLAVES_DIVISORES = new Set(DIVISORES.map(d => ARITMETICA.clave(d)));

/** ¿Todas las divisiones de todas las agrupaciones tienen por divisor uno de la U5? (Las inválidas no cuentan: ya las filtra el motor.) */
export function divisoresDeLaU5(e) {
  const valor = a => {
    if (a.v !== undefined) return a.v;
    if (a.pot) { const x = valor(a.x); return x === null ? null : (ARITMETICA.potencia(x, a.pot).valor ?? null); }
    const l = valor(a.l), r = valor(a.r);
    if (l === null || r === null) return null;
    if (a.op === '/' && !CLAVES_DIVISORES.has(ARITMETICA.clave(r))) throw new Error('divisor');
    return ARITMETICA.operar(l, a.op, r).valor ?? null;
  };
  try { M.arboles(e).forEach(valor); return true; } catch { return false; }
}

/** Un decimal con una o dos cifras decimales, de 0,1 a 9,99, sin ceros de más. */
function unDecimal(rng) {
  for (;;) {
    const d = rng.azar() < 0.5 ? decimal(rng.entero(1, 99), 1) : decimal(rng.entero(10, 999), 2);
    const n = d.normalizar();
    if (n.k > 0) return n;
  }
}

/** Operandos para las operaciones `ops`: decimales y naturales de 2 a 10, con al menos un decimal (lo normal, dos); detrás de un «:», un divisor de la U5. */
function operandos(rng, ops) {
  const cuantos = ops.length + 1;
  const decimales = Math.min(cuantos, rng.azar() < 0.2 ? 1 : 2 + (cuantos > 3 && rng.azar() < 0.3 ? 1 : 0));
  const sitios = new Set(rng.barajar([...Array(cuantos).keys()]).slice(0, decimales));
  return Array.from({ length: cuantos }, (_, i) => {
    if (i > 0 && ops[i - 1] === '/') return rng.elegir(DIVISORES);
    return sitios.has(i) ? unDecimal(rng) : decimal(rng.entero(2, 10), 0);
  });
}

/** Sin agrupaciones imposibles, divisores de la U5 en todas las agrupaciones y ningún caso del papel. */
const vale = (an, e) => an.invalidos.length === 0 && divisoresDeLaU5(e) && !esCasoDelPapel(e)
  && e.numeros.some(n => n.normalizar().k > 0);

/** Ejercicio 1: a ∘ b ∘ c, una operación de + − y otra de · :; exactamente 2 resultados. */
function generar1(rng, anterior) {
  const hacer = () => {
    const ops = [rng.elegir(['+', '-']), rng.elegir(['*', '/'])];
    const operaciones = rng.azar() < 0.5 ? ops : ops.reverse();
    return { numeros: operandos(rng, operaciones), operaciones, exponente: null };
  };
  return M.buscar(rng, hacer, (an, e) => an.valores.length === 2 && vale(an, e),
    { numeros: [decimal(15, 1), decimal(5, 1), 2], operaciones: ['+', '*'], exponente: null }, { anterior });
}

/** Ejercicio 2: a ∘ b ∘ c² (³ en un 15 %), con + − ·; de 3 a 5 resultados. */
function generar2(rng, anterior) {
  const hacer = () => {
    const operaciones = [rng.elegir(['+', '-', '*']), rng.elegir(['+', '-', '*'])];
    const exponente = rng.azar() < 0.5 ? 3 : 2;   // mitad de los intentos: casi todos los cubos caen en las cotas, y al final salen en torno al 15 %
    const numeros = operandos(rng, operaciones);
    // El cubo de algo con dos cifras decimales pasa de tres, y el de 8 pasa de 500: un cubo se pide a un número que lo permita.
    if (exponente === 3) numeros[2] = rng.azar() < 0.5 ? decimal(rng.entero(2, 7), 0) : decimal(rng.entero(1, 7) * 10 + rng.entero(1, 9), 1);
    return { numeros, operaciones, exponente };
  };
  return M.buscar(rng, hacer, (an, e) => an.valores.length >= 3 && an.valores.length <= 5 && vale(an, e),
    { numeros: [decimal(5, 1), 2, 3], operaciones: ['+', '*'], exponente: 2 }, { anterior });
}

/** Ejercicio 3: la diana. Cuatro números con + − · :; al menos 3 resultados. */
function generar3(rng, anterior) {
  const hacer = () => {
    const operaciones = [0, 1, 2].map(() => rng.elegir(['+', '-', '*', '/']));
    return { numeros: operandos(rng, operaciones), operaciones, exponente: null };
  };
  return M.buscar(rng, hacer, (an, e) => an.valores.length >= 3 && vale(an, e),
    { numeros: [decimal(25, 1), 2, decimal(5, 1), 4], operaciones: ['+', '*', '+'], exponente: null }, { anterior });
}

/** El ítem del ejercicio `ejercicio` (1 a 3). En la diana, el objetivo no es el de sin paréntesis. */
export function generar(ejercicio, rng, sesion = {}) {
  const anterior = sesion.anterior ?? null;
  if (ejercicio === 1) return M.itemDe('todos', generar1(rng, anterior));
  if (ejercicio === 2) return M.itemDe('todos', generar2(rng, anterior));
  const item = M.itemDe('diana', generar3(rng, anterior));
  const otros = item.resultados.filter(v => !M.mismoValor(v, item.sinParentesis));
  return { ...item, objetivo: rng.elegir(otros) };
}
