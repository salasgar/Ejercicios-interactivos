// «Multiplica y divide» (unidad 4, tarea 105): generadores y ayudas de error, PUROS (sin DOM),
// probados en `tests/practicas-multiplica-divide.test.js`. Las fracciones de un ítem son pares
// `[numerador, denominador]` (JSON simple: el ítem se guarda en el registro de fallos); `F` las
// convierte en `Fraccion` de la base. El menos es siempre el de `fracciones.js` (U+2212).
//
// Cotas de realismo (aquí no hay contexto, solo cuentas): numeradores de 1 a 12 y denominadores
// de 2 a 12 (naturales de 2 a 12), fracciones irreducibles; resultados con términos de hasta 144.
// El ejercicio 2 sí tiene contexto (un todo cuadriculado): cada contexto declara su `max` de trozos
// (tableta de chocolate hasta 24, bandeja de brownies hasta 20, huerto en bancales hasta 24).
// Acta del 26-10: negativas en los ejercicios 1, 3 y 4 (en uno de cada cuatro ítems, una sola
// fracción negativa, con el signo delante de la raya); ninguna en el 2 y el 5. Potencias solo de
// base positiva. Producto y potencias son de la sesión 7; el cociente, de la 9.

import {
  fraccion, ERRORES_TIPICOS, distractores,
} from '../_comun/fracciones.js';
import { mcd } from '../_comun/aritmetica.js';

export const ERROR_OTRO = 'otro-error';
/** Errores propios de esta práctica (no están en `ERRORES_TIPICOS`; se proponen en la terminada). */
export const ERROR_SIN_SIMPLIFICAR = 'sin-simplificar';
export const ERROR_DIVIDE_EN_VEZ_DE_MULTIPLICAR = 'divide-en-vez-de-multiplicar';
export const ERROR_PRODUCTO_NO_ES_UNO = 'producto-no-es-uno';

export const F = ([n, d]) => fraccion(n, d);
export const par = f => [f.num, f.den];

// ─── Casos que no se pueden repetir (regla de oro de contenido, punto 9) ──────
// Los de examen (exámenes semanales 2 y 3, examen final), por su huella: el repositorio y la
// web son públicos, y el enunciado de un examen no se puede leer en el código publicado. Las
// huellas se calcularon con un guion en el scratchpad (no se comitea) a partir de los TSV de
// casos y de los tres modelos del examen final; aquí solo queda el hash FNV-1a de 32 bits.
export const huella = s => {
  let h = 0x811c9dc5;
  for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(36);
};
const fr = ([n, d]) => `${n}/${d}`;
const valorAbs = ([n, d]) => `${Math.abs(n)}/${d}`;
const signoDe = (a, b) => Math.sign(a[0]) * Math.sign(b[0]);
/** Ej. 1 (multiplica): clave sin orden y sin el sitio del signo: (|a|, |b|) y signo del producto. */
export const huellaMultiplica = (a, b) => huella(`${[valorAbs(a), valorAbs(b)].sort().join('|')}|${signoDe(a, b)}`);
/** Ej. 4 (divide): clave con orden y sin el sitio del signo: (|a|, |b|) y signo del cociente. */
export const huellaDivide = (a, b) => huella(`${valorAbs(a)}|${valorAbs(b)}|${signoDe(a, b)}`);
/** Ej. 5 (potencias): clave la base y el exponente. */
export const huellaPotencia = (base, exp) => huella(`${fr(base)}^${exp}`);

export const HUELLAS_EXAMEN_MULTIPLICA = new Set([
  'zzw14b', '1tfuajb', 'g62pu9', 'dedpbb', 'f7oy2t', 'zvyrqg', '2nl8qt', '16mdwuh',
  '1u3nv9g', '1felgiw', '8v0ap', 'llrdzg', '1a859pb', '1dvw5n1', 'yh1yci',
  // Productos de U4-2A-06 (semanal 2) y de la pareja «suma y producto» de U4-3C-09 (semanal 3), con los extra.
  '1ieab3t', '1fa60e6', 'k9ycer', '17ckci7', '7v86u4', '74pjb1',
  '1hl324r', '1qxet79', 'j7uews', '1c6xb7k', '141esa9', '1ozppjz',
]);
export const HUELLAS_EXAMEN_DIVIDE = new Set([
  'egip4f', 'ga31l8', '1pmlz6k', 'j6l89j', '1xto2fa', '1uddy7s', '155fuck', '6i7s2h',
  '1twfyos', '1bo0vnq', '17859kg', 'itht34', 'rcthdf', '1a707nu', '1wnx085', '16bzgc9',
  'wiwxc', '40p480', '10yro6m', 'gq7ign', '13iwn0r', 'ptscgd', 'qh6fvy',
  // «Número : fracción» de U4-1A-02 (semanal 1 con los extra, y modelo 2 del final).
  '52xqcx', '1o5dwkn', '1q1cidf', 'fapwhm', '1h6a7km', 'rtabpc', '11y96sy',
]);
export const HUELLAS_EXAMEN_POTENCIA = new Set([
  '4ip7sn', 'x8sfeg', '1808zrt', '11rn67e', 'quac4a', '18hpam4',
  // U4-3C-11 del examen semanal 3: la cuenta mal hecha es una potencia (1 variante).
  'ze6aby',
]);

// Los de las hojas y del banco, en claro: los alumnos ya los tienen en papel.
// Se comparan por valores absolutos y signo del resultado: el menos en el otro operando es la misma cuenta.
const igual = (p, q) => p[0] === q[0] && p[1] === q[1];
const igualAbs = (p, q) => Math.abs(p[0]) === Math.abs(q[0]) && p[1] === q[1];
/** ¿(a,b) es una de las parejas de `pool`, en cualquier orden? */
const esParejaHoja = (pool, a, b) => pool.some(([x, y]) => signoDe(a, b) === signoDe(x, y)
  && ((igualAbs(a, x) && igualAbs(b, y)) || (igualAbs(a, y) && igualAbs(b, x))));
/** ¿(a,b) es una de las parejas de `pool`, con el mismo orden (dividendo, divisor)? */
const coincideDivide = (pool, a, b) => pool.some(([x, y]) => signoDe(a, b) === signoDe(x, y) && igualAbs(a, x) && igualAbs(b, y));

// Hoja 3, ej. 1a (4/9·3/10), 6b (3/8·(−4/9)), 7a (2/11·5/11), 7b (1/10·3/4) y 7d (6·2/5); banco B11b (4/5·3/4);
// hoja 2, ej. 11 (apartado «For after the class on Thursday 7 January»), de la a a la h, y ej. 12a-b.
export const PAREJAS_HOJA_MULTIPLICA = [
  [[4, 9], [3, 10]], [[1, 10], [3, 4]], [[6, 1], [2, 5]], [[4, 5], [3, 4]],
  [[5, 1], [3, 8]], [[2, 1], [7, 12]], [[5, 8], [3, 7]], [[2, 3], [9, 10]],
  [[4, 5], [3, 5]], [[10, 21], [14, 15]], [[8, 9], [3, 4]], [[2, 5], [4, 7]],
  [[3, 8], [-4, 9]], [[2, 11], [5, 11]],
  [[4, 5], [5, 12]], [[4, 9], [3, 8]],
];
// Hoja 3, ej. 3a-3f; 4a, 4b, 4c, 4e, 4f; 5b, 5b2, 5b3; 6c, 6e; 7c2; 12b; banco B11a y B11c.
export const PAREJAS_HOJA_DIVIDE = [
  [[3, 5], [2, 7]], [[7, 8], [7, 4]], [[2, 9], [5, 6]], [[9, 10], [3, 5]],
  [[5, 1], [2, 3]], [[8, 1], [4, 5]], [[12, 1], [3, 4]], [[2, 7], [4, 1]], [[6, 11], [3, 1]],
  [[7, 2], [7, 4]], [[3, 5], [9, 10]], [[5, 6], [10, 1]],
  [[6, 1], [-3, 5]],
  [[5, 6], [1, 3]],
  [[9, 1], [3, 4]], [[6, 1], [2, 5]],
  [[5, 6], [10, 9]], [[4, 9], [2, 5]], [[-5, 6], [10, 3]], [[3, 5], [4, 7]],
];
// Hoja 2, ej. 12c: 1/3 de los que juegan un instrumento (3/5), sin importar el orden.
export const PAREJAS_HOJA_PARTE = [[[1, 3], [3, 5]]];

/** Fracción irreducible de numerador 1 a `maxNum` y denominador 2 a `maxDen`. */
function fraccionIrreducible(rng, maxNum = 12, maxDen = 12, minNum = 1) {
  for (;;) {
    const n = rng.entero(minNum, maxNum), d = rng.entero(2, maxDen);
    if (mcd(n, d) === 1) return [n, d];
  }
}
const natural = (rng, max = 12) => [rng.entero(2, max), 1];
const negativa = ([n, d]) => [-n, d];

/** Un operando: fracción o (una de cada cinco) natural. */
const operando = (rng, conNatural) => (conNatural ? natural(rng) : fraccionIrreducible(rng));

/** ¿Se puede tachar algo antes de multiplicar a/b · c/d? (mcd cruzados mayores que 1) */
export function cancelaciones(a, b) {
  const g1 = mcd(Math.abs(a[0]), b[1]), g2 = mcd(Math.abs(b[0]), a[1]);
  return { g1, g2, hay: g1 > 1 || g2 > 1 };
}

// ─── Ejercicio 1: multiplica ───────────────────────────────────────────────────

/**
 * `2/3 · 3/4`, `5 · 2/7`, `3/4 · 5`. Un cuarto de los ítems, con una fracción negativa; la mitad,
 * con algo que tachar antes de multiplicar. `valor` es la irreducible.
 */
export function generarMultiplica(rng) {
  const forma = rng.azar();
  const neg = rng.azar() < 0.25;
  const queNegativo = rng.azar() < 0.5 ? 0 : 1;
  const quiereTachar = rng.azar() < 0.5;
  for (let intento = 0; ; intento++) {
    let a, b;
    if (forma < 0.2) { a = natural(rng); b = fraccionIrreducible(rng); }
    else if (forma < 0.4) { a = fraccionIrreducible(rng); b = natural(rng); }
    else { a = fraccionIrreducible(rng); b = fraccionIrreducible(rng); }
    if (quiereTachar && intento < 40 && !cancelaciones(a, b).hay) continue;
    if (neg) { if (queNegativo === 0) a = negativa(a); else b = negativa(b); }
    if (HUELLAS_EXAMEN_MULTIPLICA.has(huellaMultiplica(a, b)) || esParejaHoja(PAREJAS_HOJA_MULTIPLICA, a, b)) continue;
    const valor = par(F(a).multiplicar(F(b)).simplificar());
    return { tipo: 'multiplica', a, b, valor };
  }
}

/** El error que explica una respuesta equivocada `r` (una Fraccion) del producto. */
export function errorDeMultiplica(item, r) {
  const a = F(item.a), b = F(item.b), buena = F(item.valor);
  if (r.equals(buena)) return r.esIrreducible() ? null : ERROR_SIN_SIMPLIFICAR;
  const candidatos = [['multiplica-en-cruz', a, b], ['multiplica-sumando-denominadores', a, b], ['suma-en-vez-de-multiplicar', a, b], ['signo-perdido', buena]];
  if (item.a[1] === 1) candidatos.push(['natural-por-ambos', item.a[0], b]);
  if (item.b[1] === 1) candidatos.push(['natural-por-ambos', item.b[0], a]);
  if (a.den === b.den) candidatos.push(['producto-denominador-comun', a, b]);
  return distractores(candidatos, buena).find(d => d.valor.equals(r))?.error ?? ERROR_OTRO;
}

/** Los factores después de tachar en cruz: a/b · c/d → (a/g2)/(b/g1) · (c/g1)/(d/g2), irreducibles. */
export function tachado(item) {
  const { g1, g2 } = cancelaciones(item.a, item.b);
  // El numerador del primero y el denominador del segundo se dividen entre g1; el denominador
  // del primero y el numerador del segundo, entre g2.
  return {
    g1, g2,
    a: [item.a[0] / g1, item.a[1] / g2],
    b: [item.b[0] / g2, item.b[1] / g1],
  };
}

// ─── Ejercicio 2: la fracción de una fracción ──────────────────────────────────

/** Contextos de un «todo» cuadriculado; `max` = trozos creíbles. */
export const CONTEXTOS_PARTE = [
  { id: 'tableta', max: 24, nombre: { es: 'la tableta de chocolate', en: 'the chocolate bar' } },
  { id: 'bandeja', max: 20, nombre: { es: 'la bandeja de brownies', en: 'the tray of brownies' } },
  { id: 'huerto', max: 24, nombre: { es: 'el huerto', en: 'the vegetable garden' } },
];

/**
 * «c/d del todo es X; tomas a/b de X; ¿qué fracción del todo?». El todo es una cuadrícula de
 * b filas y d columnas: X son las primeras c columnas y a/b de X, sus a primeras filas.
 * `valor` es la irreducible de (a·c)/(b·d).
 */
export function generarParte(rng) {
  const contexto = rng.elegir(CONTEXTOS_PARTE);
  for (;;) {
    const b = rng.entero(2, 4), d = rng.entero(2, 6);
    if (b * d > contexto.max || b * d < 4) continue;
    const a = rng.entero(1, b - 1), c = rng.entero(1, d - 1);
    const dos = [fraccion(a, b).simplificar(), fraccion(c, d).simplificar()];
    // Las dos fracciones se escriben irreducibles (2/4 no sale: la cuadrícula tendría otra forma).
    if (!dos[0].mismaForma(fraccion(a, b)) || !dos[1].mismaForma(fraccion(c, d))) continue;
    // Hoja 2, ej. 12c: 1/3 de los que juegan un instrumento (3/5), en cualquier orden.
    if (esParejaHoja(PAREJAS_HOJA_PARTE, [a, b], [c, d])) continue;
    const valor = par(fraccion(a * c, b * d).simplificar());
    return { tipo: 'parte', contexto: contexto.id, a: [a, b], c: [c, d], filas: b, columnas: d, valor };
  }
}

export const contextoDe = id => CONTEXTOS_PARTE.find(x => x.id === id);

/** Las partes (índices de la cuadrícula) que son «X» (primeras c columnas) y su a/b (primeras a filas). */
export function partesDeLaParte(item) {
  const x = [], y = [];
  for (let i = 0; i < item.filas * item.columnas; i++) {
    const fila = Math.floor(i / item.columnas), col = i % item.columnas;
    if (col < item.c[0]) { x.push(i); if (fila < item.a[0]) y.push(i); }
  }
  return { x, y };
}

/** Dividir en vez de multiplicar: (a/b) : (c/d). */
export function dividirEnVezDeMultiplicar(a, c) {
  const x = F(a), y = F(c);
  return x.num === 0 || y.num === 0 ? null : x.dividir(y);
}

export function errorDeParte(item, r) {
  const a = F(item.a), c = F(item.c), buena = F(item.valor);
  if (r.equals(buena)) return r.esIrreducible() ? null : ERROR_SIN_SIMPLIFICAR;
  const dividido = dividirEnVezDeMultiplicar(item.a, item.c);
  if (dividido && dividido.equals(r) && !dividido.equals(buena)) return ERROR_DIVIDE_EN_VEZ_DE_MULTIPLICAR;
  return distractores([['suma-en-vez-de-multiplicar', a, c], ['multiplica-en-cruz', a, c], ['multiplica-sumando-denominadores', a, c]], buena)
    .find(d => d.valor.equals(r))?.error ?? ERROR_OTRO;
}

// ─── Ejercicio 3: la inversa ───────────────────────────────────────────────────

/**
 * Una fracción o un natural (uno de cada cuatro), un cuarto de ellos negativos: se escribe su
 * inversa y después se comprueba que `f · inversa = 1`.
 */
export function generarInversa(rng) {
  const esNatural = rng.azar() < 0.25;
  let f = esNatural ? natural(rng) : fraccionIrreducible(rng);
  if (rng.azar() < 0.25) f = negativa(f);
  return { tipo: 'inversa', f, valor: par(F(f).inversa()) };
}

export function errorDeInversa(item, r) {
  const f = F(item.f), buena = F(item.valor);
  const candidatos = [['inversa-como-opuesta', f], ['signo-perdido', buena]];
  if (item.f[1] === 1) candidatos.unshift(['inversa-del-natural', item.f[0]]);
  return distractores(candidatos, buena).find(d => d.valor.equals(r))?.error ?? ERROR_OTRO;
}

/** El segundo paso: `f · inversa`. Solo vale 1; cualquier otra cosa se explica con la suma o es otro error. */
export function errorDeProductoInversa(item, r) {
  const f = F(item.f), inv = F(item.valor);
  return distractores([['suma-en-vez-de-multiplicar', f, inv]], 1).find(d => d.valor.equals(r))?.error ?? ERROR_PRODUCTO_NO_ES_UNO;
}

// ─── Ejercicio 4: divide ───────────────────────────────────────────────────────

/**
 * `2/3 : 4/5`, `5 : 3/4`, `3/4 : 5`. Un cuarto de los ítems, con una fracción negativa.
 * El alumno puede resolverlo por la inversa o en cruz (`pasosDivide`): el resultado es el mismo.
 */
export function generarDivide(rng) {
  const forma = rng.azar();
  const neg = rng.azar() < 0.25;
  const queNegativo = rng.azar() < 0.5 ? 0 : 1;
  for (;;) {
    let a, b;
    if (forma < 0.2) { a = natural(rng); b = fraccionIrreducible(rng); }
    else if (forma < 0.4) { a = fraccionIrreducible(rng); b = natural(rng); }
    else { a = fraccionIrreducible(rng); b = fraccionIrreducible(rng); }
    if (neg) { if (queNegativo === 0) a = negativa(a); else b = negativa(b); }
    if (HUELLAS_EXAMEN_DIVIDE.has(huellaDivide(a, b)) || coincideDivide(PAREJAS_HOJA_DIVIDE, a, b)) continue;
    return { tipo: 'divide', a, b, valor: par(F(a).dividir(F(b)).simplificar()) };
  }
}

/**
 * Los dos métodos con los números del ítem, sin simplificar. Por la inversa: `a : b = a · b⁻¹ =
 * producto`. En cruz: `(a.num · b.den) / (a.den · b.num)`; el signo va aparte, delante de la raya.
 */
export function pasosDivide(item) {
  const a = F(item.a), b = F(item.b);
  const inversa = b.inversa(), producto = a.dividir(b);
  return {
    inversa: par(inversa),
    producto: par(producto),
    cruz: { arriba: [Math.abs(a.num), b.den], abajo: [a.den, Math.abs(b.num)], negativo: producto.num < 0 },
  };
}

export function errorDeDivide(item, r) {
  const a = F(item.a), b = F(item.b), buena = F(item.valor);
  if (r.equals(buena)) return r.esIrreducible() ? null : ERROR_SIN_SIMPLIFICAR;
  return distractores(
    [['invierte-la-primera', a, b], ['no-invierte', a, b], ['invierte-las-dos', a, b], ['signo-perdido', buena]], buena,
  ).find(d => d.valor.equals(r))?.error ?? ERROR_OTRO;
}

// ─── Ejercicio 5: potencias ────────────────────────────────────────────────────

/** `(2/3)²`, `(1/2)³`, `(3/5)²`: base positiva e irreducible, exponente 2 o 3 (término hasta 9, o hasta 5 con el 3); numerador ≥ 2, para que «elevar solo el numerador» y «base por exponente» no den el mismo valor. */
export function generarPotencia(rng) {
  for (;;) {
    const exp = rng.azar() < 0.65 ? 2 : 3;
    const tope = exp === 2 ? 9 : 5;
    const base = fraccionIrreducible(rng, tope, tope, 2);
    if (HUELLAS_EXAMEN_POTENCIA.has(huellaPotencia(base, exp))) continue;
    return { tipo: 'potencia', base, exp, valor: par(F(base).potencia(exp)) };
  }
}

/** Los dos errores del ejercicio, con su valor (distintos entre sí y de la respuesta correcta). */
export function distractoresPotencia(item) {
  const f = F(item.base);
  return distractores([['eleva-solo-el-numerador', f, item.exp], ['base-por-exponente', f, item.exp]], F(item.valor));
}

export function errorDePotencia(item, r) {
  const buena = F(item.valor);
  if (r.equals(buena)) return r.esIrreducible() ? null : ERROR_SIN_SIMPLIFICAR;
  return distractoresPotencia(item).find(d => d.valor.equals(r))?.error ?? ERROR_OTRO;
}

export { ERRORES_TIPICOS };
