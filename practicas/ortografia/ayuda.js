// «No lo sé» de la práctica de ortografía (tarea 181): la explicación de cada ítem, que ya da el
// banco, con la respuesta escrita explícitamente al final. Todo puro; práctica solo en español.
//
// Revisión de la tarea 192: «La respuesta es X», sin dos puntos entre el verbo y lo que sigue (en una
// práctica de ortografía no puede salir lo que la RAE da por mal puntuado); y la frase buena ya no sale
// dos veces (las explicaciones del banco de comas, signos, sujeto y pares de tildes empiezan por ella,
// así que aquí se quita del principio y se deja solo en la respuesta).

import { TX, explicacion } from './textos.js';
import { partes, rellenar, estaBien } from './logica.js';
import { explicacionComa, opciones, buena as opcionBuena } from './comas.js';
import { frase, alPrincipio, mayuscula, explicacionExtra, explicacionTilde, PARES } from './tildes.js';
import { SIGNOS, opcionesSignos } from './signos.js';
import { explicacionSujeto, opcionesSujeto } from './sujeto.js';

const respuesta = html => `<br>La respuesta es ${html}`;

/** Quita la frase buena con la que empieza la explicación del banco («Bien escrita: <i>…</i> » o «<i>…</i> »). */
const sinFraseInicial = (html, en = '') => html.replace(/^(Bien escrita: )?<i>[^<]*<\/i>\s*/, en);

/** Ejercicios 1-3 y 5: la frase con la palabra buena en el hueco. */
export function ayudaHueco(item, { esc }) {
  const { buena } = partes(item.pareja, item.n);
  return `${explicacion(item.pareja, item.n, esc)}${respuesta(`<b>${esc(buena)}</b>: <i>${esc(rellenar(item.pareja, item.n, buena))}</i>`)}`;
}

/** Ejercicio 4: ¿está bien escrita la palabra marcada? */
export function ayudaRevision(item, { esc }) {
  const { buena } = partes(item.pareja, item.n);
  const bien = estaBien(item);
  const veredicto = bien ? TX.revision.esta_bien : TX.revision.esta_mal(esc(item.puesta), esc(buena));
  return `${veredicto} ${explicacion(item.pareja, item.n, esc)}${respuesta(`«<b>${bien ? TX.revision.bien : TX.revision.mal}</b>».`)}`;
}

/** Ejercicios 6-7: las comas (elegir la frase bien escrita o la que dice lo que se pide). */
export function ayudaComa(item) {
  const buena = opciones(item).find(o => o.k === opcionBuena(item));
  const porque = sinFraseInicial(explicacionComa(item), item.tipo === 'escrita' ? 'Aquí ' : '');
  return `${porque}${respuesta(`<i>${buena.texto}</i>`)}`;
}

/** Ejercicios 8-9: huecos, pares de significado y preguntas de sí o no. */
export function ayudaTilde(item, { esc }) {
  // La explicación de la pregunta de sí o no ya acaba en «la respuesta es <b>sí</b> / <b>no</b>».
  if (item.tipo === 'pregunta') return explicacionExtra(item);
  if (item.tipo === 'par') return `${sinFraseInicial(explicacionExtra(item))}${respuesta(`<i>${PARES[item.grupo][item.i].frases[item.cual]}</i>`)}`;
  const { buena } = frase(item.grupo, item.n);
  const forma = alPrincipio(item.grupo, item.n) ? mayuscula(buena) : buena;
  return `${explicacionTilde(item.grupo, item.n)}${respuesta(`<b>${esc(forma)}</b>.`)}`;
}

/** Ejercicios 10 y 11: la frase bien escrita es la de la posición 0. */
// Segunda pasada de la revisión 192 (s-20261113T170145-b187d221): «A las frases mal escritas: le falta…» no
// concordaba (las frases / le) ni decía cuál de las dos tenía cada fallo; ahora cada mala va con el suyo,
// con los mismos motivos del banco (signos.js no se toca).
export function ayudaSignos(item) {
  const porque = SIGNOS[item.i].malas.map(([texto, motivo]) => `En <i>${texto}</i>, ${motivo}.`).join(' ');
  return `${porque}${respuesta(`<i>${opcionesSignos(item).find(o => o.k === 0).texto}</i>`)}`;
}

export function ayudaSujeto(item) {
  return `${sinFraseInicial(explicacionSujeto(item, 0), 'Aquí ')}${respuesta(`<i>${opcionesSujeto(item).find(o => o.k === 0).texto}</i>`)}`;
}
