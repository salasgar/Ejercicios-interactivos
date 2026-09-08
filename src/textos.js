// Resolución de los textos de un ejercicio (pregunta, feedback, nombres) en el
// idioma en vigor. Une los diccionarios de la interfaz con las tablas de cada
// tipo de ejercicio.

import { TIPOS, CONCEPTOS, textoDeError, textoDePregunta } from './ejercicios/index.js';
import { t, bilingue, interpolar, idioma } from './i18n/index.js';

/** Pregunta de un ejercicio: { clave, params } → texto en el idioma pedido. */
export function preguntaDe(ejercicio, idiomaPedido = idioma()) {
  const ref = ejercicio.texto;
  if (!ref) return '';
  if (typeof ref === 'string') return ref;
  const propio = textoDePregunta(ejercicio.tipo, ref.clave);
  if (propio) return interpolar(bilingue(propio, idiomaPedido), ref.params ?? {});
  return t(ref.clave, ref.params ?? {}, idiomaPedido);
}

/** Mensaje de feedback de un distractor. */
export function feedbackDe(tipoId, errorId, idiomaPedido = idioma()) {
  if (!errorId || errorId === 'generico') return t('error_generico', {}, idiomaPedido);
  const texto = textoDeError(tipoId, errorId);
  return texto ? bilingue(texto, idiomaPedido) : t('error_generico', {}, idiomaPedido);
}

/** Nota de un paso de la solución: clave (o { clave, params }) en la tabla `notas` del tipo. */
export function notaDe(tipoId, nota, idiomaPedido = idioma()) {
  if (!nota) return '';
  const clave = typeof nota === 'string' ? nota : nota.clave;
  const texto = TIPOS[tipoId]?.notas?.[clave];
  if (!texto) return '';
  return interpolar(bilingue(texto, idiomaPedido), (typeof nota === 'object' && nota.params) || {});
}

export function nombreConcepto(concepto, idiomaPedido = idioma()) {
  return CONCEPTOS[concepto] ? bilingue(CONCEPTOS[concepto].nombre, idiomaPedido) : concepto;
}

export function nombreTipo(tipoId, idiomaPedido = idioma()) {
  return TIPOS[tipoId] ? bilingue(TIPOS[tipoId].nombre, idiomaPedido) : tipoId;
}
