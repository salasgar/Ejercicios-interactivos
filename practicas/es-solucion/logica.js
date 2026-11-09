// LÓGICA PURA de «¿Es solución?» (unidad 6, semana 2, sesión 5): comprobar si un número es solución sustituyendo
// en los dos miembros (U6-2C-02), reconocer qué ecuación tiene una solución dada, identidad frente a ecuación
// (U6-2C-03, propuesta pendiente de F0) y escribir una ecuación con una solución dada (U6-2C-04). Sin DOM.
// Todo exacto, con Fraccion: nunca coma flotante ni eval.
//
// Alcance: ecuaciones de la sesión 5, con la x en un solo miembro (x + 3 = 10, 3x = 12, 3x − 5 = 7, 5 − 2x = 1);
// SIN paréntesis, SIN la x en los dos miembros al resolver (semana 3), SIN x², SIN fracciones. En el ejercicio 3
// la x aparece en los dos miembros porque lo que se mira es si la igualdad se cumple, no se despeja.

import { Fraccion } from '../_comun/fracciones.js';
import {
  Ecuacion, termino, ERRORES_TIPICOS, huella, leerEcuacion, MENSAJES,
} from '../_comun/algebra.js';

const MENOS = '−';

// ─── Números ──────────────────────────────────────────────────────────────────────────────────

export const F = p => new Fraccion(p.num, p.den);
export const plano = f => { const s = f.simplificar(); return { num: s.num, den: s.den }; };

/** Un número como texto: 12, −8, 0,5 / 0.5 (si no se puede en decimal, 1/3). */
export function numTexto(x, idioma = 'es') {
  const f = (x instanceof Fraccion ? x : typeof x === 'number' ? new Fraccion(x, 1) : F(x)).simplificar();
  const signo = f.num < 0 ? MENOS : '';
  const a = Math.abs(f.num);
  if (f.den === 1) return `${signo}${a}`;
  for (let k = 1; k <= 4; k++) {
    const m = 10 ** k;
    if (m % f.den === 0) {
      const cifras = String(a * (m / f.den)).padStart(k + 1, '0');
      const t = `${cifras.slice(0, -k)}.${cifras.slice(-k)}`.replace(/0+$/, '');
      return `${signo}${idioma === 'es' ? t.replace('.', ',') : t}`;
    }
  }
  return `${signo}${a}/${f.den}`;
}

/** El número que se sustituye: entre paréntesis si es negativo. */
export const sustituido = (x, idioma = 'es') => {
  const f = x instanceof Fraccion ? x : typeof x === 'number' ? new Fraccion(x, 1) : F(x);
  const t = numTexto(f, idioma);
  return f.num < 0 ? `(${t})` : t;
};

// ─── Ecuaciones de un ítem ────────────────────────────────────────────────────────────────────
// { a, b, c, delante } → a·x + b = c (delante: b + a·x; con a < 0 siempre b − |a|x; con b = 0, a·x = c).

export function ecuacionDe(e) {
  const x = termino(e.a, 'x');
  if (e.b === 0) return new Ecuacion([x], [termino(e.c)]);
  return new Ecuacion(e.delante ? [termino(e.b), x] : [x, termino(e.b)], [termino(e.c)]);
}
export const textoDe = e => ecuacionDe(e).aTexto();
export const htmlDe = e => ecuacionDe(e).aHtml();
export const claveEcuacion = e => ecuacionDe(e).clave();
export const solucionDe = e => ecuacionDe(e).resolver();

/** El valor de un miembro (Fraccion exacta) con x = v, tal como está escrito. */
export const valorMiembro = (terminos, v) => terminos
  .reduce((s, t) => s.sumar(t.letra ? t.coef.multiplicar(v) : t.coef), new Fraccion(0, 1)).simplificar();

const SOLUCIONES = [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MAX_C = 60;

/** Todas las ecuaciones de la sesión 5 con esa solución entera (sin repetir). */
export function ecuacionesConSolucion(s) {
  const lista = [];
  const poner = (a, b, delante) => {
    const c = a * s + b;
    if (Math.abs(c) <= MAX_C) lista.push({ a, b, c, delante });
  };
  for (const a of [2, 3, 4, 5, 6, 7, 8, 9, -2, -3, -4, -5]) poner(a, 0, false);
  for (let b = 1; b <= 12; b++) {
    poner(1, b, false); poner(1, b, true); poner(1, -b, false);
    for (let a = 2; a <= 9; a++) { poner(a, b, false); poner(a, b, true); poner(a, -b, false); }
  }
  for (let a = -5; a <= -1; a++) for (let b = 1; b <= 20; b++) poner(a, b, true);
  return lista;
}

/** Una ecuación al azar con esa solución. */
export const ecuacionAlAzar = (rng, s) => rng.elegir(ecuacionesConSolucion(s));

// ─── Errores ──────────────────────────────────────────────────────────────────────────────────

export const ERRORES_PROPIOS = {
  'dice-que-no-es-solucion': { es: 'Ha dicho que no es solución, y sí lo es', en: 'Said it is not a solution, but it is' },
  'identidad-como-ecuacion': { es: 'Ha tomado por ecuación una identidad', en: 'Took an identity for an equation' },
  'ecuacion-como-identidad': { es: 'Ha tomado por identidad una ecuación que solo vale con un número', en: 'Took for an identity an equation that is true for only one number' },
  'solucion-distinta': { es: 'Su ecuación tiene otra solución', en: 'Its equation has a different solution' },
  'ecuacion-sin-una-solucion': { es: 'Su ecuación se cumple con todos los números o con ninguno', en: 'Its equation is true for every number or for none' },
  'otra-respuesta': { es: 'Otra respuesta', en: 'Another answer' },
};
export const nombreError = id => ERRORES_TIPICOS[id]?.nombre ?? ERRORES_PROPIOS[id];

const ERRORES_DE_VALOR = [
  'transponer-sin-signo', 'pasar-factor-restando', 'multiplicar-en-vez-de-dividir', 'invertir-coeficiente',
  'signo-al-dividir', 'signo-de-la-solucion',
];

/** Los valores equivocados de x que salen de un error típico con esta ecuación: [{ error, valor }] (enteros, creíbles). */
export function candidatos(e) {
  const q = ecuacionDe(e), s = solucionDe(e);
  const salida = [];
  for (const id of ERRORES_DE_VALOR) {
    const mala = ERRORES_TIPICOS[id].fn(q);
    const v = mala && mala.resolver();
    if (!(v instanceof Fraccion) || v.den !== 1 || v.equals(s) || Math.abs(v.num) > MAX_C) continue;
    if (!salida.some(c => c.valor === v.num)) salida.push({ error: id, valor: v.num });
  }
  return salida;
}

/** El nombre del error que explica ese valor equivocado de x (o 'otra-respuesta'). */
export const errorDeValor = (e, valor) => candidatos(e).find(c => c.valor === valor)?.error ?? 'otra-respuesta';

// ─── Casos reservados (hoja y examen) ─────────────────────────────────────────────────────────
// A fecha 2026-11-09 la hoja y el examen de la U6 no existen: no hay nada que excluir. Si se escriben, sus
// ecuaciones se añaden aquí por huella FNV-1a de la forma canónica (`huellaCanonica`), calculada fuera del repo.

export const HUELLAS_RESERVADAS = new Set([]);
export const huellaEcuacion = q => huella(q.clave());
export const esReservado = e => HUELLAS_RESERVADAS.has(huellaEcuacion(ecuacionDe(e)));

// ─── Ejercicio 1: Compruébalo ─────────────────────────────────────────────────────────────────

export function generarComprueba(rng) {
  for (let i = 0; i < 500; i++) {
    const s = rng.elegir(SOLUCIONES), e = ecuacionAlAzar(rng, s);
    if (esReservado(e)) continue;
    if (rng.entero(0, 1) === 1) return { ...e, s, v: s, esSolucion: true, error: null };
    const cs = candidatos(e);
    if (!cs.length) continue;
    const c = rng.elegir(cs);
    return { ...e, s, v: c.valor, esSolucion: false, error: c.error };
  }
  throw new Error('es-solucion: no sale un ítem del ejercicio 1');
}

/** null si acierta; si no, el nombre del error. `dice`: 'si' | 'no'. */
export function errorDeComprueba(item, dice) {
  if ((dice === 'si') === item.esSolucion) return null;
  return item.esSolucion ? 'dice-que-no-es-solucion' : item.error;
}

// ─── Ejercicio 2: ¿Qué ecuación? ──────────────────────────────────────────────────────────────
// Cuatro ecuaciones y una solución dada: solo una la tiene. Cada falsa es una ecuación a la que un error típico
// le da esa solución (quien se equivoca encuentra «su» respuesta); las tres falsas tienen soluciones distintas.

let POOL = null;
function pool() {
  if (POOL) return POOL;
  POOL = [];
  for (const sol of SOLUCIONES) for (const e of ecuacionesConSolucion(sol)) POOL.push({ e, sol, cands: candidatos(e) });
  return POOL;
}

const INDICES = new Map();
function indiceDe(s) {
  if (INDICES.has(s)) return INDICES.get(s);
  const buenas = [], porError = new Map();
  for (const p of pool()) {
    if (p.sol === s) buenas.push(p.e);
    else for (const c of p.cands) {
      if (c.valor !== s) continue;
      if (!porError.has(c.error)) porError.set(c.error, []);
      porError.get(c.error).push(p);
    }
  }
  const indice = porError.size >= 3 && buenas.length ? { buenas, porError } : null;
  INDICES.set(s, indice);
  return indice;
}

export function generarQueEcuacion(rng) {
  for (let i = 0; i < 500; i++) {
    const s = rng.elegir([2, 3, 4, 5, 6, 7, 8, 9, -1, -2, -3, -4, -5]);
    const ind = indiceDe(s);
    if (!ind) continue;
    const buena = rng.elegir(ind.buenas);
    const claves = new Set([claveEcuacion(buena)]), sols = new Set([s]);
    const falsas = [];
    for (const [error, lista] of rng.barajar([...ind.porError.entries()])) {
      const libres = lista.filter(p => !sols.has(p.sol) && !claves.has(claveEcuacion(p.e)));
      if (!libres.length) continue;
      const p = rng.elegir(libres);
      sols.add(p.sol); claves.add(claveEcuacion(p.e));
      falsas.push({ e: p.e, correcta: false, error });
      if (falsas.length === 3) break;
    }
    if (falsas.length < 3) continue;
    const opciones = rng.barajar([{ e: buena, correcta: true, error: null }, ...falsas]);
    if (opciones.some(o => esReservado(o.e))) continue;
    return { s, opciones };
  }
  throw new Error('es-solucion: no sale un ítem del ejercicio 2');
}

// ─── Ejercicio 3: ¿Identidad o ecuación? ──────────────────────────────────────────────────────
// Un término es [coeficiente, letra | null]. Una identidad se cumple con todos los números; una ecuación, con uno.
// No hay ecuaciones sin solución (de la semana 3).

const T = (c, l = 'x') => [c, l];
const CTE = c => [c, null];

export const ecuacion3 = item => new Ecuacion(item.izq.map(([c, l]) => termino(c, l)), item.der.map(([c, l]) => termino(c, l)));

function identidad(rng) {
  switch (rng.entero(1, 5)) {
    case 1: { const a = rng.entero(1, 6), b = rng.entero(1, 6); return { clase: 'I1', izq: [T(a), T(b)], der: [T(a + b)] }; }
    case 2: { const q = rng.entero(1, 5), p = q + rng.entero(1, 5); return { clase: 'I2', izq: [T(p), T(-q)], der: [T(p - q)] }; }
    case 3: { const a = rng.entero(1, 5), c = rng.entero(1, 5), b = rng.entero(1, 9); return { clase: 'I3', izq: [T(a), CTE(b), T(c)], der: [T(a + c), CTE(b)] }; }
    case 4: { const a = rng.entero(2, 9), b = rng.entero(1, 9); return { clase: 'I4', izq: [CTE(b), T(a)], der: [T(a), CTE(b)] }; }
    default: { const a = rng.entero(1, 9), b = rng.entero(1, 9), c = rng.entero(1, 9); return { clase: 'I5', izq: [T(a), CTE(b), CTE(c)], der: [T(a), CTE(b + c)] }; }
  }
}

function ecuacion3Una(rng) {
  switch (rng.entero(1, 4)) {
    case 1: { const a = rng.entero(1, 6), b = rng.entero(1, 6); return { clase: 'E1', izq: [T(a), CTE(b)], der: [T(a + b)], solucion: 1, error: 'suma-no-semejantes' }; }
    case 2: { const b = rng.entero(2, 9), s = rng.entero(2, 12); return { clase: 'E2', izq: [T(1), CTE(b)], der: [CTE(s + b)], solucion: s, error: 'ecuacion-como-identidad' }; }
    case 3: { const a = rng.entero(1, 5), c = a + rng.entero(1, 4), s = rng.entero(2, 6); return { clase: 'E3', izq: [T(a), CTE((c - a) * s)], der: [T(c)], solucion: s, error: 'ecuacion-como-identidad' }; }
    default: { const a = rng.entero(1, 6), b = rng.entero(1, 6), s = rng.entero(2, 9); return { clase: 'E4', izq: [T(a), T(b)], der: [CTE((a + b) * s)], solucion: s, error: 'ecuacion-como-identidad' }; }
  }
}

export function generarIdentidad(rng) {
  for (let i = 0; i < 100; i++) {
    const esIdentidad = rng.entero(0, 1) === 1;
    const base = esIdentidad ? { ...identidad(rng), tipo: 'identidad', error: 'identidad-como-ecuacion' } : { ...ecuacion3Una(rng), tipo: 'ecuacion' };
    const item = { ...base, valores: esIdentidad ? [2, 5] : [base.solucion, base.solucion + 1] };
    if (HUELLAS_RESERVADAS.has(huellaEcuacion(ecuacion3(item)))) continue;
    return item;
  }
  throw new Error('es-solucion: no sale un ítem del ejercicio 3');
}

/** null si acierta. `dice`: 'identidad' | 'ecuacion'. */
export const errorDeIdentidad = (item, dice) => (dice === item.tipo ? null : item.error);

// ─── Ejercicio 4: Inventa una ─────────────────────────────────────────────────────────────────

export const MENSAJES_4 = {
  talcual: { es: 'Eso ya es la solución escrita. Escribe una ecuación que haya que resolver.', en: 'That is already the solution written out. Write an equation that has to be solved.' },
  sinCoeficiente: { es: 'Esta vez, que tenga un número delante de la x (como 3x).', en: 'This time, put a number in front of the x (like 3x).' },
};

export function generarInventa(rng) {
  const s = rng.entero(0, 3) === 0 ? -rng.entero(1, 9) : rng.entero(1, 12);
  return { s, requisito: rng.entero(0, 2) === 0 ? 'coeficiente' : 'libre' };
}

const esLaX = ts => ts.length === 1 && ts[0].letra && ts[0].coef.equals(1);
const sinLetra = ts => ts.every(t => !t.letra);

/** Lo que teclea el alumno: { ok: true, q } o { ok: false, mensaje: { es, en } } (sin contar como fallo). */
export function validar(texto, item) {
  const r = leerEcuacion(texto, { letras: ['x'] });
  if (!r.ok) return { ok: false, motivo: r.motivo, mensaje: r.mensaje };
  const q = r.valor;
  if ((esLaX(q.terminosIzq) && sinLetra(q.terminosDer)) || (esLaX(q.terminosDer) && sinLetra(q.terminosIzq))) return { ok: false, motivo: 'talcual', mensaje: MENSAJES_4.talcual };
  const conCoef = [...q.terminosIzq, ...q.terminosDer].some(t => t.letra && !t.coef.equals(1) && !t.coef.equals(-1) && !t.coef.esCero());
  if (item.requisito === 'coeficiente' && !conCoef) return { ok: false, motivo: 'sin-coeficiente', mensaje: MENSAJES_4.sinCoeficiente };
  return { ok: true, q };
}

/** null si la ecuación tiene exactamente la solución pedida; si no, el nombre del error. */
export function errorDeInventa(q, item) {
  const sol = q.resolver();
  if (!(sol instanceof Fraccion)) return 'ecuacion-sin-una-solucion';
  return sol.equals(item.s) ? null : 'solucion-distinta';
}

// ─── Claves (para no repetir ítems en una sesión) ─────────────────────────────────────────────

export function claveDe(item) {
  if (item.opciones) return `q:${item.s}:${item.opciones.map(o => claveEcuacion(o.e)).sort().join('|')}`;
  if (item.izq) return `i:${ecuacion3(item).aTexto()}`;
  if (item.requisito) return `n:${item.s}:${item.requisito}`;
  return `c:${claveEcuacion(item)}@${item.v}`;
}
