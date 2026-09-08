// Idioma de los textos y notación de las fórmulas.
//
// Son dos ajustes independientes: el alumno puede leer en inglés con notación
// española (2,5) o al revés. Se guardan en el navegador y una tarea puede
// fijarlos mientras se hace.
//
// Los textos se buscan por clave: primero en los diccionarios de la interfaz
// (es.js, en.js); las preguntas y los mensajes de error de cada tipo de
// ejercicio viven en su propio módulo (`preguntas` y `errores`).

import es from './es.js';
import en from './en.js';

export const IDIOMAS = ['es', 'en'];
export const NOTACIONES = ['es', 'en'];
const DICCIONARIOS = { es, en };

const estado = { idioma: 'es', notacion: 'es', forzado: { idioma: null, notacion: null } };
let alCambiar = null;          // la pantalla actual
const suscriptores = new Set(); // lo común (cabecera, barra)

function avisar() {
  for (const fn of suscriptores) fn();
  alCambiar?.();
}

function leerGuardado() {
  try {
    const i = localStorage.getItem('idioma'), n = localStorage.getItem('notacion');
    if (IDIOMAS.includes(i)) estado.idioma = i;
    if (NOTACIONES.includes(n)) estado.notacion = n;
  } catch { /* sin localStorage */ }
}
if (typeof localStorage !== 'undefined') leerGuardado();

/** Idioma de los textos en vigor (el fijado por la tarea, si lo hay). */
export function idioma() {
  return estado.forzado.idioma ?? estado.idioma;
}

/** Notación en vigor (la fijada por la tarea, si la hay). */
export function notacion() {
  return estado.forzado.notacion ?? estado.notacion;
}

export function preferencias() {
  return { idioma: estado.idioma, notacion: estado.notacion, forzado: { ...estado.forzado } };
}

export function cambiarIdioma(nuevo) {
  if (!IDIOMAS.includes(nuevo)) return;
  estado.idioma = nuevo;
  try { localStorage.setItem('idioma', nuevo); } catch { /* nada */ }
  avisar();
}

export function cambiarNotacion(nueva) {
  if (!NOTACIONES.includes(nueva)) return;
  estado.notacion = nueva;
  try { localStorage.setItem('notacion', nueva); } catch { /* nada */ }
  avisar();
}

/** Una tarea fija idioma y/o notación (null = libre). */
export function forzar({ idioma: i = null, notacion: n = null } = {}) {
  estado.forzado = { idioma: IDIOMAS.includes(i) ? i : null, notacion: NOTACIONES.includes(n) ? n : null };
  for (const fn of suscriptores) fn();
}

/** La pantalla actual registra cómo repintarse cuando cambie el idioma o la notación. */
export function alCambiarIdioma(fn) {
  alCambiar = fn;
}

/** Suscripción permanente (cabecera, barra de ajustes). */
export function suscribir(fn) {
  suscriptores.add(fn);
}

/**
 * Texto de la interfaz por clave, con parámetros: t('ejercicio_de', { n: 3, total: 12 }).
 * Si falta en el idioma pedido, se usa el español; si tampoco, la propia clave.
 */
export function t(clave, params = {}, idiomaPedido = idioma()) {
  const plantilla = DICCIONARIOS[idiomaPedido]?.[clave] ?? DICCIONARIOS.es[clave] ?? clave;
  return interpolar(plantilla, params);
}

export function interpolar(plantilla, params = {}) {
  return String(plantilla).replace(/\{(\w+)\}/g, (_, k) => (params[k] ?? `{${k}}`));
}

/**
 * Resuelve un texto bilingüe: { es, en } → cadena en el idioma en vigor
 * (con el español como reserva). Acepta también una cadena tal cual.
 */
export function bilingue(texto, idiomaPedido = idioma()) {
  if (texto == null) return '';
  if (typeof texto === 'string') return texto;
  return texto[idiomaPedido] || texto.es || '';
}

/**
 * Notación: el TeX se genera siempre en forma neutra (coma decimal «{,}»,
 * producto «\cdot», división «\div») y aquí se adapta al mostrarlo.
 */
export function aplicarNotacion(tex, notacionPedida = notacion()) {
  if (notacionPedida === 'en') {
    return tex.replace(/\{,\}/g, '.').replace(/\\cdot/g, '\\times');
  }
  return tex.replace(/\\div/g, ':');
}

export function diccionario(idiomaPedido = idioma()) {
  return DICCIONARIOS[idiomaPedido];
}
