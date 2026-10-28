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
  let a, b;
  if (forma < 0.2) { a = natural(rng); b = fraccionIrreducible(rng); }
  else if (forma < 0.4) { a = fraccionIrreducible(rng); b = natural(rng); }
  else { a = fraccionIrreducible(rng); b = fraccionIrreducible(rng); }
  if (neg) { if (queNegativo === 0) a = negativa(a); else b = negativa(b); }
  return { tipo: 'divide', a, b, valor: par(F(a).dividir(F(b)).simplificar()) };
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
  const exp = rng.azar() < 0.65 ? 2 : 3;
  const tope = exp === 2 ? 9 : 5;
  const base = fraccionIrreducible(rng, tope, tope, 2);
  return { tipo: 'potencia', base, exp, valor: par(F(base).potencia(exp)) };
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
