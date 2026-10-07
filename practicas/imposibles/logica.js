// Práctica «Detector de imposibles»: lógica pura (sin DOM ni red).
// Tres ejercicios sobre las desigualdades del m.c.d./m.c.m., la comprobación
// del producto (g · m = a · b) y nombrar la respuesta de un mini-problema.

import { mcd, mcm } from '../_comun/aritmetica.js';
import { BANCO_NOMBRAR } from './textos.js';

// ─── Ejercicio 1: ¿Puede ser? ───────────────────────────────────────────────
// Para que la respuesta sea inequívoca, un ítem en "No" siempre viola una
// desigualdad real (nunca un valor equivocado que las cumpla las dos).

const CONTEXTOS_PUEDE = { mcd: 2, mcm: 2 }; // número de plantillas de contexto por clase (ver textos.js)

function generarPuedeNumeros(rng, cantidad, rango) {
  let a = rng.entero(...rango);
  let b = rng.entero(...rango);
  while (b === a) b = rng.entero(...rango);
  const verdadero = cantidad === 'mcd' ? mcd(a, b) : mcm(a, b);
  const puede = rng.azar() < 0.5;
  if (puede) return { a, b, cantidad, verdadero, puede: true, propuesto: verdadero, violacion: null };
  if (cantidad === 'mcd') {
    if (rng.azar() < 0.3) return { a, b, cantidad, verdadero, puede: false, propuesto: 0, violacion: 'cero' };
    const minimo = Math.min(a, b);
    const propuesto = minimo + rng.entero(1, 20);
    return { a, b, cantidad, verdadero, puede: false, propuesto, violacion: 'mayor' };
  }
  const maximo = Math.max(a, b);
  const propuesto = Math.max(1, maximo - rng.entero(1, Math.min(10, maximo - 1)));
  return { a, b, cantidad, verdadero, puede: false, propuesto, violacion: 'menor' };
}

export function generarPuede(rng) {
  const cantidad = rng.elegir(['mcd', 'mcm']);
  const contexto = rng.azar() < 0.3 ? rng.entero(0, CONTEXTOS_PUEDE[cantidad] - 1) : null;
  const rango = contexto === null ? [12, 96] : [3, 20];
  const base = generarPuedeNumeros(rng, cantidad, rango);
  return { tipo: 'puede', contexto, ...base };
}

// ─── Ejercicio 2: la comprobación del producto ─────────────────────────────
// g · m = a · b con dos números (g y m etiquetados GCD y LCM, a veces uno de
// los dos está mal); con tres números la comprobación nunca vale (tipo 'tres').

function generarDos(rng) {
  let a = rng.entero(6, 48);
  let b = rng.entero(6, 48);
  while (b === a) b = rng.entero(6, 48);
  const g = mcd(a, b);
  const m = mcm(a, b);
  if (rng.azar() < 0.5) return { tipo: 'producto', a, b, g, m, cuadra: true };
  if (rng.azar() < 0.5) return { tipo: 'producto', a, b, g: g + 1, m, cuadra: false };
  return { tipo: 'producto', a, b, g, m: m + a, cuadra: false };
}

function generarTres(rng) {
  let a, b, c, g, m;
  let intentos = 0;
  do {
    a = rng.entero(3, 10);
    b = rng.entero(3, 10);
    c = rng.entero(3, 10);
    g = mcd(a, b, c);
    m = mcm(a, b, c);
    intentos++;
  } while (g * m === a * b * c && intentos < 15);
  return { tipo: 'tres', a, b, c, g, m, cuadra: false };
}

export function generarProducto(rng) {
  return rng.azar() < 0.2 ? generarTres(rng) : generarDos(rng);
}

// ─── Ejercicio 3: nómbralo ──────────────────────────────────────────────────
// Cuatro opciones como expresiones (GCD/LCM/producto); el valor de cada una
// tiene que ser distinto, o la pregunta tendría dos respuestas correctas.

export function valorExpr(fn, x, y) {
  if (fn === 'prod') return x * y;
  return fn === 'mcd' ? mcd(x, y) : mcm(x, y);
}

function claveExpr(fn, x, y) {
  return `${fn}_${x}_${y}`;
}

function opcionesNombrar(rng, clase, a, b) {
  const base = valorExpr(clase, a, b);
  const contraria = clase === 'mcm' ? 'mcd' : 'mcm';
  const correcta = { fn: clase, x: a, y: b };
  const candidatos = [
    { fn: contraria, x: a, y: b },
    { fn: 'prod', x: a, y: b },
    { fn: clase, x: a, y: base },
    { fn: contraria, x: a, y: base },
    { fn: clase, x: b, y: base },
    { fn: contraria, x: b, y: base },
  ];
  const vistos = new Set([base]);
  const distractores = [];
  for (const cand of rng.barajar(candidatos)) {
    const v = valorExpr(cand.fn, cand.x, cand.y);
    if (vistos.has(v)) continue;
    vistos.add(v);
    distractores.push(cand);
    if (distractores.length === 3) break;
  }
  if (distractores.length < 3) return null;
  const opciones = rng.barajar([correcta, ...distractores]).map(o => ({ ...o, valor: claveExpr(o.fn, o.x, o.y) }));
  const solucion = claveExpr(correcta.fn, correcta.x, correcta.y);
  return { opciones, solucion };
}

export function generarNombrar(rng) {
  for (let intento = 0; intento < 30; intento++) {
    const plantilla = rng.elegir(BANCO_NOMBRAR);
    const [a, b] = plantilla.numeros(rng);
    const res = opcionesNombrar(rng, plantilla.clase, a, b);
    if (!res) continue;
    return {
      tipo: 'nombrar',
      plantilla: BANCO_NOMBRAR.indexOf(plantilla),
      a, b,
      cantidad: plantilla.clase,
      opciones: res.opciones,
      solucion: res.solucion,
    };
  }
  throw new Error('No se pudo generar un ítem de "nombrar" sin opciones de valor repetido');
}
