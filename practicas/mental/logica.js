// Práctica «Cálculo mental con estrategia» (repaso de la unidad 1): generadores
// y comprobaciones PUROS, sin DOM ni red.
//
// Ejercicio 1 (compensar):  47 + 99 = 47 + 100 − 1; 25 · 99 = 25 · 100 − 25.
// Ejercicio 2 (descomponer): 25 · 12 = 25 · 4 · 3 = 100 · 3.
// Ejercicio 3 (estrategia): ¿compenso, descompongo o lápiz y papel?

const MENOS = '−';
const P = '·';

const esPrimo = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };

// ─── Ejercicio 1: compensar ────────────────────────────────────────────────────

/**
 * Suma (70 %): m + 99, m + 98 o m + 199. Producto (30 %): n · 99 o n · 98.
 * Dos pasos: redondeo (la centena más cercana) y ajuste. Las opciones de
 * ajuste son los errores típicos y van FIJAS por ítem (el «− 1» frente al «− 25»).
 */
export function generarCompensar(rng) {
  for (let i = 0; i < 50; i++) {
    const item = intentarCompensar(rng);
    const valores = item.ajustes.map(o => o.valor);
    if (new Set(valores).size === valores.length) return item;
  }
  throw new Error('no se pudo generar un ítem de compensación');
}

function intentarCompensar(rng) {
  const producto = rng.azar() < 0.3;
  const k = producto ? (rng.azar() < 0.7 ? 99 : 98) : rng.elegir([99, 99, 98, 199]);
  const R = k === 199 ? 200 : 100;
  const falta = R - k;
  const n = producto ? rng.entero(12, 60) : (k === 199 ? rng.entero(121, 489) : rng.entero(21, 89));
  const valor = producto ? n * k : n + k;
  const a = (texto, expr, v, correcta = false) => ({ texto, expr, valor: v, correcta });
  let ajustes;
  if (producto) {
    ajustes = [
      a(`${MENOS} ${falta === 1 ? n : `${falta} ${P} ${n}`}`, `${n} ${P} ${R} ${MENOS} ${falta * n}`, n * R - falta * n, true),
      a(`${MENOS} ${falta}`, `${n} ${P} ${R} ${MENOS} ${falta}`, n * R - falta),
      a(`${MENOS} ${R}`, `${n} ${P} ${R} ${MENOS} ${R}`, n * R - R),
    ];
  } else {
    ajustes = [
      a(`${MENOS} ${falta}`, `${n} + ${R} ${MENOS} ${falta}`, n + R - falta, true),
      a(`+ ${falta}`, `${n} + ${R} + ${falta}`, n + R + falta),
      a(`${MENOS} ${R}`, `${n} + ${R} ${MENOS} ${R}`, n),
    ];
  }
  const redondeos = [
    { texto: `${R}`, valor: R, correcta: true },
    { texto: `${R - 10}`, valor: R - 10, correcta: false },
    { texto: `${R + 10}`, valor: R + 10, correcta: false },
  ];
  return {
    tipo: 'compensar', variante: producto ? 'producto' : 'suma', n, k, R, falta, valor,
    redondeos: rng.barajar(redondeos), ajustes: rng.barajar(ajustes),
  };
}

export function enunciadoCompensar(item) {
  return item.variante === 'producto' ? `${item.n} ${P} ${item.k}` : `${item.n} + ${item.k}`;
}

/** La línea que se escribe sola: «47 + 99 = 47 + 100 − 1». */
export function lineaCompensar(item, ajuste = null) {
  const base = item.variante === 'producto' ? `${item.n} ${P} ${item.R}` : `${item.n} + ${item.R}`;
  return `${enunciadoCompensar(item)} = ${ajuste ? ajuste.expr : base}`;
}

export function redondeoCorrecto(item, i) { return item.redondeos[i].correcta; }
export function ajusteCorrecto(item, i) { return item.ajustes[i].correcta; }
export function resultadoCorrecto(item, tecleado) { return Number(tecleado) === item.valor; }

// ─── Ejercicio 2: descomponer ──────────────────────────────────────────────────

/**
 * a · b con a ∈ {25, 5, 50} y b compuesto cómodo (múltiplo de 4 con el 25;
 * par con el 5 y el 50). Tres opciones: la descomposición cómoda en producto
 * (4 · 3), una suma (10 + 2), y una que NO reconstruye b (10 · 2 = 20, o una
 * suma que se pasa).
 */
export function generarDescomponer(rng) {
  const a = rng.elegir([25, 25, 5, 50]);
  const p = a === 25 ? 4 : 2;
  const b = a === 25 ? 4 * rng.entero(3, 9) : 2 * rng.entero(6, 15);
  const q = b / p;
  const valor = a * b;
  const opciones = [
    { clase: 'producto', x: p, y: q, texto: `${p} ${P} ${q}`, correcta: true },
    { clase: 'suma', x: 10, y: b - 10, texto: `10 + ${b - 10}`, correcta: true },
  ];
  opciones.push(rng.azar() < 0.6
    ? { clase: 'producto', x: 10, y: b - 10, texto: `10 ${P} ${b - 10}`, correcta: false }
    : { clase: 'suma', x: b / 2, y: b / 2 + 1, texto: `${b / 2} + ${b / 2 + 1}`, correcta: false });
  return { tipo: 'descomponer', a, b, p, q, valor, opciones: rng.barajar(opciones) };
}

/** Lo que vale la descomposición: el factor que reconstruye (o no). */
export function valorOpcion(op) { return op.clase === 'producto' ? op.x * op.y : op.x + op.y; }

export function reconstruye(item, op) { return valorOpcion(op) === item.b; }

/** «25 · 12 = 25 · 4 · 3 = 100 · 3 = 300» o «25 · 12 = 25 · 10 + 25 · 2 = 250 + 50 = 300». */
export function lineaDescomponer(item, op) {
  const { a, b } = item;
  if (op.clase === 'producto') {
    return `${a} ${P} ${b} = ${a} ${P} ${op.x} ${P} ${op.y} = ${a * op.x} ${P} ${op.y} = ${a * b}`;
  }
  return `${a} ${P} ${b} = ${a} ${P} ${op.x} + ${a} ${P} ${op.y} = ${a * op.x} + ${a * op.y} = ${a * b}`;
}

export function descomposicionCorrecta(item, i, tecleado) {
  return reconstruye(item, item.opciones[i]) && Number(tecleado) === item.valor;
}

// ─── Ejercicio 3: ¿qué conviene? ───────────────────────────────────────────────

const TERMINOS_GRANDES = [98, 99, 199, 999];

/** Un término se compensa si está a 1 o 2 unidades de una decena: acaba en 8 o 9 (98, 99, 199, 999 incluidos). */
export function terminoCompensable(t) { return t >= 8 && (t % 10 === 8 || t % 10 === 9); }
/** Decena redonda hacia la que se compensa: 39 → 40, 98 → 100, 199 → 200. */
export function redondeoDe(t) { return Math.ceil(t / 10) * 10; }

export function esCompuesto(n) { return n > 3 && !esPrimo(n); }

/**
 * Un factor se puede descomponer en producto si es compuesto. (La ficha decía «y ≤ 25 o
 * múltiplo de 5», pero entonces 17 · 99 saldría «no descomponible» y 99 = 9 · 11
 * lo es: la opción falsa se podría defender. Con «compuesto» a secas, las falsas
 * son solo productos de primos y sumas.)
 */
export function factorDescomponible(f) { return esCompuesto(f); }

/** Compensar ⇔ algún término acaba en 8 o 9 (redondeo a la decena, a la centena o al millar). */
export function aplicaCompensar(op) {
  return terminoCompensable(op.a) || terminoCompensable(op.b);
}
/** Descomponer (un factor en producto) ⇔ es un producto y algún factor es descomponible. */
export function aplicaDescomponer(op) {
  return op.signo === P && (factorDescomponible(op.a) || factorDescomponible(op.b));
}
/** Estrategias aplicables; el lápiz y papel siempre lo es, y la calculadora solo se ofrece en las cuentas grandes. */
export function aplicables(item) {
  const lista = ['papel'];
  if (aplicaCompensar(item.op)) lista.push('compensar');
  if (aplicaDescomponer(item.op)) lista.push('descomponer');
  if (item.calculadora) lista.push('calculadora');
  return lista;
}
export function estrategiaValida(item, estrategia) { return aplicables(item).includes(estrategia); }

/**
 * La estrategia más corta: compensar si hay un 98, 99, 199 o 999; descomponer si lleva a un
 * producto fácil (por 10, por 100…); compensar si hay otro término acabado en 8 o 9; si no,
 * papel (o calculadora en las grandes).
 */
export function mejorEstrategia(item) {
  if (TERMINOS_GRANDES.includes(item.op.a) || TERMINOS_GRANDES.includes(item.op.b)) return 'compensar';
  const d = aplicaDescomponer(item.op) ? descomposicionComoda(item.op) : null;
  if (d && d.puntos >= 1) return 'descomponer';
  if (aplicaCompensar(item.op)) return 'compensar';
  return item.calculadora ? 'calculadora' : 'papel';
}

/** Hay un atajo (compensar o descomponer con ganancia) y el alumno ha ido por lápiz y papel. */
export function papelHabiendoAtajo(item, estrategia) {
  const mejor = mejorEstrategia(item);
  return estrategia === 'papel' && (mejor === 'compensar' || mejor === 'descomponer');
}

export const BOTONES = ['compensar', 'descomponer', 'papel'];

/** Factor que conviene descomponer y en qué: busca que (otro · p) acabe en 0 (mejor, en 00). */
export function descomposicionComoda(op) {
  let mejor = null;
  for (const [f, g] of [[op.a, op.b], [op.b, op.a]]) {
    if (!factorDescomponible(f)) continue;
    for (let p = 2; p < f; p++) {
      if (f % p !== 0) continue;
      const puntos = (g * p) % 100 === 0 ? 2 : (g * p) % 10 === 0 ? 1 : 0;
      if (!mejor || puntos > mejor.puntos || (puntos === mejor.puntos && p < mejor.p)) mejor = { f, g, p, q: f / p, puntos };
    }
  }
  return mejor;
}

/** La línea de la estrategia mejor, con los números de ese ítem. */
export function lineaEstrategia(item, estrategia) {
  const { a, b, signo } = item.op;
  if (estrategia === 'compensar') {
    const k = terminoCompensable(b) ? b : a;
    const otro = k === b ? a : b;
    const R = redondeoDe(k);
    const falta = R - k;
    return signo === '+'
      ? `${a} + ${b} = ${otro} + ${R} ${MENOS} ${falta} = ${otro + R} ${MENOS} ${falta} = ${otro + k}`
      : `${a} ${P} ${b} = ${otro} ${P} ${R} ${MENOS} ${falta === 1 ? otro : `${falta} ${P} ${otro}`} = ${otro * R} ${MENOS} ${falta * otro} = ${otro * k}`;
  }
  const d = descomposicionComoda(item.op);
  return `${a} ${P} ${b} = ${d.g} ${P} ${d.p} ${P} ${d.q} = ${d.g * d.p} ${P} ${d.q} = ${a * b}`;
}

/** Por qué NO se puede aplicar (solo se pide cuando no es aplicable). */
export function razonNoAplica(item, estrategia) {
  const { a, b, signo } = item.op;
  if (estrategia === 'compensar') return { clave: 'compensar', a, b };
  return { clave: signo === '+' ? 'descomponer_suma' : 'descomponer_primos', a, b };
}

// Números para las cuentas que NO se pueden compensar ni descomponer. Ninguno acaba en 8, 9, 0, 1 o 2
// (a 1 o 2 de una decena, o ya redondo), así que «compenso» no se puede defender. Los primos pequeños
// son 3, 5, 7 y primos acabados en 3 o 7.
const acabaEnMedio = n => n % 10 >= 3 && n % 10 <= 7;
const PRIMOS_PEQUENOS = [3, 5, 7, 13, 17, 23, 37, 43, 47, 53, 67, 73];
const PRIMOS_GRANDES = Array.from({ length: 800 }, (_, i) => 120 + i).filter(n => esPrimo(n) && acabaEnMedio(n) && n % 100 >= 20 && n % 100 <= 80);
const NUMEROS_GRANDES = Array.from({ length: 780 }, (_, i) => 120 + i).filter(n => acabaEnMedio(n) && n % 100 >= 20 && n % 100 <= 80);
const FACTORES_COMODOS = [14, 15, 16, 18, 20, 24, 25, 30, 35, 45, 50];
// Segundo factor de «descomponer»: sin 11 ni 12 (a 1 o 2 de la decena, donde «compenso» también se podría defender).
const SEGUNDOS_FACTORES = [3, 4, 5, 6, 7, 8, 9, 10, 13, 14, 15, 16, 17, 18, 19];

/** Dos sumandos sin compensar; su suma no es una decena redonda (24 + 76 tiene otro truco). */
function sumaSinCompensar(rng, pool) {
  for (;;) {
    const a = rng.elegir(pool), b = rng.elegir(pool);
    if ((a + b) % 10 !== 0) return { a, signo: '+', b };
  }
}
const NUMEROS_PEQUENOS = Array.from({ length: 69 }, (_, i) => 11 + i).filter(acabaEnMedio);

/**
 * Categorías: compensar (suma o producto, 35 %), descomponer (22 %), ninguna
 * (suma o producto de primos pequeños, 23 %) y grande (con calculadora, 20 %).
 * Los problemas cortos salen en el 40 % de los ítems.
 */
export function generarEstrategia(rng) {
  const r = rng.azar();
  const categoria = r < 0.35 ? 'compensar' : r < 0.57 ? 'descomponer' : r < 0.80 ? 'ninguna' : 'grande';
  let op, problema = null, calculadora = false;
  if (categoria === 'compensar') {
    if (rng.azar() < 0.65) { op = { a: rng.entero(21, 89), signo: '+', b: rng.elegir([99, 99, 98, 199]) }; problema = 'suma_k'; }
    else { op = { a: rng.entero(3, 40), signo: P, b: rng.elegir([99, 98]) }; problema = 'producto_k'; }
  } else if (categoria === 'descomponer') {
    // Solo cuentas donde descomponer lleva de verdad a un producto fácil (por 10 o por 100).
    do op = { a: rng.elegir(FACTORES_COMODOS), signo: P, b: rng.elegir(SEGUNDOS_FACTORES) };
    while (descomposicionComoda(op).puntos < 1);
    problema = 'cajas';
  } else if (categoria === 'ninguna') {
    if (rng.azar() < 0.5) { op = sumaSinCompensar(rng, NUMEROS_PEQUENOS); problema = 'cromos'; }
    else { op = { a: rng.elegir(PRIMOS_PEQUENOS), signo: P, b: rng.elegir(PRIMOS_PEQUENOS) }; problema = 'sillas'; }
  } else {
    calculadora = true;
    if (rng.azar() < 0.5) { op = sumaSinCompensar(rng, NUMEROS_GRANDES); problema = 'arboles'; }
    else { op = { a: rng.elegir(PRIMOS_GRANDES), signo: P, b: rng.elegir(PRIMOS_GRANDES) }; problema = 'piezas'; }
  }
  const item = { tipo: 'estrategia', categoria, op, calculadora, enunciado: rng.azar() < 0.4 ? problema : null };
  item.texto = `${op.a} ${op.signo} ${op.b}`;
  item.valor = op.signo === '+' ? op.a + op.b : op.a * op.b;
  item.botones = calculadora ? [...BOTONES, 'calculadora'] : BOTONES;
  return item;
}
