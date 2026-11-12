// «No lo sé» de la práctica de ortografía (tarea 181): la explicación de cada ítem, que ya da el
// banco, con la respuesta escrita explícitamente al final. Todo puro; práctica solo en español.

import { TX, explicacion } from './textos.js';
import { partes, rellenar, estaBien } from './logica.js';
import { explicacionComa, opciones, buena as opcionBuena } from './comas.js';
import { frase, alPrincipio, mayuscula, explicacionExtra, explicacionTilde, PARES, PREGUNTAS } from './tildes.js';
import { explicacionSignos, opcionesSignos } from './signos.js';
import { explicacionSujeto, opcionesSujeto } from './sujeto.js';

const respuesta = html => `<br>La respuesta es: ${html}`;

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
  return `${veredicto} ${explicacion(item.pareja, item.n, esc)}${respuesta(`<b>${bien ? TX.revision.bien : TX.revision.mal}</b>`)}`;
}

/** Ejercicios 6-7: las comas (elegir la frase bien escrita o la que dice lo que se pide). */
export function ayudaComa(item) {
  const buena = opciones(item).find(o => o.k === opcionBuena(item));
  return `${explicacionComa(item)}${respuesta(`<i>${buena.texto}</i>`)}`;
}

/** Ejercicios 8-9: huecos, pares de significado y preguntas de sí o no. */
export function ayudaTilde(item, { esc }) {
  if (item.tipo === 'pregunta') {
    const { respuesta: si } = PREGUNTAS[item.i];
    return `${explicacionExtra(item)}${respuesta(`<b>${si === 'sí' ? 'Sí' : 'No'}</b>`)}`;
  }
  if (item.tipo === 'par') return `${explicacionExtra(item)}${respuesta(`<i>${PARES[item.grupo][item.i].frases[item.cual]}</i>`)}`;
  const { buena } = frase(item.grupo, item.n);
  const forma = alPrincipio(item.grupo, item.n) ? mayuscula(buena) : buena;
  return `${explicacionTilde(item.grupo, item.n)}${respuesta(`<b>${esc(forma)}</b>`)}`;
}

/** Ejercicios 10 y 11: la frase bien escrita es la de la posición 0. */
export function ayudaSignos(item) {
  return `${explicacionSignos(item, 0)}${respuesta(`<i>${opcionesSignos(item).find(o => o.k === 0).texto}</i>`)}`;
}

export function ayudaSujeto(item) {
  return `${explicacionSujeto(item, 0)}${respuesta(`<i>${opcionesSujeto(item).find(o => o.k === 0).texto}</i>`)}`;
}
