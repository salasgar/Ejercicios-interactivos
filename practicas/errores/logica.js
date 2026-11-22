// Práctica «Caza el error»: lógica pura (sin DOM ni red). Los generadores
// devuelven DATOS: la base vuelve a montar el mismo ítem al cambiar de idioma.
//
// Ítem: { tipo: 'hay' | 'linea' | 'nombre', plantilla, params, lineas, error,
//         opciones, solucion }
//   lineas   [{ es, en }, …] el enunciado y el procedimiento (3 a 5 líneas); la 0 es el enunciado
//   error    null o { linea (índice en `lineas`, desde 1), nombre (clave de NOMBRES) }
//   opciones 'hay': ['bien', 'error'] · 'linea': [1, 2, …] (el enunciado no se puede pulsar) · 'nombre': 4 claves
//   solucion la opción correcta (la misma forma que las opciones)

import { PLANTILLAS, PLANTILLA_POR_ID, CLAVES_NOMBRES, CONFUNDIBLES } from './textos.js';

const CON_ERROR = PLANTILLAS.filter(p => p.error);
const SIN_ERROR = PLANTILLAS.filter(p => !p.error);

/** Las líneas que ve el alumno: el enunciado de la plantilla (si lo tiene aparte) y los pasos. */
export function lineasDe(plantilla, params) {
  const pasos = plantilla.lineas(params);
  return plantilla.enunciado ? [plantilla.enunciado(params), ...pasos] : pasos;
}
/** El error de la plantilla con la línea contada en `lineasDe` (el enunciado aparte la corre un puesto). */
export const errorDe = plantilla => plantilla.error && { ...plantilla.error, linea: plantilla.error.linea + (plantilla.enunciado ? 1 : 0) };

function ficha(plantilla, params, tipo, opciones, solucion) {
  return { tipo, plantilla: plantilla.id, params, lineas: lineasDe(plantilla, params), error: errorDe(plantilla), opciones, solucion };
}

/** Nombres que NO se pueden dar como distractores de un error: él mismo, sus excluidos y los confundibles. */
export function nombresExcluidos(plantilla) {
  const buenos = plantilla.error.nombre;
  const fuera = new Set([buenos, ...(plantilla.excluidos ?? [])]);
  for (const [a, b] of CONFUNDIBLES) {
    if (a === buenos) fuera.add(b);
    if (b === buenos) fuera.add(a);
  }
  return fuera;
}

/** Ejercicio 1. Mitad procedimientos bien y mitad con un error. */
export function generarHay(rng) {
  const conError = rng.azar() < 0.5;
  const plantilla = rng.elegir(conError ? CON_ERROR : SIN_ERROR);
  return ficha(plantilla, plantilla.numeros(rng), 'hay', ['bien', 'error'], conError ? 'error' : 'bien');
}

/** Ejercicio 2: solo procedimientos con error; cada línea, salvo el enunciado, es una opción. */
export function generarLinea(rng) {
  const plantilla = rng.elegir(CON_ERROR);
  const params = plantilla.numeros(rng);
  const lineas = lineasDe(plantilla, params);
  return ficha(plantilla, params, 'linea', lineas.slice(1).map((_, i) => i + 1), errorDe(plantilla).linea);
}

/** Ejercicio 3: el nombre correcto y tres que no pueden aplicarse a ese procedimiento. */
export function generarNombre(rng) {
  const plantilla = rng.elegir(CON_ERROR);
  const fuera = nombresExcluidos(plantilla);
  const distractores = rng.barajar(CLAVES_NOMBRES.filter(c => !fuera.has(c))).slice(0, 3);
  const opciones = rng.barajar([plantilla.error.nombre, ...distractores]);
  return ficha(plantilla, plantilla.numeros(rng), 'nombre', opciones, plantilla.error.nombre);
}

/** Clave para que la base no repita el ítem anterior. */
export const claveItem = item => `${item.plantilla}|${JSON.stringify(item.params)}`;

export { PLANTILLA_POR_ID };
