// «No lo sé» de «Compara, ordena y redondea»: la explicación de cada ejercicio. Reutiliza el paso a paso
// que ya da el feedback de acierto (`explicar*` de logica.js, con `null` en el error) y le pone al final
// la respuesta, explícita. Funciones puras; se prueban en `tests/practicas-ayuda-compara-decimales.test.js`.

import { aTexto, decimal } from '../_comun/decimales.js';
import {
  simboloComparar, ordenCorrecto, ejemploEntre, redondeoBueno,
  explicarComparar, explicarOrden, explicarEntre, explicarRedondeo,
} from './logica.js';

const D = ({ m, k }) => decimal(m, k);
const respuesta =(idioma, x) => `<p><strong>${idioma === 'en' ? 'The answer is' : 'La respuesta es'} ${x}.</strong></p>`;
const SIGNOS = { '<': '&lt;', '=': '=', '>': '&gt;' };

export function explicaComparar(item, { idioma }) {
  const A = aTexto(D(item.a), idioma), B = aTexto(D(item.b), idioma);
  return `<p>${explicarComparar(item, null, idioma)}</p>${respuesta(idioma, `${A} ${SIGNOS[simboloComparar(item)]} ${B}`)}`;
}

export function explicaOrden(item, { idioma }) {
  const orden = ordenCorrecto(item).map(i => aTexto(D(item.vals[i]), idioma)).join(item.creciente ? ' &lt; ' : ' &gt; ');
  return `<p>${explicarOrden(item, null, idioma)}</p>${respuesta(idioma, orden)}`;
}

export function explicaEntre(item, { idioma }) {
  const ej = aTexto(ejemploEntre(item), idioma);
  const a = aTexto(D(item.a), idioma), b = aTexto(D(item.b), idioma);
  const final = item.modo === 'elige'
    ? (idioma === 'en' ? `${ej} (it is between ${a} and ${b})` : `${ej} (está entre ${a} y ${b})`)
    : (idioma === 'en' ? `${ej}, for example (any number between ${a} and ${b} is fine)` : `${ej}, por ejemplo (vale cualquier número entre ${a} y ${b})`);
  return `<p>${explicarEntre(item, null, idioma)}</p>${respuesta(idioma, final)}`;
}

export function explicaRedondeo(item, { idioma }) {
  return `<p>${explicarRedondeo(item, null, idioma)}</p>${respuesta(idioma, aTexto(redondeoBueno(item), idioma))}`;
}
