// Registro de tipos de ejercicio y utilidades comunes a todos los generadores.
//
// Un tipo de ejercicio es un módulo que exporta:
//   { id, nombre, curso, concepto, generar(rng) }
// y `generar` devuelve `{ texto, enunciado, opciones }`: `texto` es la pregunta
// en texto normal («Calcula:», «¿Cuál es primo?»), `enunciado` la fórmula en TeX
// (puede estar vacía) y
// `opciones` son exactamente 4 objetos `{ tex, correcta, error }` ya barajados,
// con una sola correcta. `error` es null en la correcta y, en los distractores,
// `{ id, concepto, feedback }`: el concepto indica de qué tipo hay que añadir
// ejercicios de refuerzo cuando el alumno elige esa opción.

import jerarquia from './jerarquia.js';
import potencias from './potencias.js';
import enteros from './enteros.js';
import divisibilidad from './divisibilidad.js';
import fraccionesEquivalentes from './fracciones_equivalentes.js';
import sumaFracciones from './suma_fracciones.js';
import decimales from './decimales.js';

// ---------------------------------------------------------------------------
// Generador de números aleatorios con semilla (mulberry32). Hace los tests
// reproducibles y permite regenerar una tarea a partir de su semilla.

export function crearRng(semilla = Date.now()) {
  let estado = semilla >>> 0;
  const siguiente = () => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    /** Número real en [0, 1). */
    real: siguiente,
    /** Entero en [min, max], ambos incluidos. */
    entero(min, max) {
      return min + Math.floor(siguiente() * (max - min + 1));
    },
    /** Un elemento de la lista. */
    elegir(lista) {
      return lista[Math.floor(siguiente() * lista.length)];
    },
    /** Copia barajada de la lista (Fisher-Yates). */
    barajar(lista) {
      const copia = lista.slice();
      for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(siguiente() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
      }
      return copia;
    },
    /** Verdadero con probabilidad p. */
    moneda(p = 0.5) {
      return siguiente() < p;
    },
  };
}

// ---------------------------------------------------------------------------
// Conceptos: la clave por la que se decide el refuerzo. Cada concepto apunta al
// tipo de ejercicio que se añade cuando el alumno falla por ese motivo.

export const CONCEPTOS = {
  jerarquia: { nombre: 'Jerarquía de las operaciones', tipo: 'jerarquia' },
  potencias: { nombre: 'Potencias', tipo: 'potencias' },
  enteros: { nombre: 'Números enteros', tipo: 'enteros' },
  divisibilidad: { nombre: 'Múltiplos, divisores y primos', tipo: 'divisibilidad' },
  fracciones_equivalentes: { nombre: 'Fracciones equivalentes', tipo: 'fracciones_equivalentes' },
  suma_fracciones: { nombre: 'Suma y resta de fracciones', tipo: 'suma_fracciones' },
  decimales: { nombre: 'Números decimales', tipo: 'decimales' },
};

// ---------------------------------------------------------------------------
// Ayudas para escribir TeX.

/** Un número (entero o decimal) en TeX, con coma decimal a la española. */
export function tex(n) {
  if (typeof n === 'string') return n;
  const s = redondear(n).toString();
  return s.replace('-', '-').replace('.', '{,}');
}

/** Quita el ruido de coma flotante: 0.1 + 0.2 → 0.3. */
export function redondear(n, decimales = 8) {
  return Number(n.toFixed(decimales));
}

/** Fracción en TeX, con signo delante y sin denominador cuando es entero. */
export function texFraccion(num, den) {
  if (den < 0) { num = -num; den = -den; }
  if (den === 1) return tex(num);
  const signo = num < 0 ? '-' : '';
  return `${signo}\\frac{${Math.abs(num)}}{${den}}`;
}

export function mcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

export function mcm(a, b) {
  return Math.abs(a * b) / mcd(a, b);
}

/** Fracción reducida como [num, den] con den > 0. */
export function reducir(num, den) {
  if (den < 0) { num = -num; den = -den; }
  const d = mcd(num, den) || 1;
  return [num / d, den / d];
}

/** Clave de igualdad de valor para fracciones: "3/4". */
export function claveFraccion(num, den) {
  const [n, d] = reducir(num, den);
  return `${n}/${d}`;
}

// ---------------------------------------------------------------------------
// Construcción de las opciones.

/**
 * Devuelve las 4 opciones barajadas o null si no se consiguen 3 distractores
 * de valor distinto (entre sí y de la correcta). El generador, en ese caso,
 * prueba con otros números.
 *
 *   correcta:     { tex, clave }
 *   distractores: [{ tex, clave, error: { id, concepto, feedback } }] en orden
 *                 de prioridad; los primeros son los errores más informativos.
 *   genericos:    [{ tex, clave }] opcionales, con feedback genérico, para
 *                 rellenar cuando los distractores coinciden entre sí.
 */
export function construirOpciones(rng, correcta, distractores, genericos = []) {
  const vistos = new Set([String(correcta.clave)]);
  const elegidos = [];
  for (const d of distractores.concat(genericos.map(g => ({ ...g, error: ERROR_GENERICO })))) {
    const clave = String(d.clave);
    if (vistos.has(clave)) continue;
    if (!d.tex || d.tex === correcta.tex) continue;
    vistos.add(clave);
    elegidos.push({ tex: d.tex, correcta: false, error: d.error });
    if (elegidos.length === 3) break;
  }
  if (elegidos.length < 3) return null;
  return rng.barajar([{ tex: correcta.tex, correcta: true, error: null }, ...elegidos]);
}

export const ERROR_GENERICO = {
  id: 'generico',
  concepto: null,
  feedback: 'No es correcto. Repasa el cálculo paso a paso.',
};

/**
 * Envuelve un generador que puede devolver null (cuando no consigue opciones
 * distintas) para que reintente con otros números.
 */
export function conReintentos(generar, intentos = 60) {
  return rng => {
    for (let i = 0; i < intentos; i++) {
      const ejercicio = generar(rng);
      if (ejercicio) return ejercicio;
    }
    throw new Error('El generador no consiguió un ejercicio válido');
  };
}

// ---------------------------------------------------------------------------
// Registro.

export const TIPOS = Object.fromEntries(
  [jerarquia, potencias, enteros, divisibilidad, fraccionesEquivalentes, sumaFracciones, decimales]
    .map(t => [t.id, t]),
);

export function tipoPorConcepto(concepto) {
  const c = CONCEPTOS[concepto];
  return c ? TIPOS[c.tipo] : null;
}
