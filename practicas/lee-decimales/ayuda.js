// «No lo sé» de «Lee y escribe decimales»: la explicación de cada ejercicio, con los números del ítem.
// Funciones puras (solo dependen del ítem y del idioma); `practica.js` las conecta y
// `tests/practicas-ayuda-lee-decimales.test.js` las prueba. Guía: `docs/no-lo-se.md`.

import { aTexto, enPalabras } from '../_comun/decimales.js';
import { htmlFraccion } from '../_comun/fracciones.js';
import { TX } from './textos.js';
import { D, Fr, ordenDe, pasoDeRecta } from './logica.js';

const num = (p, idioma) => aTexto(D(p), idioma);
const numN = (p, idioma) => aTexto(D(p).normalizar(), idioma);
const suma = (terminos, idioma) => terminos.map(t => num(t, idioma)).join(' + ');
const cuenta = x => `<span class="cuenta">${x}</span>`;
const pasos = lista => `<ol class="pasos-ayuda">${lista.map(p => `<li>${p}</li>`).join('')}</ol>`;
const respuesta = (idioma, x) => `<p><strong>${idioma === 'en' ? 'The answer is' : 'La respuesta es'} ${x}.</strong></p>`;
const plural = (k, es1, esN, en1, enN, idioma) => (idioma === 'en' ? (k === 1 ? en1 : enN) : (k === 1 ? es1 : esN));

/** El número partido en parte entera y parte decimal, ya escritos en el idioma. */
function partes(d, idioma) {
  const [entera, decimal = ''] = num(d, idioma).split(idioma === 'en' ? '.' : ',');
  return { entera, decimal };
}

/** Ejercicio 1 · Léelo. La lectura buena es la que el ítem da por válida (`item.lectura`) en su idioma. */
export function explicaLeelo(item, { idioma }) {
  const n = num(item.d, idioma);
  const { entera, decimal } = partes(item.d, idioma);
  const buenaLectura = idioma === item.idioma ? item.lectura : enPalabras(D(item.d), idioma);
  const es = idioma === 'es';
  const regla = es
    ? 'Se lee la parte entera, «coma» y la parte decimal.'
    : 'We read the whole part, “point”, and then the decimal digits one at a time.';
  const trozos = decimal
    ? (es ? `${n}: parte entera ${cuenta(entera)}, parte decimal ${cuenta(decimal)}.`
      : `${n}: whole part ${cuenta(entera)}, decimal digits ${cuenta(decimal)}.`)
    : '';
  if (item.sentido === 'lectura') {
    return `<p>${regla}</p><p>${trozos}</p>${respuesta(idioma, `«${buenaLectura}»`)}`;
  }
  const alReves = es
    ? 'Escribe la parte entera, la coma y las cifras decimales en el orden en que se dicen.'
    : 'Write the whole part, the point and the decimal digits in the order they are said.';
  return `<p>${alReves}</p><p>«${buenaLectura}» ${es ? 'se escribe' : 'is written'} ${cuenta(n)}.</p>${respuesta(idioma, n)}`;
}

/** Ejercicio 2 · ¿Qué vale esta cifra? (valor de una cifra y descomposición). */
export function explicaCifra(item, { idioma, tt }) {
  const n = num(item.d, idioma);
  const buena = item.opciones.find(o => o.correcta);
  if (item.tipo === 'valor') {
    const orden = ordenDe(item.exponente, idioma);
    const lugar = idioma === 'en' ? `the ${orden} place` : `las ${orden}`;
    const cantidad = `${item.cifra} ${ordenDe(item.exponente, idioma, item.cifra === 1 ? 1 : 2)}`;
    return pasos([
      idioma === 'en' ? `Find the marked digit in ${n}: it is the ${item.cifra}.` : `Busca la cifra marcada en ${n}: es el ${item.cifra}.`,
      idioma === 'en' ? `It is in ${lugar}.` : `Está en ${lugar}.`,
      idioma === 'en' ? `So it is ${cuenta(cantidad)}.` : `Así que son ${cuenta(cantidad)}.`,
    ]) + respuesta(idioma, num(buena.valor, idioma));
  }
  const s = suma(buena.terminos, idioma);
  return `<p>${idioma === 'en' ? 'Each digit is worth what its place says; add the values of the digits that are not 0.' : 'Cada cifra vale según su lugar; suma lo que vale cada cifra que no es 0.'}</p>`
    + `<p>${tt(TX.cifra.suma)(n, cuenta(s))}</p>${respuesta(idioma, s)}`;
}

/** Ejercicio 3 · La fracción decimal. */
export function explicaFraccion(item, { idioma }) {
  const es = idioma === 'es';
  const buena = item.opciones.find(o => o.correcta);
  if (item.sentido === 'a-fraccion') {
    const k = item.d.k;
    const n = num(item.d, idioma);
    const fr = htmlFraccion(Fr(buena.fr));
    return pasos([
      es ? `Cuenta las cifras decimales de ${n}: ${cuenta(k)}.` : `Count the decimal places of ${n}: ${cuenta(k)}.`,
      es ? `El denominador es 1 con ${k} ${plural(k, 'cero', 'ceros', 'zero', 'zeros', idioma)}: ${cuenta(`1${'0'.repeat(k)}`)}.`
        : `The denominator is 1 with ${k} ${plural(k, 'cero', 'ceros', 'zero', 'zeros', idioma)}: ${cuenta(`1${'0'.repeat(k)}`)}.`,
      es ? `El numerador son todas las cifras sin la coma: ${cuenta(buena.fr.n)}.` : `The numerator is all the digits without the point: ${cuenta(buena.fr.n)}.`,
    ]) + respuesta(idioma, `${n} = ${fr}`);
  }
  const j = item.d.k;
  const fr = htmlFraccion(Fr(item.fr));
  const n = num(item.d, idioma);
  return pasos([
    es ? `Mira los ceros del denominador de ${fr}: ${cuenta(j)}.` : `Look at the zeros of the denominator of ${fr}: ${cuenta(j)}.`,
    es ? `El decimal tiene ${j} ${plural(j, 'cifra decimal', 'cifras decimales', 'place', 'places', idioma)}.` : `The decimal has ${j} decimal ${plural(j, '', '', 'place', 'places', idioma)}.`,
    es ? `Escribe las cifras del numerador y pon la coma para que queden ${j}.` : `Write the digits of the numerator and put the point so that ${j} are after it.`,
  ]) + respuesta(idioma, `${fr} = ${n}`);
}

/** Ejercicio 4 · En la recta. */
export function explicaRecta(item, { tt, idioma }) {
  const valor = num(item.valor, idioma);
  const base = tt(TX.recta.huecos)(valor, numN(item.desde, idioma), numN(item.hasta, idioma), num(pasoDeRecta(item), idioma), item.marcas);
  const consejo = idioma === 'en' ? 'Tip: count gaps, not marks; the starting mark is gap 0.' : 'Consejo: cuenta huecos, no marcas; la marca de salida es el hueco 0.';
  return `<p>${base}</p>${respuesta(idioma, valor)}<p class="consejo">${consejo}</p>`;
}
