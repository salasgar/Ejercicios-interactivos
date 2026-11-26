// Práctica «Razones y proporciones» (PU2, tarea 212, unidad 7, sesión 1): generadores y comprobaciones PUROS,
// con enteros (las comparaciones, por productos cruzados). La interfaz está en practica.js y los textos en
// textos.js; las pruebas, en tests/practicas-razones.test.js.

import { mcd } from '../_comun/aritmetica.js';
import { huellaCaso, leerCantidad } from '../_comun/proporcion.js';
import { HUELLAS_RESERVADAS } from './reserva.js';

// ─── Utilidades ────────────────────────────────────────────────────────────────

export const iguales = (a, b, c, d) => a * d === b * c;
export const sonCoprimos = (a, b) => mcd(a, b) === 1;

/** Parejas (p, q) de 1 a 9, distintas y sin divisor común. */
export const PAREJAS = (() => {
  const l = [];
  for (let p = 1; p <= 9; p++) for (let q = 1; q <= 9; q++) if (p !== q && sonCoprimos(p, q)) l.push([p, q]);
  return Object.freeze(l);
})();

const unica = (rng, lista, valida) => {
  for (let i = 0; i < 5000; i++) { const x = rng.elegir(lista); if (valida(x)) return x; }
  throw new Error('razones: sin datos válidos');
};

/** La opción como dato: { num, den, error } (error null en la correcta). */
const opcion = (num, den, error = null) => ({ num, den, error });
const todasDistintas = ops => ops.every((o, i) => ops.every((q, j) => i === j || !iguales(o.num, o.den, q.num, q.den)));

// ─── Ejercicio 1: la razón ─────────────────────────────────────────────────────

/** Los contextos de «por cada»: sin cota propia (los dos números son de 2 a 9, nunca 1 para que «hay 1… por cada…» no choque con el plural: son proporciones de una receta, una bolsa…). */
export const IDS_RAZON = Object.freeze(['clase', 'limonada', 'bolsa', 'partidos', 'frutero', 'refugio']);

function crearRazon(rng) {
  for (let i = 0; i < 200; i++) {
    const [a, b] = rng.elegir(PAREJAS);
    if (a === 1 || b === 1) continue;
    const ctx = rng.elegir(IDS_RAZON);
    const sujeto = rng.azar() < 0.5 ? 0 : 1;
    const pregunta = rng.azar() < 0.5 ? 'parte-parte' : 'parte-todo';
    const [x, y] = sujeto === 0 ? [a, b] : [b, a];   // x: el grupo por el que se pregunta; y: el otro
    const total = x + y;
    const opciones = pregunta === 'parte-parte'
      ? [opcion(x, y), opcion(y, x, 'invertir-razon'), opcion(x, total, 'parte-parte-como-parte-todo'), opcion(y, total, 'otra-parte-sobre-el-total')]
      : [opcion(x, total), opcion(x, y, 'parte-todo-como-parte-parte'), opcion(y, total, 'otra-parte-sobre-el-total'), opcion(total, x, 'invertir-razon')];
    if (!todasDistintas(opciones)) continue;
    return { ctx, a, b, sujeto, pregunta, opciones: rng.barajar(opciones) };
  }
  throw new Error('razones: sin ítem de razón');
}

export const claveRazon = it => `r|${it.ctx}|${it.a}|${it.b}|${it.sujeto}|${it.pregunta}`;
export const buenaRazon = it => it.opciones.find(o => o.error === null);
export const textoOpcion = o => `${o.num}/${o.den}`;
export const errorRazon = (it, elegida) => it.opciones.find(o => textoOpcion(o) === elegida)?.error ?? null;
/** Los números del ítem: el grupo por el que se pregunta, el otro y el total. */
export const gruposRazon = it => { const [x, y] = it.sujeto === 0 ? [it.a, it.b] : [it.b, it.a]; return { x, y, total: x + y }; };

// ─── Ejercicio 2: equivalentes y la más sencilla ───────────────────────────────

/**
 * Los contextos de «la razón más sencilla»: cota por término ([mín, máx]) creíble en ese contexto
 * (el test comprueba cada ítem contra ella). 18 chicos y 12 chicas; 150 g de azúcar por cada 250 g de harina.
 */
export const CONTEXTOS_SENCILLA = Object.freeze({
  clase: { min: 4, max: 30 },
  azucar: { min: 50, max: 300 },
  bolsa: { min: 4, max: 60 },
  zumo: { min: 50, max: 300 },
  concierto: { min: 20, max: 300 },
  biblioteca: { min: 20, max: 300 },
});
const IDS_SENCILLA = Object.keys(CONTEXTOS_SENCILLA);
export const MAX_TERMINO_SENCILLA = 300;

function crearEquivalentes(rng) {
  return rng.azar() < 0.5 ? generarElegir(rng) : generarSencilla(rng);
}

function generarElegir(rng) {
  for (let i = 0; i < 500; i++) {
    const [p, q] = rng.elegir(PAREJAS);
    if (q === 1) continue;
    const k = rng.entero(2, 9);
    const m = rng.entero(1, 5);
    const k2 = rng.entero(2, 9);
    const opciones = [
      opcion(p * k, q * k),
      opcion(p + m, q + m, 'suma-mismo-numero'),
      rng.azar() < 0.5 ? opcion(p * k2, q, 'amplia-un-termino') : opcion(p, q * k2, 'amplia-un-termino'),
      opcion(q * k, p * k, 'razon-invertida'),
    ];
    if (!todasDistintas(opciones)) continue;
    return { tipo: 'elegir', p, q, k, opciones: rng.barajar(opciones) };
  }
  throw new Error('razones: sin ítem de equivalentes');
}

function generarSencilla(rng) {
  for (let i = 0; i < 5000; i++) {
    const [p, q] = rng.elegir(PAREJAS);
    const k = rng.entero(2, 50);
    const ctx = rng.elegir(IDS_SENCILLA);
    const c = CONTEXTOS_SENCILLA[ctx];
    const a = p * k, b = q * k;
    if (a > MAX_TERMINO_SENCILLA || b > MAX_TERMINO_SENCILLA) continue;
    if (a < c.min || a > c.max || b < c.min || b > c.max) continue;
    return { tipo: 'escribir', ctx, p, q, k };
  }
  throw new Error('razones: sin ítem de razón más sencilla');
}

export const claveEquivalentes = it => (it.tipo === 'elegir' ? `e|${it.p}|${it.q}|${it.k}|${it.opciones.map(textoOpcion).sort().join(',')}` : `s|${it.ctx}|${it.p}|${it.q}|${it.k}`);
export const errorEquivalentes = (it, elegida) => it.opciones.find(o => textoOpcion(o) === elegida)?.error ?? null;

/** (b): lo que escribe el alumno (dos naturales) frente a la irreducible. null = acierto, o el id del error. */
export function errorSencilla(it, num, den) {
  if (num === it.p && den === it.q) return null;
  if (num > 0 && den > 0 && iguales(num, den, it.p, it.q)) return 'sin-simplificar-del-todo';
  if (num > 0 && den > 0 && iguales(num, den, it.q, it.p)) return 'razon-invertida';
  return 'razon-distinta';
}

// ─── Ejercicio 3: ¿forman proporción? ──────────────────────────────────────────

export const MAX_TERMINO_PROPORCION = 60;

/** ¿Hace falta la cuenta? Ningún término es múltiplo (ni divisor) del que tiene al lado. */
export const hacenFaltaCuentas = it => {
  const mult = (x, y) => x % y === 0 || y % x === 0;
  return !mult(it.a, it.c) && !mult(it.b, it.d);
};

function crearProporcion(rng) {
  const si = rng.azar() < 0.5;
  const dificil = rng.azar() < 0.6;
  for (let i = 0; i < 5000; i++) {
    const [p, q] = rng.elegir(PAREJAS);
    const maxK = Math.floor(MAX_TERMINO_PROPORCION / Math.max(p, q));
    if (maxK < 2) continue;
    const k1 = rng.entero(1, maxK), k2 = rng.entero(1, maxK);
    if (k1 === k2) continue;
    let [a, b, c, d] = [p * k1, q * k1, p * k2, q * k2];
    let error = null;
    if (!si) {
      if (rng.azar() < 0.5) {
        const m = rng.entero(1, 6);
        [c, d] = [a + m, b + m];
        error = 'suma-mismo-numero';
        if (a + m > MAX_TERMINO_PROPORCION || b + m > MAX_TERMINO_PROPORCION) continue;
      } else {
        const delta = rng.azar() < 0.5 ? 1 : -1;
        const cual = rng.entero(0, 3);
        const t = [a, b, c, d];
        t[cual] += delta;
        [a, b, c, d] = t;
        error = 'termino-desviado';
      }
      if (a < 1 || b < 1 || c < 1 || d < 1 || Math.max(a, b, c, d) > MAX_TERMINO_PROPORCION) continue;
      if (iguales(a, b, c, d) || iguales(a, b, d, c)) continue;
    }
    if (rng.azar() < 0.5) [a, b, c, d] = [c, d, a, b];
    const it = { a, b, c, d, si, error };
    if (si && hacenFaltaCuentas(it) !== dificil) continue;
    return it;
  }
  throw new Error('razones: sin ítem de proporción');
}

export const claveProporcion = it => `p|${it.a}|${it.b}|${it.c}|${it.d}`;
export const sonProporcionEnteros = it => iguales(it.a, it.b, it.c, it.d);
/** El error de quien se equivoca: dijo «sí» a un no (el que lo fabricó) o «no» a un sí. */
export const errorProporcion = (it, dijoSi) => (dijoSi === it.si ? null : (it.si ? 'dice-no-siendo-proporcion' : it.error));

// ─── Ejercicio 4: el término que falta ─────────────────────────────────────────

export const MAX_SOLUCION = 100;

function crearTermino(rng) {
  const dificil = rng.azar() < 0.4;
  const abajo = rng.azar() < 1 / 3;
  for (let i = 0; i < 5000; i++) {
    const [p, q] = rng.elegir(PAREJAS);
    if (q === 1) continue;
    const k1 = rng.entero(1, 8), k2 = rng.entero(1, 12);
    if (k1 === k2) continue;
    const nadaMultiplo = k1 % k2 !== 0 && k2 % k1 !== 0;
    if (nadaMultiplo !== dificil) continue;
    const a = p * k1, b = q * k1;
    const d = (abajo ? p : q) * k2, x = (abajo ? q : p) * k2;
    if (x > MAX_SOLUCION || d > MAX_SOLUCION || a > MAX_SOLUCION || b > MAX_SOLUCION) continue;
    return { a, b, d, x, abajo, lado: rng.azar() < 0.5 ? 'derecha' : 'izquierda' };
  }
  throw new Error('razones: sin ítem de término que falta');
}

export const claveTermino = it => `t|${it.a}|${it.b}|${it.d}|${it.lado}|${it.abajo ? 'abajo' : 'arriba'}`;
/** Los productos cruzados como u · v = w · x: con la x arriba (a/b = x/d), a · d = b · x; con la x abajo (a/b = d/x), b · d = a · x. */
export const cruz = it => (it.abajo ? { u: it.b, v: it.d, w: it.a } : { u: it.a, v: it.d, w: it.b });
export const factorDe = it => it.d / cruz(it).w;

/** La x que cuadra, por productos cruzados (w · x = u · v). */
export const terminoQueFalta = it => { const { u, v, w } = cruz(it); return (u * v) / w; };

/** null = acierto (por valor); si no, el error con nombre o 'otro-numero'. `valor` es un Fraccion o null. */
export function errorTermino(it, valor) {
  const f = valor;
  if (f && f.num * 1 === it.x * f.den) return null;
  const igual = v => f !== null && f.num === v * f.den;
  const { w } = cruz(it);
  const mantieneDiferencia = it.abajo ? it.d + it.b - it.a : it.d - (it.b - it.a);
  if (igual(mantieneDiferencia) && mantieneDiferencia !== it.x) return 'suma-en-vez-de-multiplicar';
  if (it.d % w === 0 && igual(factorDe(it)) && factorDe(it) !== it.x) return 'da-el-factor';
  return 'otro-numero';
}

/** Lo escrito a mano → Fraccion exacta, o null si no se entiende (15, 15,0, 30/2). */
export function leerRespuesta(texto, idioma = 'es') {
  const r = leerCantidad(String(texto ?? ''), { idioma });
  return r.ok && !r.valor.unidad ? r.valor.valor : null;
}

// ─── Casos reservados ──────────────────────────────────────────────────────────

/** Huella FNV-1a del caso normalizado por valor (la hoja y el examen de la unidad, cuando existan, solo por huella). */
export function huellaDe(it) {
  if (it.a !== undefined && it.x !== undefined) return huellaCaso('proporcion', it.abajo ? [it.b, it.a, null, it.d] : [it.a, it.b, null, it.d]);
  if (it.a !== undefined && it.c !== undefined) return huellaCaso('proporcion', [it.a, it.b, it.c, it.d]);
  if (it.tipo === 'escribir') return huellaCaso('razon', [it.p * it.k, it.q * it.k]);
  if (it.tipo === 'elegir') return huellaCaso('equivalente', [it.p, it.q]);
  if (it.pregunta) { const { x, y } = gruposRazon(it); return huellaCaso(it.pregunta === 'parte-parte' ? 'razon-parte-parte' : 'razon-parte-todo', [x, y]); }
  return null;
}
/** Los dos modos de escribir el mismo caso del ejercicio 4 (A/B = x/D y D/B = x/A: la x tiene el mismo coeficiente B); en los demás, la huella de siempre. */
export function huellasDe(it) {
  if (it.a !== undefined && it.x !== undefined) {
    const { u, v, w } = cruz(it);
    return [huellaCaso('proporcion', [u, w, null, v]), huellaCaso('proporcion', [v, w, null, u])];
  }
  const h = huellaDe(it);
  return h === null ? [] : [h];
}
export const esReservado = it => huellasDe(it).some(h => HUELLAS_RESERVADAS.has(h));

const sinReservados = crear => rng => {
  for (let i = 0; i < 50; i++) { const it = crear(rng); if (!esReservado(it)) return it; }
  throw new Error('razones: todo reservado');
};
export const generarRazon = sinReservados(crearRazon);
export const generarEquivalentes = sinReservados(crearEquivalentes);
export const generarProporcion = sinReservados(crearProporcion);
export const generarTermino = sinReservados(crearTermino);
