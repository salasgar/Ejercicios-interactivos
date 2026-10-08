// Reloj de coincidencias: generadores y comprobaciones, puros (sin DOM ni red).
//
// Ítem: { tipo: 'linea' | 'hora' | 'tres' | 'multiplo', periodos: [...], solucion,
//         inicio: { h, m } | null, horaSolucion: { h, m } | null,
//         errorTipico: { h, m } | null }

import { mcm } from '../_comun/aritmetica.js';

// ─── Ejercicio 1: predecir la coincidencia en la línea de tiempo (0-60) ───────
// Pares (a, b) con 2 ≤ a < b ≤ 12 y m.c.m. ≤ 60 (cabe en la línea 0-60).
const PARES_LINEA = [];
for (let a = 2; a <= 11; a++) {
  for (let b = a + 1; b <= 12; b++) {
    const m = mcm(a, b);
    if (m <= 60) PARES_LINEA.push([a, b, m]);
  }
}

export function generarLinea(rng) {
  const [a, b, solucion] = rng.elegir(PARES_LINEA);
  return { tipo: 'linea', periodos: [a, b], solucion, inicio: null, horaSolucion: null, errorTipico: null };
}

export function comprobarLinea(item, segundo) {
  return segundo === item.solucion;
}

// ─── Ejercicio 2: la hora de reloj ────────────────────────────────────────────
// Pares (a, b) de dos cifras con m.c.m. entre 40 y 180 minutos.
const PARES_HORA = [];
for (let a = 10; a <= 40; a++) {
  for (let b = a + 1; b <= 45; b++) {
    const m = mcm(a, b);
    if (m >= 40 && m <= 180) PARES_HORA.push([a, b, m]);
  }
}

/** Suma minutos a una hora h:m (24 h), con acarreo correcto (mod 24 h). */
export function sumarMinutos(h, m, incremento) {
  const totalDia = 24 * 60;
  const total = (((h * 60 + m + incremento) % totalDia) + totalDia) % totalDia;
  return { h: Math.floor(total / 60), m: total % 60 };
}

/** El error típico: tratar los minutos como si llegaran a 100, no a 60. */
function errorMod100(h, m, incremento) {
  const totalFalso = m + incremento;
  const hFalso = ((h + Math.floor(totalFalso / 100)) % 24 + 24) % 24;
  return { h: hFalso, m: totalFalso % 100 };
}

export function generarHora(rng) {
  const [a, b, solucion] = rng.elegir(PARES_HORA);
  // Hora inicial entre las 6 y las 20 h: con m.c.m. ≤ 180 min (3 h) nunca pasa
  // de medianoche, así que no hace falta volver a generar.
  const h = rng.entero(6, 20);
  const m = rng.entero(0, 11) * 5;
  const horaSolucion = sumarMinutos(h, m, solucion);
  const falso = errorMod100(h, m, solucion);
  const errorTipico = (falso.h === horaSolucion.h && falso.m === horaSolucion.m) ? null : falso;
  return { tipo: 'hora', periodos: [a, b], solucion, inicio: { h, m }, horaSolucion, errorTipico };
}

export function comprobarHora(item, h, m) {
  return h === item.horaSolucion.h && m === item.horaSolucion.m;
}

// Los minutos se marcan con dos contadores (decenas 0-5 y unidades 0-9), así que
// cualquier minuto de 0 a 59 se puede marcar con unos pocos toques.
export const MAX_DECENAS = 5;
export const MAX_UNIDADES = 9;

export function minutosEnContadores(m) {
  return { decenas: Math.floor(m / 10), unidades: m % 10 };
}

export function minutosDeContadores(decenas, unidades) {
  return decenas * 10 + unidades;
}

/** Múltiplos de `periodo` hasta `limite`: [periodo, 2·periodo, …]. */
export function multiplosHasta(periodo, limite) {
  const lista = [];
  for (let n = periodo; n <= limite; n += periodo) lista.push(n);
  return lista;
}

// ─── Ejercicio 3: tres datos pequeños, o uno múltiplo del otro ───────────────
const TRIOS = [];
for (let a = 2; a <= 8; a++) {
  for (let b = a + 1; b <= 9; b++) {
    for (let c = b + 1; c <= 12; c++) {
      const m = mcm(a, b, c);
      if (m <= 60) TRIOS.push([a, b, c, m]);
    }
  }
}

const MULTIPLOS = [];
for (let d = 2; d <= 15; d++) {
  for (let k = 2; k <= 5; k++) {
    const producto = d * k;
    if (producto <= 80) MULTIPLOS.push([d, producto]);
  }
}

export function generarTres(rng) {
  const [a, b, c, solucion] = rng.elegir(TRIOS);
  return { tipo: 'tres', periodos: [a, b, c], solucion, inicio: null, horaSolucion: null, errorTipico: null };
}

export function generarMultiplo(rng) {
  const [d, mayor] = rng.elegir(MULTIPLOS);
  const periodos = rng.azar() < 0.5 ? [d, mayor] : [mayor, d];
  return { tipo: 'multiplo', periodos, solucion: mayor, inicio: null, horaSolucion: null, errorTipico: null };
}

/** Mitad de las veces tres periodos pequeños, la otra mitad uno múltiplo del otro. */
export function generarTresOMultiplo(rng) {
  return rng.azar() < 0.5 ? generarTres(rng) : generarMultiplo(rng);
}

export function comprobarTresOMultiplo(item, respuesta) {
  return respuesta === item.solucion;
}
