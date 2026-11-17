// Tabla de propiedades (reto de la unidad 2, tarea 206): lógica. Todo puro (sin DOM
// ni red), para probarlo con `npm test`.
//
// Hay unas ETIQUETAS (propiedades de los números: «Primo», «Par», «Divisor de 60»…)
// y unos NÚMEROS del 1 al 100. El alumno forma una tabla de doble entrada: las
// etiquetas, en las cabeceras de las filas y de las columnas; cada número, en una
// casilla cuyas DOS propiedades cumpla (la de su fila y la de su columna).
// Hay muchas soluciones a propósito: se corrige por propiedades, nunca contra una
// clave. El generador, eso sí, garantiza que hay al menos una.
//
// Ítem: { nivel, nF, nC, fijas, puntos, etiquetas: [id…], numeros: [n…],
//         diseno: { filas: [id…], cols: [id…], celdas: [[n…]…] } }
// `diseno` es la tabla con la que se generó (una de las soluciones); en el nivel 1
// (`fijas`) sus cabeceras son las que se ven ya puestas. `etiquetas` y `numeros` son
// las piezas, barajadas, tal como salen en la bandeja.
// Colocación del alumno: { filas: [id|null…], cols: [id|null…], celdas: [[n|null…]…] }.

import { TX, ENTRE } from './textos.js';

export const MAXIMO = 100;
const RANGO = Array.from({ length: MAXIMO }, (_, i) => i + 1);

/** Los puntos que da cada nivel al completar su tabla: 1 por número y 1 por etiqueta colocados. */
export const NIVELES = [
  { nivel: 1, nF: 2, nC: 3, fijas: true, puntos: 6 },
  { nivel: 2, nF: 2, nC: 4, fijas: false, puntos: 14 },
  { nivel: 3, nF: 3, nC: 3, fijas: false, puntos: 15 },
  { nivel: 4, nF: 4, nC: 3, fijas: false, puntos: 19 },
];
/** Puntos del ejercicio entero (= `objetivo`): 6 + 14 + 15 + 19. */
export const OBJETIVO = NIVELES.reduce((s, n) => s + n.puntos, 0);

/** El nivel en que está el alumno, deducido de sus puntos (0 → 6 → 20 → 35 → 54). */
export function nivelDePuntos(puntos) {
  let acumulado = 0;
  for (const n of NIVELES) {
    acumulado += n.puntos;
    if (puntos < acumulado) return n.nivel;
  }
  return NIVELES.length;
}

// --- Las propiedades -----------------------------------------------------------

export const divisoresDe = n => RANGO.filter(d => d <= n && n % d === 0);
const cuadradoPerfecto = n => { const k = Math.round(Math.sqrt(n)); return k * k === n; };
/** Los triangulares hasta 100: 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78 y 91. */
export const TRIANGULARES = (() => { const t = []; for (let k = 1, s = 1; s <= MAXIMO; s += ++k) t.push(s); return t; })();

/** Cada familia: dificultad, parámetros posibles y la propiedad. */
const FAMILIAS = {
  par: { f: n => n % 2 === 0 },
  impar: { f: n => n % 2 === 1 },
  mayor: { f: (n, p) => n > p },
  menor: { f: (n, p) => n < p },
  multiplo: { f: (n, p) => n % p === 0 },
  primo: { f: n => n > 1 && divisoresDe(n).length === 2 },
  compuesto: { f: n => divisoresDe(n).length > 2 },
  cuadrado: { f: cuadradoPerfecto },
  divisor: { f: (n, p) => p % n === 0 },
  ndivisores: { f: (n, p) => divisoresDe(n).length === p },
  triangular: { f: n => TRIANGULARES.includes(n) },
};
/** Cuántas etiquetas de la misma familia caben como máximo en una tabla. */
const TOPE_FAMILIA = { multiplo: 2, mayor: 2, menor: 2 };

const LISTA = [
  ['facil', 'par'], ['facil', 'impar'],
  ...[20, 30, 40, 50, 60, 70, 80].flatMap(p => [['facil', 'mayor', p], ['facil', 'menor', p]]),
  ['facil', 'multiplo', 5], ['facil', 'multiplo', 10],
  ['media', 'primo'], ['media', 'compuesto'], ['media', 'cuadrado'],
  ...[3, 4, 6, 9].map(p => ['media', 'multiplo', p]),
  ['dificil', 'multiplo', 7], ['dificil', 'multiplo', 11],
  ...[24, 36, 48, 60, 72, 90, 100].map(p => ['dificil', 'divisor', p]),
  ...[3, 4, 6].map(p => ['dificil', 'ndivisores', p]),
  ['dificil', 'triangular'],
];

/** Todas las etiquetas: { id, familia, p, dificultad, tiene: [bool × 101] } (tiene[n] = n cumple la propiedad). */
export const ETIQUETAS = LISTA.map(([dificultad, familia, p]) => {
  const tiene = [false, ...RANGO.map(n => FAMILIAS[familia].f(n, p))];
  return { id: p === undefined ? familia : `${familia}:${p}`, familia, p, dificultad, tiene };
});
const POR_ID = new Map(ETIQUETAS.map(e => [e.id, e]));
export const etiquetaPorId = id => POR_ID.get(id);
/** ¿Cumple el número `n` la propiedad de la etiqueta `id`? */
export const cumple = (id, n) => etiquetaPorId(id).tiene[n] === true;
/** El nombre de la etiqueta tal como se ve, en ese idioma («Divisor de 60»). */
export const nombreEtiqueta = (id, idioma) => { const e = etiquetaPorId(id); return TX.etiquetas[e.familia][idioma](e.p); };

// --- Por qué un número no encaja: el feedback, con los números del ítem ----------

const lista = (xs, idioma) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ${TX.y[idioma]} ${xs.at(-1)}`);

/** La frase de por qué `n` NO cumple la propiedad de `id` (texto plano). Solo vale si no la cumple. */
export function razon(id, n, idioma) {
  const { familia, p } = etiquetaPorId(id);
  const nombre = nombreEtiqueta(id, idioma).toLowerCase();
  const x = TX.razones[familia];
  switch (familia) {
    case 'par': case 'impar': return x[idioma](n, n % 10);
    case 'mayor': case 'menor': return x[idioma](n, p, n === p);
    case 'multiplo': return x[idioma](n, p, Math.floor(n / p), n % p, ENTRE[idioma]);
    case 'primo': {
      if (n === 1) return TX.razones.uno[idioma](n);
      const d = divisoresDe(n)[1];
      return x[idioma](n, d, n / d);
    }
    case 'compuesto': return n === 1 ? TX.razones.uno[idioma](n) : x[idioma](n);
    case 'cuadrado': { const k = Math.floor(Math.sqrt(n)); return x[idioma](n, k, k * k, k + 1, (k + 1) ** 2); }
    case 'divisor': return x[idioma](n, p, ENTRE[idioma]);
    case 'ndivisores': { const d = divisoresDe(n); return x[idioma](n, p, d.length, lista(d, idioma)); }
    case 'triangular': return x[idioma](n, lista(TRIANGULARES, idioma));
    default: return `${n} ${nombre}`;
  }
}

// --- El corrector: por propiedades, nunca contra una clave -----------------------

/**
 * Corrige una colocación COMPLETA. Devuelve { ok, malos } con `malos` = lista de
 * { f, c, n, etiqueta, lado: 'fila' | 'col' }: un número que no cumple una de las dos
 * propiedades de su casilla (si no cumple las dos, sale dos veces). Las etiquetas
 * pueden estar en cualquier cabecera y en cualquier orden.
 */
export function corregir(item, { filas, cols, celdas }) {
  const malos = [];
  for (let f = 0; f < item.nF; f++) {
    for (let c = 0; c < item.nC; c++) {
      const n = celdas[f][c];
      if (!cumple(filas[f], n)) malos.push({ f, c, n, etiqueta: filas[f], lado: 'fila' });
      if (!cumple(cols[c], n)) malos.push({ f, c, n, etiqueta: cols[c], lado: 'col' });
    }
  }
  return { ok: malos.length === 0, malos };
}

/** ¿Está la colocación entera (todas las cabeceras y casillas con pieza)? */
export const estaCompleta = ({ filas, cols, celdas }) =>
  filas.every(x => x !== null) && cols.every(x => x !== null) && celdas.every(r => r.every(x => x !== null));

// --- El generador ----------------------------------------------------------------

/** Cada casilla tiene al menos tantos candidatos como esto: así no sale siempre el mismo número. */
const MIN_CANDIDATOS = 4;
const INTENTOS = 600;
const PROB_TRIANGULAR = 0.25;

const intersecciones = (a, b) => RANGO.filter(n => a.tiene[n] && b.tiene[n]);

/**
 * Cuántas etiquetas del banco cumple cada número. Los «muy cumplidores» (36, 81, 60…) caben en casi
 * cualquier casilla y saldrían en la mitad de las tablas: al repartir se les da menos peso.
 */
const POPULARIDAD = [0, ...RANGO.map(n => ETIQUETAS.filter(e => e.tiene[n]).length)];
const EXPONENTE_POPULARIDAD = 3;

/** Orden al azar de `candidatos`, con más suerte para los menos populares (clave u^(1/peso), Efraimidis-Spirakis). */
function ordenPonderado(candidatos, rng) {
  return candidatos
    .map(n => [rng.azar() ** (POPULARIDAD[n] ** EXPONENTE_POPULARIDAD), n])
    .sort((a, b) => b[0] - a[0])
    .map(([, n]) => n);
}

/** Emparejamiento (Kuhn) casillas → números distintos, con el azar de `rng`. Devuelve los números o null. */
function repartirNumeros(candidatos, rng) {
  const dueno = new Map();   // número → casilla
  const orden = candidatos.map((c, i) => [i, ordenPonderado(c, rng)]);
  const intentar = (i, vistos) => {
    for (const n of orden[i][1]) {
      if (vistos.has(n)) continue;
      vistos.add(n);
      if (!dueno.has(n) || intentar(dueno.get(n), vistos)) { dueno.set(n, i); return true; }
    }
    return false;
  };
  for (const i of rng.barajar(orden.map(([k]) => k))) if (!intentar(i, new Set())) return null;
  const numeros = new Array(candidatos.length);
  for (const [n, i] of dueno) numeros[i] = n;
  return numeros;
}

const EXTENSION = e => RANGO.filter(n => e.tiene[n]).length;
/** Las etiquetas con pocos números (cuadrado perfecto: 10) salen menos: cada tabla les pide 2-4 de esos pocos, y se repetirían. */
const peso1 = e => Math.min(1, EXTENSION(e) / 40) ** 2;

/** Elige las etiquetas del nivel: cuántas de cada dificultad y como mucho `TOPE_FAMILIA` por familia. */
function elegirEtiquetas(rng, nivel) {
  const cuantas = { facil: 0, media: 0, dificil: 0 };
  if (nivel === 1) cuantas.facil = 5;
  else if (nivel === 2) { cuantas.media = rng.entero(2, 3); cuantas.facil = 6 - cuantas.media; }
  else if (nivel === 3) { cuantas.media = rng.entero(3, 4); cuantas.facil = 6 - cuantas.media; }
  else { cuantas.dificil = rng.entero(2, 3); cuantas.media = 2; cuantas.facil = 7 - cuantas.dificil - 2; }
  const elegidas = [];
  const cuentaFamilia = {};
  const poner = e => { elegidas.push(e); cuentaFamilia[e.familia] = (cuentaFamilia[e.familia] ?? 0) + 1; cuantas[e.dificultad]--; };
  // El «triangular» sale en el nivel 4 en algo menos de la mitad de las tablas.
  if (nivel === 4 && rng.azar() < PROB_TRIANGULAR) poner(etiquetaPorId('triangular'));
  for (const dif of ['dificil', 'media', 'facil']) {
    const pool = ETIQUETAS.filter(e => e.dificultad === dif && e.familia !== 'triangular');
    // Cada familia pesa lo mismo, tenga 1 parámetro o 14: así «múltiplo de 5» no sale en todas las tablas.
    const tamano = {};
    for (const e of pool) tamano[e.familia] = (tamano[e.familia] ?? 0) + 1;
    while (cuantas[dif] > 0) {
      const posibles = pool.filter(e => !elegidas.includes(e) && (cuentaFamilia[e.familia] ?? 0) < (TOPE_FAMILIA[e.familia] ?? 1));
      if (!posibles.length) return null;
      const peso = e => peso1(e) / tamano[e.familia];
      let r = rng.azar() * posibles.reduce((t, e) => t + peso(e), 0);
      poner(posibles.find(e => (r -= peso(e)) < 0) ?? posibles.at(-1));
    }
  }
  return elegidas;
}

const mascaraIgual = (a, b) => RANGO.every(n => a.tiene[n] === b.tiene[n]);

/** Una tabla del nivel dado: siempre con al menos una solución, sin casillas imposibles ni etiquetas equivalentes. */
export function generarNivel(rng, nivel, anterior = null) {
  const { nF, nC, fijas, puntos } = NIVELES[nivel - 1];
  for (let intento = 0; intento < INTENTOS; intento++) {
    const elegidas = elegirEtiquetas(rng, nivel);
    if (!elegidas) continue;
    // Dos etiquetas con las mismas propiedades (aquí, ninguna: las familias y sus parámetros son distintos) no tienen gracia.
    if (elegidas.some((a, i) => elegidas.slice(i + 1).some(b => mascaraIgual(a, b)))) continue;
    const baraja = rng.barajar(elegidas);
    const filas = baraja.slice(0, nF), cols = baraja.slice(nF);
    const candidatos = filas.flatMap(f => cols.map(c => intersecciones(f, c)));
    if (candidatos.some(c => c.length < MIN_CANDIDATOS)) continue;   // casilla imposible o con casi un solo número
    const numeros = repartirNumeros(candidatos, rng);
    if (!numeros) continue;
    // Nada que decidir: una etiqueta que cumplen todos los números no separa nada.
    if (elegidas.some(e => numeros.every(n => e.tiene[n]))) continue;
    const celdas = filas.map((_, i) => numeros.slice(i * nC, (i + 1) * nC));
    const item = {
      nivel, nF, nC, fijas, puntos,
      etiquetas: rng.barajar(elegidas.map(e => e.id)),
      numeros: rng.barajar(numeros),
      diseno: { filas: filas.map(e => e.id), cols: cols.map(e => e.id), celdas },
    };
    if (anterior && anterior.nivel === nivel && claveEtiquetas(anterior) === claveEtiquetas(item)) continue;
    return item;
  }
  return reserva(nivel);
}

/** Una tabla a mano por nivel, por si el azar no diera con ninguna (el test comprueba que nunca hace falta). */
function reserva(nivel) {
  const tablas = {
    1: { filas: ['par', 'impar'], cols: ['menor:50', 'mayor:50', 'multiplo:5'], celdas: [[4, 60, 10], [3, 51, 15]] },
    2: { filas: ['par', 'impar'], cols: ['primo', 'compuesto', 'menor:30', 'mayor:60'], celdas: [[2, 4, 8, 62], [3, 9, 5, 65]] },
    3: { filas: ['par', 'impar', 'primo'], cols: ['menor:50', 'mayor:50', 'multiplo:3'], celdas: [[4, 52, 6], [9, 51, 3], [7, 53, 3]] },
    4: { filas: ['par', 'impar', 'primo', 'cuadrado'], cols: ['menor:50', 'mayor:50', 'multiplo:3'], celdas: [[4, 52, 6], [9, 51, 3], [7, 53, 3], [1, 64, 9]] },
  }[nivel];
  const { nF, nC, fijas, puntos } = NIVELES[nivel - 1];
  const ids = [...tablas.filas, ...tablas.cols];
  const numeros = tablas.celdas.flat();
  return { nivel, nF, nC, fijas, puntos, etiquetas: ids, numeros, diseno: tablas, reserva: true };
}

const claveEtiquetas = item => [...item.etiquetas].sort().join(',');
/** Clave del ítem: la base no repite la anterior. */
export const clave = item => `${item.nivel}|${claveEtiquetas(item)}|${[...item.numeros].sort((a, b) => a - b).join(',')}`;

/** El ítem del ejercicio: el nivel sale de los puntos del alumno. */
export function generar(rng, sesion) {
  return generarNivel(rng, nivelDePuntos(sesion?.puntos ?? 0), sesion?.anterior ?? null);
}

// --- Infografías: etiquetas nuevas con su propia explicación ----------------------

/** Qué familias llevan infografía antes de su primer puzle (hoy, solo «triangular»). */
export const FAMILIAS_CON_INFOGRAFIA = ['triangular'];
/** Las familias con infografía que lleva este ítem. */
export const infografiasDe = item => FAMILIAS_CON_INFOGRAFIA.filter(f => item.etiquetas.some(id => etiquetaPorId(id).familia === f));
