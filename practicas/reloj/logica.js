// Reloj de coincidencias: generadores y comprobaciones, puros (sin DOM ni red).
//
// Ítem: { tipo: 'linea' | 'hora' | 'tres' | 'multiplo', periodos: [...], solucion,
//         inicio: { h, m } | null, horaSolucion: { h, m } | null,
//         errorTipico: { h, m } | null }

import { mcm, factorizar, mcmFact, htmlFact } from '../_comun/aritmetica.js';
import { TX, horaTexto } from './textos.js';

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
// Atracciones de feria: cada periodo entre 3 y 20 minutos (un viaje con su subida y su bajada) y la
// coincidencia dentro de una tarde de feria (m.c.m. ≤ 120 min; los tríos, de datos pequeños, ≤ 60).
export const PERIODO_MIN = 3, PERIODO_MAX = 20, MCM_MAX_FERIA = 120, MCM_MAX_TRIOS = 60;

export const TRIOS = [];
for (let a = PERIODO_MIN; a <= PERIODO_MAX; a++) {
  for (let b = a + 1; b <= PERIODO_MAX; b++) {
    for (let c = b + 1; c <= PERIODO_MAX; c++) {
      const m = mcm(a, b, c);
      if (m <= MCM_MAX_TRIOS) TRIOS.push([a, b, c, m]);
    }
  }
}

export const MULTIPLOS = [];
for (let d = PERIODO_MIN; d <= PERIODO_MAX; d++) {
  for (let k = 2; k <= 5; k++) {
    const producto = d * k;
    if (producto <= PERIODO_MAX) MULTIPLOS.push([d, producto]);
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

// «No lo sé»: cómo se resuelve este ítem, con sus números, y la solución al final (revisión 193: qué se pide,
// el m.c.m. con el método de los apuntes, las cuentas con sus unidades y la frase de respuesta).

const pasosAyuda = lista => `<ol class="pasos-ayuda">${lista.map(p => `<li>${p}</li>`).join('')}</ol>`;
const enLista = (cosas, idioma) => `${cosas.slice(0, -1).join(', ')} ${TX.ayuda.y[idioma]} ${cosas.at(-1)}`;

/** Ejercicio 1: datos pequeños, así que listas de múltiplos hasta el primero común. */
export function explicaLinea(item, idioma) {
  const x = TX.linea, y = TX.ayuda;
  const [a, b] = item.periodos;
  return `<p>${y.pide_linea(a, b)[idioma]}</p>`
    + pasosAyuda([
      y.lista_luz(x.azul, a, multiplosHasta(a, item.solucion))[idioma],
      y.lista_luz(x.naranja, b, multiplosHasta(b, item.solucion))[idioma],
      y.primero_comun(a, b, item.solucion)[idioma],
    ])
    + `<p>${y.fin_linea(item.solucion)[idioma]}</p>`;
}

/**
 * Las sumas de la hora, de hora en hora y sin pasar de 60 minutos de golpe: 21:30 + 40 min se hace
 * 21:30 + 30 min = 22:00 y 22:00 + 10 min = 22:10 (el error típico es sumar los minutos hasta 100).
 */
export function cuentasHora(inicio, horas, minutos) {
  const t = x => horaTexto(x.h, x.m);
  const cuentas = [];
  let actual = inicio;
  if (horas > 0) {
    const siguiente = sumarMinutos(actual.h, actual.m, horas * 60);
    cuentas.push(`${t(actual)} + ${horas} h = ${t(siguiente)}`);
    actual = siguiente;
  }
  if (minutos > 0) {
    const hastaEnPunto = 60 - actual.m;
    if (minutos > hastaEnPunto) {
      const enPunto = sumarMinutos(actual.h, actual.m, hastaEnPunto);
      cuentas.push(`${t(actual)} + ${hastaEnPunto} min = ${t(enPunto)}`);
      cuentas.push(`${t(enPunto)} + ${minutos - hastaEnPunto} min = ${t(sumarMinutos(enPunto.h, enPunto.m, minutos - hastaEnPunto))}`);
    } else {
      cuentas.push(`${t(actual)} + ${minutos} min = ${t(sumarMinutos(actual.h, actual.m, minutos))}`);
    }
  }
  return cuentas.map(c => `<span class="cuenta">${c}</span>`).join('; ');
}

/** Ejercicio 2: datos de dos cifras, así que el m.c.m. por factorización; después, a horas y a la hora de reloj. */
export function explicaHora(item, idioma) {
  const y = TX.ayuda;
  const [a, b] = item.periodos;
  const fa = factorizar(a), fb = factorizar(b);
  const horas = Math.floor(item.solucion / 60), minutos = item.solucion % 60;
  const pasos = [
    y.descompon(a, b, htmlFact(fa), htmlFact(fb))[idioma],
    y.mcm_fact(a, b, htmlFact(mcmFact(fa, fb)), item.solucion)[idioma],
  ];
  if (horas > 0) pasos.push(y.a_horas(item.solucion, horas, minutos)[idioma]);
  pasos.push(y.suma(cuentasHora(item.inicio, horas, minutos))[idioma]);
  return `<p>${y.pide_hora(a, b, horaTexto(item.inicio.h, item.inicio.m))[idioma]}</p>${pasosAyuda(pasos)}`
    + `<p>${y.fin_hora(horaTexto(item.horaSolucion.h, item.horaSolucion.m))[idioma]}</p>`;
}

/** Ejercicio 3: datos pequeños (listas de múltiplos del mayor) o uno múltiplo del otro (a simple vista). */
export function explicaTres(item, idioma) {
  const x = TX.tres, y = TX.ayuda;
  const tres = item.tipo === 'tres';
  const datos = [...item.periodos].sort((p, q) => p - q);
  const pide = `<p>${y.pide_dias(enLista(datos, idioma), tres)[idioma]}</p>`;
  const fin = `<p>${y.fin_dias(item.solucion, tres)[idioma]}</p>`;
  if (tres) {
    const [p1, p2, p3] = item.periodos;
    return `${pide}<p>${x.cuenta_tres(p1, p2, p3, multiplosHasta(p3, item.solucion), item.solucion)[idioma]}</p>${fin}`;
  }
  return `${pide}<p>${y.multiplo(datos[0], datos[1])[idioma]}</p>${fin}`;
}
