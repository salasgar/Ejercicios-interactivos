// Propiedades de las potencias y última cifra (ampliación de la unidad 1): lógica.
// Todo puro (sin DOM ni red). Los generadores devuelven DATOS, nunca HTML.
//
// Un término es { base, exp, k }: la potencia (base^exp)^k. Con k = 1 es una
// potencia sin más; su exponente efectivo es exp · k.

// --- Ejercicio 1: juntar potencias de la misma base ------------------------------

const BASES = [2, 3, 4, 5, 6, 7, 8, 9, 10];
export const MAX_EXP = 30;
export const MIN_EXP = 2;

/** Raíz de una base: la menor r tal que base = r^i (4 y 8 → 2; 9 → 3; el resto, ella misma). */
function raizDe(n) {
  for (let r = 2; r < n; r++) for (let p = r; p <= n; p *= r) if (p === n) return r;
  return n;
}
/** Dos bases son parientes si una es potencia de la otra o de una raíz común: 2/4/8 y 3/9. */
export const emparentadas = (a, b) => raizDe(a) === raizDe(b);

/** Exponente efectivo de un término: (b^e)^k = b^(e·k). */
export const efectivo = t => t.exp * (t.k ?? 1);

/** Qué impide juntar los términos i e i+1: 'bases' | 'orden' | null (se puede).
 *  Las operaciones se hacen de izquierda a derecha: en a : b · c no se puede
 *  juntar primero b · c (daría a : (b · c)), y en a : b : c tampoco b : c. */
export function razonNoJunta(terminos, ops, i) {
  if (terminos[i].base !== terminos[i + 1].base) return 'bases';
  if (i > 0 && ops[i - 1] !== '·') return 'orden';
  return null;
}

/** Exponente de juntar los términos i e i+1 (que se pueden juntar). */
export function exponenteJunto(terminos, ops, i) {
  const a = efectivo(terminos[i]), b = efectivo(terminos[i + 1]);
  return ops[i] === '·' ? a + b : a - b;
}

/** Junta los términos i e i+1 con el exponente dado: devuelve { terminos, ops } nuevos. */
export function juntar(terminos, ops, i, exp) {
  return {
    terminos: [...terminos.slice(0, i), { base: terminos[i].base, exp, k: 1 }, ...terminos.slice(i + 2)],
    ops: [...ops.slice(0, i), ...ops.slice(i + 1)],
  };
}

/** ¿Queda algo por juntar? */
export function terminado(terminos, ops) {
  return !terminos.some((_, i) => i < terminos.length - 1 && razonNoJunta(terminos, ops, i) === null);
}

/** Recorre TODAS las formas válidas de juntar y comprueba que cada exponente que
 *  sale está entre MIN_EXP y MAX_EXP (en un cociente nunca baja de ahí). */
export function todasLasFusionesSonBuenas(terminos, ops) {
  for (let i = 0; i < terminos.length - 1; i++) {
    if (razonNoJunta(terminos, ops, i) !== null) continue;
    const e = exponenteJunto(terminos, ops, i);
    if (e < MIN_EXP || e > MAX_EXP) return false;
    const { terminos: t, ops: o } = juntar(terminos, ops, i, e);
    if (!todasLasFusionesSonBuenas(t, o)) return false;
  }
  return true;
}

/** Cadena a juntar hasta el final: los términos que quedan (exponentes ya juntos). */
export function resolver(terminos, ops) {
  let t = terminos, o = ops;
  for (;;) {
    const i = t.findIndex((_, j) => j < t.length - 1 && razonNoJunta(t, o, j) === null);
    if (i < 0) return { terminos: t, ops: o };
    ({ terminos: t, ops: o } = juntar(t, o, i, exponenteJunto(t, o, i)));
  }
}

/** Ítem: { tipo: 'juntar', base, terminos, operadores, solucion }.
 *  Al principio, dos potencias; después tres; y de vez en cuando una de otra base
 *  (que no se junta) al principio o al final. `solucion`: lo que queda al juntar todo. */
export function generarJuntar(rng, sesion = {}) {
  const aciertos = sesion.aciertos ?? 0;
  for (;;) {
    const ajena = aciertos >= 3 && rng.azar() < 0.3;
    const n = aciertos < 2 ? 2 : (ajena ? 3 : rng.elegir([2, 3, 3]));
    const base = rng.elegir(BASES);
    const terminos = Array.from({ length: n }, () => ({ base, exp: rng.entero(MIN_EXP, 9), k: 1 }));
    const ops = Array.from({ length: n - 1 }, () => (rng.azar() < 0.55 ? '·' : ':'));
    if (ajena) {
      // La base ajena no puede ser pariente: 2³ · 2⁶ · 4⁷ sí se podría juntar (4⁷ = 2¹⁴).
      const otra = rng.elegir(BASES.filter(b => !emparentadas(b, base)));
      const alFinal = rng.azar() < 0.5;
      const e = rng.entero(MIN_EXP, 9);
      if (alFinal) { terminos[2] = { base: otra, exp: e, k: 1 }; ops[1] = '·'; }
      else { terminos[0] = { base: otra, exp: e, k: 1 }; ops[0] = '·'; }
    }
    if (!todasLasFusionesSonBuenas(terminos, ops)) continue;
    const solucion = resolver(terminos, ops).terminos.map(t => ({ base: t.base, exp: t.exp }));
    return { tipo: 'juntar', base, terminos, operadores: ops, solucion };
  }
}

// --- Ejercicio 2: potencia de potencia y cadenas ---------------------------------

/** Exponente de una cadena de potencias de la misma base, de izquierda a derecha,
 *  y todos los exponentes parciales (para comprobar que nunca bajan de MIN_EXP). */
export function evaluarCadena(terminos, ops) {
  const parciales = [efectivo(terminos[0])];
  for (let i = 0; i < ops.length; i++) {
    const e = efectivo(terminos[i + 1]);
    parciales.push(ops[i] === '·' ? parciales[i] + e : parciales[i] - e);
  }
  return { solucion: parciales.at(-1), parciales };
}

/** Ítem: { tipo: 'potencia' | 'cadena', base, terminos, operadores, solucion }.
 *  'potencia': (b^m)^k. 'cadena': 2-4 potencias de la misma base, algunas de ellas
 *  potencias de potencias, unidas con · y :. */
export function generarPotencias(rng, sesion = {}) {
  const aciertos = sesion.aciertos ?? 0;
  const soloPotencia = aciertos < 3 || rng.azar() < 0.35;
  for (;;) {
    const base = rng.elegir(BASES);
    if (soloPotencia) {
      const exp = rng.entero(2, 8), k = rng.entero(2, 4);
      const terminos = [{ base, exp, k }];
      return { tipo: 'potencia', base, terminos, operadores: [], solucion: exp * k };
    }
    const n = aciertos < 6 ? rng.elegir([2, 3, 3]) : rng.elegir([3, 3, 4, 4]);
    const terminos = Array.from({ length: n }, () => ({
      base, exp: rng.entero(MIN_EXP, 6), k: rng.azar() < 0.3 ? rng.entero(2, 3) : 1,
    }));
    if (!terminos.some(t => t.k > 1) && rng.azar() < 0.5) continue; // la mitad, sin potencia de potencia
    const ops = Array.from({ length: n - 1 }, () => (rng.azar() < 0.55 ? '·' : ':'));
    const { solucion, parciales } = evaluarCadena(terminos, ops);
    if (parciales.some(p => p < MIN_EXP || p > MAX_EXP)) continue;
    return { tipo: 'cadena', base, terminos, operadores: ops, solucion };
  }
}

// --- Ejercicio 3: la última cifra de una potencia --------------------------------

export const BASES_ULTIMA = [2, 3, 4, 5, 6, 7, 8, 9];
export const CELDAS = 8;
export const EXP_MIN_ULTIMA = 9;
export const EXP_MAX_ULTIMA = 30;

/** Última cifra de base^exp (por multiplicación repetida módulo 10). */
export function ultimaCifra(base, exp) {
  let d = 1;
  for (let i = 0; i < exp; i++) d = (d * base) % 10;
  return d;
}

/** Longitud del ciclo de las últimas cifras de base^1, base^2, … */
export function ciclo(base) {
  for (let L = 1; L <= 4; L++) {
    let ok = true;
    for (let k = 1; k <= 12; k++) if (ultimaCifra(base, k) !== ultimaCifra(base, k + L)) ok = false;
    if (ok) return L;
  }
  throw new Error(`sin ciclo para ${base}`);
}

/** Cuál de las potencias del ciclo (1..L) acaba igual que base^exp. */
export function posicionEnCiclo(exp, L) {
  return exp % L === 0 ? L : exp % L;
}

/** Ítem: { tipo: 'ultima', base, exponente, tabla, ciclo, solucion }.
 *  `tabla`: las últimas cifras de base^1 … base^CELDAS. */
export function generarUltima(rng) {
  const base = rng.elegir(BASES_ULTIMA);
  const exponente = rng.entero(EXP_MIN_ULTIMA, EXP_MAX_ULTIMA);
  const tabla = Array.from({ length: CELDAS }, (_, i) => ultimaCifra(base, i + 1));
  return { tipo: 'ultima', base, exponente, tabla, ciclo: ciclo(base), solucion: ultimaCifra(base, exponente) };
}
