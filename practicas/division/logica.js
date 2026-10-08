// División entera: cajas y resto (repaso de la unidad 1, tarea 23). Todo puro:
// los generadores devuelven DATOS y la comprobación se hace con aritmética de
// enteros, sin DOM ni red.

/** Cociente y resto de D entre d (con 0 ≤ r < d). */
export function dividir(D, d) {
  const q = Math.floor(D / d);
  return { q, r: D - q * d };
}

/** «47 : 6» en español y «47 ÷ 6» en inglés. */
export function divTxt(D, d, idioma) {
  return `${D} ${idioma === 'en' ? '÷' : ':'} ${d}`;
}

export const MAX_OBJETOS = 60;   // lo que cabe en el dibujo
export const MAX_CAJAS = 10;

// --- Ejercicio 1: reparte en cajas ---------------------------------------------

/** Ítem: { D, d, q, r }. D ≤ 60 y a lo sumo 10 cajas llenas; el 20 % de las veces, división exacta. */
export function generarCajas(rng) {
  const d = rng.entero(2, 9);
  const qMax = Math.min(MAX_CAJAS, Math.floor(MAX_OBJETOS / d));
  let q, r;
  if (rng.azar() < 0.2) { q = rng.entero(2, qMax); r = 0; }
  else {
    q = rng.entero(1, qMax);
    r = rng.entero(1, d - 1);
    if (d * q + r > MAX_OBJETOS) { q = qMax - 1; if (q < 1) q = 1; }
  }
  return { D: d * q + r, d, q, r };
}

// --- Ejercicio 2: la prueba -----------------------------------------------------

/**
 * Una comprobación escrita «izq = a · b SIGNO c»: con signo '+' vale a·b + c;
 * con signo '·', a·b·c. Es verdadera si lo que vale es igual a `izq`.
 */
export function valeLaIgualdad(op) {
  return op.izq === (op.signo === '+' ? op.a * op.b + op.c : op.a * op.b * op.c);
}

/**
 * ¿Es `op` la prueba de la división D : d? Tiene que ser «D = d · q + r» con el
 * cociente y el resto verdaderos (en este orden y con el signo +).
 */
export function esPruebaDe(op, D, d) {
  const { q, r } = dividir(D, d);
  return op.signo === '+' && op.izq === D && op.a === d && op.b === q && op.c === r;
}

/**
 * Ítem 'prueba': { tipo, D, d, q, r, opciones, solucion }. Cuatro igualdades; solo
 * la buena es «D = d · q + r». Las falsas: resto y cociente intercambiados, el
 * signo + cambiado por ·, y dividendo y divisor cruzados. Todas se comprueban
 * numéricamente (que sean falsas de verdad) antes de darlas.
 */
export function generarPrueba(rng) {
  for (;;) {
    const d = rng.entero(3, 9);
    const q = rng.entero(2, 12);
    const r = rng.entero(1, d - 1);
    const D = d * q + r;
    const buena = { izq: D, a: d, b: q, signo: '+', c: r };
    const pool = [
      { izq: D, a: d, b: r, signo: '+', c: q },   // resto y cociente intercambiados
      { izq: D, a: d, b: q, signo: '·', c: r },   // · en vez de +
      { izq: d, a: D, b: q, signo: '+', c: r },   // dividendo y divisor cruzados
      { izq: D, a: q, b: r, signo: '+', c: d },   // el divisor sumado al final
    ];
    const clave = o => `${o.izq}|${o.a}|${o.b}|${o.signo}|${o.c}`;
    const vistas = new Set([clave(buena)]);
    const falsas = pool.filter(o => {
      if (valeLaIgualdad(o) || vistas.has(clave(o))) return false;
      vistas.add(clave(o));
      return true;
    });
    if (falsas.length < 3) continue;
    const tres = rng.barajar(falsas).slice(0, 3);
    const opciones = rng.barajar([buena, ...tres]);
    return { tipo: 'prueba', D, d, q, r, opciones, solucion: opciones.findIndex(o => o === buena) };
  }
}

/** Las cuatro respuestas del ítem inverso, siempre estas y en este orden de códigos. */
export const OPCIONES_INVERSA = ['a', 'b', 'ambas', 'ninguna'];

/**
 * Para la igualdad «D = a · b + r»: de qué divisiones es la prueba. D : a lo es
 * si r < a (cociente b); D : b lo es si r < b (cociente a). Devuelve el código
 * de la respuesta buena: 'a', 'b', 'ambas' o 'ninguna'.
 */
export function respuestaInversa({ a, b, r }) {
  const valeA = r < a, valeB = r < b;
  if (valeA && valeB) return 'ambas';
  if (valeA) return 'a';
  if (valeB) return 'b';
  return 'ninguna';
}

/**
 * Ítem 'inversa': { tipo, a, b, r, D, solucion } con D = a · b + r, a ≠ b.
 * Un 40 % de «las dos», un 20 % para cada una de las otras tres respuestas.
 */
export function generarInversa(rng) {
  const objetivo = rng.elegir(['ambas', 'ambas', 'a', 'b', 'ninguna']);
  for (;;) {
    const a = rng.entero(3, 9), b = rng.entero(3, 9);
    if (a === b) continue;
    const r = objetivo === 'ambas' ? rng.entero(1, Math.min(a, b) - 1)
      : objetivo === 'ninguna' ? rng.entero(Math.max(a, b), Math.max(a, b) + 3)
      : objetivo === 'a' ? (b <= a ? rng.entero(b, a - 1) : null)
      : (a <= b ? rng.entero(a, b - 1) : null);
    if (r === null || r < 1) continue;
    const item = { tipo: 'inversa', a, b, r, D: a * b + r };
    item.solucion = respuestaInversa(item);
    if (item.solucion !== objetivo) continue;
    return item;
  }
}

/** Ejercicio 2: 60 % pruebas, 40 % inversas. */
export function generarPruebaOInversa(rng) {
  return rng.azar() < 0.6 ? generarPrueba(rng) : generarInversa(rng);
}

// --- Ejercicio 3: ¿qué significa el resto? --------------------------------------

/** Escenarios: de 'sobra' (lo que queda suelto) y de 'caja' (una caja más). */
export const ESCENARIOS = {
  sobra: ['huevos', 'lapices', 'manzanas', 'pegatinas'],
  caja: ['alumnos', 'personas', 'maletas', 'sillas'],
};

/**
 * Ítem: { escenario, clave, D, d, q, r, pide, solucion }.
 *  - pide 'llenas' → q; 'sueltos' → r  (escenarios de 'sobra')
 *  - pide 'hacen' → q si r = 0, q + 1 si no  (escenarios de 'caja')
 */
export function generarSignificado(rng) {
  const escenario = rng.azar() < 0.5 ? 'sobra' : 'caja';
  const clave = rng.elegir(ESCENARIOS[escenario]);
  const d = rng.entero(3, 9);
  const qMax = Math.min(MAX_CAJAS, Math.floor(MAX_OBJETOS / d) - 1);
  const q = rng.entero(2, qMax);
  const r = rng.azar() < 0.2 ? 0 : rng.entero(1, d - 1);
  const pide = escenario === 'caja' ? 'hacen' : rng.elegir(['llenas', 'sueltos']);
  return { escenario, clave, D: d * q + r, d, q, r, pide, solucion: solucionSignificado({ q, r, pide }) };
}

export function solucionSignificado({ q, r, pide }) {
  if (pide === 'llenas') return q;
  if (pide === 'sueltos') return r;
  return r === 0 ? q : q + 1;
}

// --- Ejercicio 4: detector ------------------------------------------------------

/** ¿Puede ser (cociente q, resto r) el resultado de dividir D entre d? */
export function puedeSer({ D, d, q, r }) {
  if (r >= d) return false;
  if (D === undefined || q === undefined) return true;
  return d * q + r === D;
}

/**
 * Ítem: { variante: 'resto' | 'division', d, r, D?, q?, solucion }.
 *  - 'resto': «Al dividir entre d ha salido resto r. ¿Puede ser?» (Sí si r < d).
 *  - 'division': «cociente q, resto r al dividir D entre d: ¿está bien?» Sí si es la
 *    verdadera; No si el resto es ≥ d (aunque d · q + r dé D) o si d · q + r ≠ D.
 */
export function generarPuede(rng) {
  if (rng.azar() < 0.4) {
    const d = rng.entero(3, 9);
    const r = rng.azar() < 0.5 ? rng.entero(0, d - 1) : rng.entero(d, 2 * d + 2);
    return { variante: 'resto', d, r, solucion: puedeSer({ d, r }) };
  }
  const d = rng.entero(3, 9);
  const real = dividir(rng.entero(12, 99), d);
  const D = d * real.q + real.r;
  const tipo = rng.elegir(['bien', 'bien', 'cociente', 'resto_grande', 'resto_otro']);
  let q = real.q, r = real.r;
  if (tipo === 'cociente') {
    q = real.q + rng.elegir([-1, 1, 2]);
  } else if (tipo === 'resto_grande') {
    // D = d · (q − 1) + (r + d): la igualdad se cumple, pero el resto no es menor que d.
    if (real.q < 2) return generarPuede(rng);
    q = real.q - 1; r = real.r + d;
  } else if (tipo === 'resto_otro') {
    r = (real.r + rng.entero(1, d - 1)) % d;
  }
  if (q < 0) return generarPuede(rng);
  return { variante: 'division', D, d, q, r, solucion: puedeSer({ D, d, q, r }) };
}
