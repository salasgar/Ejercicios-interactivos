// Práctica «Distributiva con rectángulos» (repaso de la unidad 1): generadores
// y comprobaciones PUROS, sin DOM ni red. Se prueban con `npm test`.
//
// Ejercicio 1 (partir):    a · (b + c) o a · (b − c) cortando un rectángulo.
// Ejercicio 2 (juntar / factor): sacar factor común, con fichas o eligiendo.
// Ejercicio 3 (compensar): n · 99, n · 98, m + 99, m + 98.

const MENOS = '−';
const P = '·';

// ─── Ejercicio 1: parte el rectángulo ──────────────────────────────────────────

/**
 * a ≤ 9 filas; lado largo ≤ 20 celdas.
 * Suma:  a · (b + c), lado largo = b + c, el corte va en b.
 * Resta: a · (b − c), lado largo = b (se quita un trozo de c), el corte va en b − c.
 */
export function generarPartir(rng) {
  const a = rng.entero(2, 9);
  const resta = rng.azar() < 0.3;
  let b, c, largo, corte, solucion;
  if (resta) {
    b = rng.entero(3, 20);
    c = rng.entero(1, b - 1);
    largo = b;
    corte = b - c;
    solucion = a * (b - c);
  } else {
    largo = rng.entero(3, 20);
    b = rng.entero(1, largo - 1);
    c = largo - b;
    corte = b;
    solucion = a * (b + c);
  }
  return { tipo: 'partir', a, b, c, resta, largo, corte, solucion };
}

/** El corte (posición entre 1 y largo − 1) y el total tecleado son los buenos. */
export function corteCorrecto(item, posicion) {
  return posicion === item.corte;
}
export function totalCorrecto(item, total) {
  return Number(total) === item.solucion;
}

/** «4 · (6 + 3) = 4 · 6 + 4 · 3 = 24 + 12 = 36». */
export function igualdad(item) {
  const { a, b, c, resta } = item;
  const op = resta ? MENOS : '+';
  const valor = resta ? a * b - a * c : a * b + a * c;
  return `${a} ${P} (${b} ${op} ${c}) = ${a} ${P} ${b} ${op} ${a} ${P} ${c} = ${a * b} ${op} ${a * c} = ${valor}`;
}

// ─── Ejercicio 2: junta y saca factor común ────────────────────────────────────

/** Valor de «a · b ± a · c». */
function valorFactor(a, b, c, resta) {
  return resta ? a * b - a * c : a * b + a * c;
}

/**
 * Dos tipos al 50 %: 'juntar' (montar a · (b ± c) con fichas) y 'factor'
 * (cuatro opciones). b y c distintos entre sí (con b = c la igualdad se puede
 * escribir de dos formas), 30 % de restas.
 */
export function generarFactor(rng) {
  const resta = rng.azar() < 0.3;
  const a = rng.entero(2, 9);
  let b, c;
  if (resta) {
    b = rng.entero(4, 12);
    c = rng.entero(2, b - 1);
  } else {
    b = rng.entero(2, 12);
    do { c = rng.entero(2, 12); } while (c === b);
  }
  const valor = valorFactor(a, b, c, resta);
  const tipo = rng.azar() < 0.5 ? 'juntar' : 'factor';
  const item = { tipo, a, b, c, resta, valor };
  if (tipo === 'factor') item.opciones = opcionesFactor(rng, item);
  else item.fichas = rng.barajar(['a', 'b', 'c', resta ? MENOS : '+', P, '(', ')']);
  return item;
}

/** Cuatro expresiones con su valor; solo una es la buena. */
function opcionesFactor(rng, { a, b, c, resta, valor }) {
  const o = (expr, v, correcta = false) => ({ expr, valor: v, correcta });
  const lista = resta
    ? [
      o(`${a} ${P} (${b} ${MENOS} ${c})`, a * (b - c), true),
      o(`${a} ${P} ${b} ${MENOS} ${c}`, a * b - c),
      o(`${a} ${P} (${b} + ${c})`, a * (b + c)),
      o(`${a} ${P} ${b} ${P} ${c}`, a * b * c),
    ]
    : [
      o(`${a} ${P} (${b} + ${c})`, a * (b + c), true),
      o(`${a} ${P} ${b} ${P} ${c}`, a * b * c),
      o(`(${a} + ${a}) ${P} (${b} + ${c})`, (a + a) * (b + c)),
      o(`${a} + (${b} ${P} ${c})`, a + b * c),
    ];
  return rng.barajar(lista);
}

/** Las opciones tienen valores distintos entre sí; si no, el ítem se regenera. */
export function opcionesValidas(item) {
  const valores = item.opciones.map(o => o.valor);
  return new Set(valores).size === valores.length;
}

export function generarFactorValido(rng) {
  for (let i = 0; i < 50; i++) {
    const item = generarFactor(rng);
    if (item.tipo === 'juntar' || opcionesValidas(item)) return item;
  }
  throw new Error('no se pudo generar un ítem de factor común');
}

/** Cadenas de fichas válidas para a · (b ± c): con la suma vale el orden que se quiera. */
export function formasValidas(item) {
  const { resta } = item;
  const op = resta ? MENOS : '+';
  const dentro = (x, y) => ['(', x, op, y, ')'];
  const formas = [
    ['a', P, ...dentro('b', 'c')],
    [...dentro('b', 'c'), P, 'a'],
  ];
  if (!resta) formas.push(['a', P, ...dentro('c', 'b')], [...dentro('c', 'b'), P, 'a']);
  return formas.map(f => f.join(' '));
}

/** `fichas`: lista de 'a' | 'b' | 'c' | '+' | '−' | '·' | '(' | ')' en el orden que puso el alumno. */
export function juntarCorrecto(item, fichas) {
  return formasValidas(item).includes(fichas.join(' '));
}

/** La expresión con los números de ese ítem. */
export function textoFichas(item, fichas) {
  const v = { a: item.a, b: item.b, c: item.c };
  return fichas.map(f => v[f] ?? f).join(' ').replace(/\( /g, '(').replace(/ \)/g, ')');
}

/** «6 · 7 + 6 · 3» para el enunciado. */
export function sumaDeProductos(item) {
  const op = item.resta ? MENOS : '+';
  return `${item.a} ${P} ${item.b} ${op} ${item.a} ${P} ${item.c}`;
}

// ─── Ejercicio 3: compensación con 99 y 98 ─────────────────────────────────────

/**
 * 'producto' (n · 99 o n · 98, con dibujo) y 'suma' (m + 99 o m + 98, sin
 * dibujo). Las tres escrituras son FIJAS por ítem (los errores típicos) y sus
 * valores son distintos entre sí y del bueno.
 */
export function generarCompensar(rng) {
  for (let i = 0; i < 50; i++) {
    const item = intentarCompensar(rng);
    if (opcionesValidas(item)) return item;
  }
  throw new Error('no se pudo generar un ítem de compensación');
}

function intentarCompensar(rng) {
  const tipo = rng.azar() < 0.6 ? 'producto' : 'suma';
  const k = rng.azar() < 0.7 ? 99 : 98;
  const falta = 100 - k; // 1 o 2
  const o = (expr, valor, correcta = false) => ({ expr, valor, correcta });
  let n, valor, opciones;
  if (tipo === 'producto') {
    n = rng.entero(12, 60);
    valor = n * k;
    opciones = k === 99
      ? [o(`${n} ${P} 100 ${MENOS} ${n}`, n * 100 - n, true), o(`${n} ${P} 100 ${MENOS} 1`, n * 100 - 1), o(`${n} ${P} 100 ${MENOS} 100`, n * 100 - 100)]
      : [o(`${n} ${P} 100 ${MENOS} 2 ${P} ${n}`, n * 100 - 2 * n, true), o(`${n} ${P} 100 ${MENOS} 2`, n * 100 - 2), o(`${n} ${P} 100 ${MENOS} 100`, n * 100 - 100)];
  } else {
    n = rng.entero(21, 89);
    valor = n + k;
    opciones = [
      o(`${n} + 100 ${MENOS} ${falta}`, n + 100 - falta, true),
      o(`${n} + 100 + ${falta}`, n + 100 + falta),
      o(`${n} + 100 ${MENOS} 100`, n),
    ];
  }
  return { tipo, n, k, falta, valor, opciones: rng.barajar(opciones) };
}

export function compensarCorrecto(item, valorTecleado) {
  return Number(valorTecleado) === item.valor;
}

/** «25 · 99» o «47 + 99». */
export function enunciadoCompensar(item) {
  return item.tipo === 'producto' ? `${item.n} ${P} ${item.k}` : `${item.n} + ${item.k}`;
}
