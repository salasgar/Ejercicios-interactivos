// Registro de tipos de ejercicio y utilidades comunes a todos los generadores.
//
// Un tipo de ejercicio es un módulo que exporta:
//   { id, nombre: { es, en }, curso, concepto, preguntas, errores, generar(rng) }
//
// `generar` devuelve `{ texto, enunciado, opciones }`:
//   - `texto` es la pregunta como referencia a un texto bilingüe:
//     `{ clave, params }`; la clave se busca en `preguntas` del tipo
//     ({ clave: { es, en } }) y, si no está, en los diccionarios de src/i18n.
//   - `enunciado` es la fórmula en TeX neutro (coma decimal «{,}», producto
//     «\cdot», división «\div»), que se adapta a la notación al mostrarla.
//     Puede estar vacía.
//   - `opciones` son 4 objetos `{ tex | texto, correcta, error, pasos? }` ya
//     barajados, con una sola correcta (o 2 sin barajar en las preguntas de
//     «correcto / incorrecto»). `tex` es una fórmula; `texto`, una respuesta en
//     palabras: una cadena o un texto bilingüe { es, en }.
//     `error` es null en la correcta y, en los distractores, `{ id, concepto }`:
//     el id se busca en `errores` del tipo ({ id: { concepto, es, en } }) para
//     mostrar el mensaje, y el concepto indica de qué tipo hay que añadir
//     ejercicios de refuerzo cuando el alumno elige esa opción.
//   - `solucion` (opcional): la resolución paso a paso, lista de
//     `{ tex, calculo?, nota? }`: `tex` es la línea en TeX neutro («3 + 4 \cdot 5
//     = 3 + 20»), `calculo` el cálculo auxiliar que se muestra entre paréntesis
//     («4 \cdot 5 = 20») y `nota` la clave de una explicación breve en la tabla
//     `notas` del tipo ({ clave: { es, en } }), o `{ clave, params }`. El
//     último paso debe terminar en «= <respuesta correcta>».
//   - Cada distractor puede llevar `pasos`, con el mismo formato, que
//     reproducen lo que hace el alumno que se equivoca así; el paso donde está
//     el error lleva `mal: true` (y no necesita nota: se muestra el feedback
//     del error). El último paso termina en «= <valor del distractor>».

import jerarquia from './jerarquia.js';
import potencias from './potencias.js';
import enteros from './enteros.js';
import divisibilidad from './divisibilidad.js';
import fraccionesEquivalentes from './fracciones_equivalentes.js';
import sumaFracciones from './suma_fracciones.js';
import decimales from './decimales.js';
import lenguajeIngles from './lenguaje_ingles.js';
import lenguajeEspanol from './lenguaje_espanol.js';

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
  jerarquia: { nombre: { es: 'Jerarquía de las operaciones', en: 'Order of operations' }, tipo: 'jerarquia' },
  potencias: { nombre: { es: 'Potencias', en: 'Powers' }, tipo: 'potencias' },
  enteros: { nombre: { es: 'Números enteros', en: 'Integers' }, tipo: 'enteros' },
  divisibilidad: { nombre: { es: 'Múltiplos, divisores y primos', en: 'Multiples, divisors and primes' }, tipo: 'divisibilidad' },
  fracciones_equivalentes: { nombre: { es: 'Fracciones equivalentes', en: 'Equivalent fractions' }, tipo: 'fracciones_equivalentes' },
  suma_fracciones: { nombre: { es: 'Suma y resta de fracciones', en: 'Adding and subtracting fractions' }, tipo: 'suma_fracciones' },
  decimales: { nombre: { es: 'Números decimales', en: 'Decimals' }, tipo: 'decimales' },
  lenguaje_ingles: { nombre: { es: 'Matemáticas en inglés', en: 'Maths in English' }, tipo: 'lenguaje_ingles' },
  lenguaje_espanol: { nombre: { es: 'Matemáticas en español', en: 'Maths in Spanish' }, tipo: 'lenguaje_espanol' },
};

// ---------------------------------------------------------------------------
// Ayudas para escribir TeX.

/** Un número (entero o decimal) en TeX neutro: la coma decimal «{,}» se adapta al mostrar. */
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
  if (num === 0) return '0';
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
 *   correcta:     { tex | texto, clave }
 *   distractores: [{ tex | texto, clave, error: { id, concepto } }] en orden
 *                 de prioridad; los primeros son los errores más informativos.
 *   genericos:    [{ tex | texto, clave }] opcionales, con feedback genérico,
 *                 para rellenar cuando los distractores coinciden entre sí.
 */
export function construirOpciones(rng, correcta, distractores, genericos = [], { numero = 4, barajar = true } = {}) {
  const vistos = new Set([String(correcta.clave)]);
  const elegidos = [];
  const forma = o => ({ ...(o.tex != null ? { tex: o.tex } : { texto: o.texto }), ...(o.pasos ? { pasos: o.pasos } : {}) });
  const visible = o => JSON.stringify(o.tex ?? o.texto);
  for (const d of distractores.concat(genericos.map(g => ({ ...g, error: ERROR_GENERICO })))) {
    const clave = String(d.clave);
    if (vistos.has(clave)) continue;
    if (!visible(d) || visible(d) === visible(correcta)) continue;
    vistos.add(clave);
    elegidos.push({ ...forma(d), correcta: false, error: { id: d.error.id, concepto: d.error.concepto ?? null } });
    if (elegidos.length === numero - 1) break;
  }
  if (elegidos.length < numero - 1) return null;
  const lista = [{ ...forma(correcta), correcta: true, error: null }, ...elegidos];
  return barajar ? rng.barajar(lista) : lista;
}

/** Textos bilingües de las opciones «correcto / incorrecto». */
export const TEXTO_CORRECTO = { es: 'Correcto', en: 'Correct' };
export const TEXTO_INCORRECTO = { es: 'Incorrecto', en: 'Incorrect' };

/**
 * Opciones de una pregunta de verdadero/falso sobre una afirmación:
 *   esCorrecta: si la afirmación es verdadera; error: el error que comete
 *   quien la juzga mal (feedback que explica por qué). Siempre en el mismo
 *   orden: Correcto, Incorrecto.
 */
export function opcionesCorrectoIncorrecto(esCorrecta, error) {
  const e = { id: error.id, concepto: error.concepto ?? null };
  return [
    { texto: TEXTO_CORRECTO, correcta: esCorrecta, error: esCorrecta ? null : e },
    { texto: TEXTO_INCORRECTO, correcta: !esCorrecta, error: esCorrecta ? e : null },
  ];
}

/** Error sin concepto: no añade refuerzo; su mensaje está en src/i18n (clave error_generico). */
export const ERROR_GENERICO = { id: 'generico', concepto: null };

/** Crea la función `E(id)` de un generador a partir de su tabla `errores`. */
export function erroresDe(errores) {
  return id => {
    if (!errores[id]) throw new Error(`Error no definido en la tabla: ${id}`);
    return { id, concepto: errores[id].concepto ?? null };
  };
}

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
  [jerarquia, potencias, enteros, divisibilidad, fraccionesEquivalentes, sumaFracciones, decimales, lenguajeIngles, lenguajeEspanol]
    .map(t => [t.id, t]),
);

export function tipoPorConcepto(concepto) {
  const c = CONCEPTOS[concepto];
  return c ? TIPOS[c.tipo] : null;
}

/** Texto bilingüe { es, en } del mensaje de un error de un tipo (null si es el genérico). */
export function textoDeError(tipoId, errorId) {
  return TIPOS[tipoId]?.errores?.[errorId] ?? null;
}

/** Texto bilingüe { es, en } de la pregunta de un ejercicio, o null si es una clave global (src/i18n). */
export function textoDePregunta(tipoId, clave) {
  return TIPOS[tipoId]?.preguntas?.[clave] ?? null;
}
