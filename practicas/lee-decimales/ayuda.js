// «No lo sé» de «Lee y escribe decimales»: la explicación de cada ejercicio, con los números del ítem.
// Funciones puras (solo dependen del ítem y del idioma); `practica.js` las conecta y
// `tests/practicas-ayuda-lee-decimales.test.js` las prueba. Guía: `docs/no-lo-se.md`.

import { aTexto, enPalabras } from '../_comun/decimales.js';
import { htmlFraccion } from '../_comun/fracciones.js';
import { D, Fr, cifrasDe, ordenDe, pasoDeRecta } from './logica.js';

const num = (p, idioma) => aTexto(D(p), idioma);
const numN = (p, idioma) => aTexto(D(p).normalizar(), idioma);
const suma = (terminos, idioma) => terminos.map(t => num(t, idioma)).join(' + ');
const cuenta = x => `<span class="cuenta">${x}</span>`;
const pasos = lista => `<ol class="pasos-ayuda">${lista.map(p => `<li>${p}</li>`).join('')}</ol>`;
const respuesta = (idioma, x) => `<p><strong>${idioma === 'en' ? 'The answer is' : 'La respuesta es'} ${x}.</strong></p>`;
const plural = (k, es1, esN, en1, enN, idioma) => (idioma === 'en' ? (k === 1 ? en1 : enN) : (k === 1 ? es1 : esN));
/** Una lectura entre comillas: «…» en español y “…” en inglés. */
export const comillas = (texto, idioma) => (idioma === 'en' ? `“${texto}”` : `«${texto}»`);
/** «7 décimas», «1 décima», «12 unidades»: la cantidad con el nombre de su orden. */
const cantidad = (n, exponente, idioma) => `${n} ${ordenDe(exponente, idioma, n === 1 ? 1 : 2)}`;

/** El número partido en parte entera y parte decimal, ya escritos en el idioma. */
function partes(d, idioma) {
  const [entera, decimal = ''] = num(d, idioma).split(idioma === 'en' ? '.' : ',');
  return { entera, decimal };
}

/** La lectura buena que el ítem da por válida en ese idioma (en el otro, la de siempre). */
export const lecturaBuena = (item, idioma) => (idioma === item.idioma ? item.lectura : enPalabras(D(item.d), idioma));

/**
 * Ejercicio 1 · Léelo. En español hay dos lecturas buenas: con «coma» (doce coma treinta y cuatro) o con
 * los órdenes (doce unidades y treinta y cuatro centésimas); la regla es la de la lectura que sale.
 */
export function explicaLeelo(item, { idioma }) {
  const n = num(item.d, idioma);
  const { entera, decimal } = partes(item.d, idioma);
  const buena = lecturaBuena(item, idioma);
  const k = item.d.k;
  if (idioma === 'en') {
    const cero = /\b(nought|zero)\b/.test(buena) ? ' We read 0 as “nought” (or “zero”).' : '';
    if (item.sentido === 'lectura') {
      return `<p>We read the whole part, “point”, and then the decimal digits one at a time.${cero}</p>`
        + `<p>${n}: whole part ${cuenta(entera)}, decimal digits ${cuenta(decimal)}.</p>${respuesta(idioma, comillas(buena, idioma))}`;
    }
    return `<p>Write the whole part, the point and then one digit for each word after “point”.${cero ? ' “Nought” (or “zero”) is 0.' : ''}</p>`
      + `<p>${comillas(buena, idioma)} is written ${cuenta(n)}.</p>${respuesta(idioma, n)}`;
  }
  const orden = ordenDe(-k, 'es');
  if (/\bcoma\b/.test(buena)) {
    const ceros = decimal.startsWith('0') ? ' Cada 0 del principio de la parte decimal se lee «cero».' : '';
    if (item.sentido === 'lectura') {
      return `<p>Se lee la parte entera, «coma» y la parte decimal como un número.${ceros}</p>`
        + `<p>${n}: parte entera ${cuenta(entera)}, parte decimal ${cuenta(decimal)}.</p>${respuesta(idioma, comillas(buena, idioma))}`;
    }
    const cerosEsc = decimal.startsWith('0') ? ' Cada «cero» de después de la coma es un 0.' : '';
    return `<p>Escribe la parte entera, la coma y las cifras decimales en el orden en que se dicen.${cerosEsc}</p>`
      + `<p>${comillas(buena, idioma)} se escribe ${cuenta(n)}.</p>${respuesta(idioma, n)}`;
  }
  // Con los órdenes: la última cifra decimal da el nombre (décimas, centésimas, milésimas).
  const regla = 'El nombre del final dice cuántas cifras decimales hay: décimas, 1; centésimas, 2; milésimas, 3.';
  const conUnidades = Number(entera) > 0 || /\bunidad/.test(buena);
  const trozo = `${conUnidades ? `${cantidad(Number(entera), 0, 'es')} y ` : ''}${cantidad(Number(decimal), -k, 'es')}`;
  if (item.sentido === 'lectura') {
    return `<p>También se lee con los órdenes. ${regla}</p>`
      + `<p>${n} tiene ${k} ${plural(k, 'cifra decimal', 'cifras decimales', '', '', 'es')} (${orden}): ${cuenta(trozo)}.</p>${respuesta(idioma, comillas(buena, idioma))}`;
  }
  const relleno = decimal.startsWith('0') ? ` (con ceros delante: ${cuenta(decimal)})` : '';
  return `<p>${regla}</p>`
    + `<p>${comillas(buena, idioma)} acaba en «${buena.split(' ').pop()}»: ${k} ${plural(k, 'cifra decimal', 'cifras decimales', '', '', 'es')} detrás de la coma${relleno}. Se escribe ${cuenta(n)}.</p>${respuesta(idioma, n)}`;
}

/** Ejercicio 2 · ¿Qué vale esta cifra? (valor de una cifra y descomposición). */
export function explicaCifra(item, { idioma }) {
  const es = idioma === 'es';
  const n = num(item.d, idioma);
  const buena = item.opciones.find(o => o.correcta);
  if (item.tipo === 'valor') {
    const lugar = es ? `las ${ordenDe(item.exponente, 'es')}` : `the ${ordenDe(item.exponente, 'en')} place`;
    const valor = num(buena.valor, idioma);
    return `<p>${es ? 'Una cifra vale según el lugar que ocupa.' : 'A digit is worth what its place says.'}</p>`
      + pasos([
        es ? `El ${item.cifra} de ${n} está en ${lugar}.` : `The ${item.cifra} in ${n} is in ${lugar}.`,
        `${cuenta(`${cantidad(item.cifra, item.exponente, idioma)} = ${valor}`)}.`,
      ]) + respuesta(idioma, valor);
  }
  const s = suma(buena.terminos, idioma);
  const trozos = cifrasDe(D(item.d)).filter(c => c.cifra !== 0).map(c => cantidad(c.cifra, c.exponente, idioma));
  const lista = trozos.length > 1 ? `${trozos.slice(0, -1).join(', ')} ${es ? 'y' : 'and'} ${trozos[trozos.length - 1]}` : trozos[0];
  return `<p>${es ? 'Cada cifra vale según su lugar. La descomposición suma lo que vale cada cifra que no es 0.' : 'Each digit is worth what its place says. The breakdown adds up the values of the digits that are not 0.'}</p>`
    + `<p>${n}: ${lista}. ${es ? 'Así que' : 'So'} ${cuenta(`${n} = ${s}`)}.</p>${respuesta(idioma, s)}`;
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
      es ? `El denominador es 1 con ${k} ${plural(k, 'cero', 'ceros', '', '', idioma)}: ${cuenta(`1${'0'.repeat(k)}`)}.`
        : `The denominator is 1 with ${k} ${plural(k, '', '', 'zero', 'zeros', idioma)}: ${cuenta(`1${'0'.repeat(k)}`)}.`,
      es ? `El numerador son todas las cifras sin la coma: ${cuenta(buena.fr.n)}.` : `The numerator is all the digits without the point: ${cuenta(buena.fr.n)}.`,
    ]) + respuesta(idioma, `${n} = ${fr}`);
  }
  const j = item.d.k;
  const fr = htmlFraccion(Fr(item.fr));
  const n = num(item.d, idioma);
  const largo = String(item.fr.n).length;
  const cifras = plural(j, 'cifra', 'cifras', 'digit', 'digits', idioma);
  const relleno = largo > j ? ''
    : largo === j ? (es ? '; delante de la coma no queda nada, así que se pone un 0' : '; nothing is left in front of the point, so write a 0')
      : (es ? '; como faltan cifras, se ponen ceros delante' : '; there are not enough digits, so put zeros in front');
  const ultimo = es
    ? `Escribe las cifras del numerador y pon la coma para que ${j === 1 ? 'quede' : 'queden'} ${j} ${cifras} detrás${relleno}: ${cuenta(n)}.`
    : `Write the digits of the numerator and put the point so that there ${j === 1 ? 'is' : 'are'} ${j} ${cifras} after it${relleno}: ${cuenta(n)}.`;
  return pasos([
    es ? `Cuenta los ceros del denominador de ${fr}: ${cuenta(j)}.` : `Count the zeros in the denominator of ${fr}: ${cuenta(j)}.`,
    ultimo,
  ]) + respuesta(idioma, `${fr} = ${n}`);
}

/** Ejercicio 4 · En la recta: el valor de cada hueco y cuántos huecos hay desde la marca de salida. */
export function explicaRecta(item, { idioma }) {
  const es = idioma === 'es';
  const valor = num(item.valor, idioma);
  const desde = numN(item.desde, idioma);
  const hasta = numN(item.hasta, idioma);
  const paso = num(pasoDeRecta(item), idioma);
  const h = item.marcas;
  const trozo = cantidad(h, -item.cifras, idioma);
  const huecos = plural(h, 'hueco', 'huecos', 'gap', 'gaps', idioma);
  const segundo = item.sentido === 'leer'
    ? (es ? `El punto está ${h} ${huecos} después de ${desde}: ${desde} y ${trozo}, ${cuenta(valor)}.`
      : `The point is ${h} ${huecos} after ${desde}: ${desde} and ${trozo}, ${cuenta(valor)}.`)
    : (es ? `${valor} es ${desde} y ${trozo}: cuenta ${cuenta(`${h} ${huecos}`)} desde ${desde}.`
      : `${valor} is ${desde} and ${trozo}: count ${cuenta(`${h} ${huecos}`)} from ${desde}.`);
  return pasos([
    es ? `De ${desde} a ${hasta} hay 10 huecos iguales: cada uno vale ${cuenta(paso)}.` : `From ${desde} to ${hasta} there are 10 equal gaps: each one is ${cuenta(paso)}.`,
    segundo,
  ])
    + `<p class="consejo">${es ? `Consejo: cuenta huecos, no marcas; la marca de ${desde} no se cuenta.` : `Tip: count gaps, not marks; the mark at ${desde} does not count.`}</p>`
    + respuesta(idioma, valor);
}
