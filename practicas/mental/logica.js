// Práctica «Cálculo mental con estrategia» (repaso de la unidad 1): generadores
// y comprobaciones PUROS, sin DOM ni red.
//
// Ejercicio 1 (compensar):  47 + 99 = 47 + 100 − 1; 25 · 99 = 25 · 100 − 25.
// Ejercicio 2 (descomponer): 25 · 12 = 25 · 4 · 3 = 100 · 3.

const MENOS = '−';
const P = '·';

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
