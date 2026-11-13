// «No lo sé» de «Compara, ordena y redondea»: la explicación de cada ejercicio, con los números del ítem.
// La regla va delante, después el paso a paso y al final la respuesta, explícita y una sola vez (el feedback
// de logica.js, `explicar*`, acaba con la misma frase que la respuesta, así que aquí se escribe aparte).
// Funciones puras; se prueban en `tests/practicas-ayuda-compara-decimales.test.js`.

import { aTexto, decimal, comparar, truncar, ORDENES } from '../_comun/decimales.js';
import { simboloComparar, ordenCorrecto, ejemploEntre, redondeoBueno, cifraSiguiente, haceArrastre } from './logica.js';

const D = ({ m, k }) => decimal(m, k);
const cuenta = x => `<span class="cuenta">${x}</span>`;
const pasos = lista => `<ol class="pasos-ayuda">${lista.map(p => `<li>${p}</li>`).join('')}</ol>`;
const respuesta = (idioma, x) => `<p><strong>${idioma === 'en' ? 'The answer is' : 'La respuesta es'} ${x}.</strong></p>`;
const SIGNOS = { '<': '&lt;', '=': '=', '>': '&gt;' };
const H = c => (c < 0 ? '&lt;' : c > 0 ? '&gt;' : '=');
const orden = (exponente, idioma) => ORDENES[exponente][idioma];
const parteEntera = x => Math.floor(Math.abs(x.m) / 10 ** x.k);

/**
 * Dos positivos: dónde se deciden. { entera: true } si ya decide la parte entera; si no, la primera cifra
 * decimal distinta (con las mismas cifras decimales): { exponente, ca, cb }.
 */
function dondeSeDecide(a, b) {
  if (parteEntera(a) !== parteEntera(b)) return { entera: true };
  const k = Math.max(a.k, b.k);
  const da = String(Math.abs(a.conCifras(k).m)).padStart(k + 1, '0').slice(-k);
  const db = String(Math.abs(b.conCifras(k).m)).padStart(k + 1, '0').slice(-k);
  for (let i = 0; i < k; i++) if (da[i] !== db[i]) return { exponente: -(i + 1), ca: da[i], cb: db[i] };
  return null;
}

/** «8,6 = 8,600» de los que cambian de escritura al ponerles las mismas cifras decimales ('' si ninguno). */
function igualadas(lista, idioma) {
  const k = Math.max(...lista.map(x => x.k));
  return lista.filter(x => x.k !== k).map(x => `${aTexto(x, idioma)} = ${aTexto(x, idioma, k)}`).join(idioma === 'es' ? ' y ' : ' and ');
}

/**
 * La comparación de dos positivos distintos, en una frase con sus números. Con `conclusion`, acaba con
 * «así que A < B» (hace falta cuando no es la respuesta: los negativos); si no, eso lo dice la respuesta.
 */
function comparaPositivos(a, b, idioma, conclusion = false) {
  const es = idioma === 'es';
  const A = aTexto(a, idioma), B = aTexto(b, idioma);
  const s = H(comparar(a, b));
  const fin = conclusion ? (es ? `, así que ${A} ${s} ${B}` : `, so ${A} ${s} ${B}`) : '';
  const donde = dondeSeDecide(a, b);
  if (donde.entera) {
    return es ? `La parte entera ya decide: ${cuenta(`${parteEntera(a)} ${s} ${parteEntera(b)}`)}${fin}.`
      : `The whole part already decides: ${cuenta(`${parteEntera(a)} ${s} ${parteEntera(b)}`)}${fin}.`;
  }
  const iguales = igualadas([a, b], idioma);
  const primero = iguales ? `${cuenta(iguales)}. ` : '';
  return es
    ? `${primero}La parte entera es igual; la primera cifra distinta es la de las ${orden(donde.exponente, 'es')}: ${cuenta(`${donde.ca} ${s} ${donde.cb}`)}${fin}.`
    : `${primero}The whole part is the same; the first different digit is in the ${orden(donde.exponente, 'en')}: ${cuenta(`${donde.ca} ${s} ${donde.cb}`)}${fin}.`;
}

/** Ejercicio 1 · ¿Cuál es mayor? */
export function explicaComparar(item, { idioma }) {
  const es = idioma === 'es';
  const a = D(item.a), b = D(item.b);
  const A = aTexto(a, idioma), B = aTexto(b, idioma);
  const final = respuesta(idioma, `${A} ${SIGNOS[simboloComparar(item)]} ${B}`);
  if (comparar(a, b) === 0) {
    return `<p>${es ? 'Los ceros del final de la parte decimal no cambian el valor.' : 'Zeros at the end of the decimal part do not change the value.'}</p>`
      + `<p>${es ? `${A} y ${B} solo se diferencian en ceros del final: valen lo mismo.` : `${A} and ${B} only differ in zeros at the end: they are equal.`}</p>${final}`;
  }
  if (a.m < 0 && b.m < 0) {
    const s = H(comparar(a.abs(), b.abs()));
    const lejos = aTexto(comparar(a.abs(), b.abs()) > 0 ? a : b, idioma);
    return `<p>${es ? 'Entre dos negativos, es menor el que está más lejos del 0.' : 'Between two negatives, the one farther from 0 is less.'}</p>`
      + pasos([
        `${es ? 'Sin el signo' : 'Without the sign'}: ${comparaPositivos(a.abs(), b.abs(), idioma, true)}`,
        es ? `${lejos} está más lejos del 0: es el menor.` : `${lejos} is farther from 0: it is the lesser one.`,
      ]) + final;
  }
  if (a.m < 0 || b.m < 0) {
    const [neg, pos] = a.m < 0 ? [A, B] : [B, A];
    return `<p>${es ? 'Todo negativo es menor que cualquier positivo.' : 'Every negative number is less than any positive one.'}</p>`
      + `<p>${es ? `${neg} es negativo y ${pos} es positivo.` : `${neg} is negative and ${pos} is positive.`}</p>${final}`;
  }
  return `<p>${es ? 'Se compara cifra a cifra desde la izquierda, con las mismas cifras decimales (ceros a la derecha).'
    : 'Compare digit by digit from the left, with the same number of decimal places (zeros on the right).'}</p>`
    + `<p>${comparaPositivos(a, b, idioma)}</p>${final}`;
}

/** Ejercicio 2 · Ordena: todos con las mismas cifras decimales, el orden con esa escritura y la respuesta. */
export function explicaOrden(item, { idioma }) {
  const es = idioma === 'es';
  const vals = item.vals.map(D);
  const k = Math.max(...vals.map(v => v.k));
  const sep = es ? '; ' : ', ';
  const buena = ordenCorrecto(item);
  const signo = item.creciente ? ' &lt; ' : ' &gt; ';
  const negativos = vals.filter(v => v.m < 0).length;
  const reglas = [es ? 'Pon a todos las mismas cifras decimales con ceros a la derecha y compáralos cifra a cifra.'
    : 'Give all of them the same number of decimal places with zeros on the right and compare them digit by digit.'];
  if (negativos > 0 && negativos < vals.length) reglas.push(es ? 'Los negativos son menores que los positivos.' : 'Negatives are less than positives.');
  if (negativos > 1) reglas.push(es ? 'Entre negativos, es menor el que está más lejos del 0.' : 'Among negatives, the one farther from 0 is less.');
  const sentido = es ? (item.creciente ? 'De menor a mayor' : 'De mayor a menor') : (item.creciente ? 'From smallest to largest' : 'From largest to smallest');
  return `<p>${reglas.join(' ')}</p>`
    + pasos([
      `${es ? 'Con' : 'With'} ${k} ${es ? (k === 1 ? 'cifra decimal' : 'cifras decimales') : (k === 1 ? 'decimal place' : 'decimal places')}: ${vals.map(v => aTexto(v, idioma, k)).join(sep)}.`,
      `${sentido}: ${cuenta(buena.map(i => aTexto(vals[i], idioma, k)).join(signo))}.`,
    ])
    + respuesta(idioma, buena.map(i => aTexto(vals[i], idioma)).join(signo));
}

/** Ejercicio 3 · Entre dos. En «escribe» la respuesta es un ejemplo: vale cualquier número entre los dos. */
export function explicaEntre(item, { idioma }) {
  const es = idioma === 'es';
  const a = D(item.a), b = D(item.b);
  const A = aTexto(a, idioma), B = aTexto(b, idioma);
  const kc = Math.max(a.k, b.k) + 1;
  const A2 = aTexto(a, idioma, kc), B2 = aTexto(b, idioma, kc);
  const ej = ejemploEntre(item);
  const regla = es ? 'Escribe los dos con una cifra decimal más de las que tiene el más largo: así se ven los números que hay entre ellos.'
    : 'Write both with one more decimal place than the longer one has: then you can see the numbers between them.';
  const conCifra = es ? `${cuenta(`${A} = ${A2}`)} y ${cuenta(`${B} = ${B2}`)}` : `${cuenta(`${A} = ${A2}`)} and ${cuenta(`${B} = ${B2}`)}`;
  if (item.modo === 'elige') {
    const E = aTexto(ej, idioma), E2 = aTexto(ej, idioma, kc);
    return `<p>${regla}</p>`
      + `<p>${conCifra}; ${es ? `${E} está entre los dos` : `${E} is between them`}: ${cuenta(`${A2} &lt; ${E2} &lt; ${B2}`)}.</p>`
      + respuesta(idioma, E);
  }
  const mA = a.conCifras(kc).m, mB = b.conCifras(kc).m;
  const primero = aTexto(decimal(mA + 1, kc).normalizar(), idioma);
  const segundo = aTexto(decimal(mA + 2, kc).normalizar(), idioma);
  const ultimo = aTexto(decimal(mB - 1, kc).normalizar(), idioma);
  const lista = (es ? `${primero}; ${segundo}; …; ${ultimo}` : `${primero}, ${segundo}, …, ${ultimo}`);
  return `<p>${regla}</p>`
    + `<p>${conCifra}; ${es ? 'entre ellos están' : 'between them there are'} ${lista}. ${es ? 'Vale cualquiera, y también otros con más cifras.' : 'Any of them is fine, and so are others with more digits.'}</p>`
    + respuesta(idioma, es ? `${aTexto(ej, idioma)}, por ejemplo (o cualquier otro número entre ${A} y ${B})` : `${aTexto(ej, idioma)}, for example (or any other number between ${A} and ${B})`);
}

/** Ejercicio 4 · Redondea: qué cifras se dejan, la cifra siguiente y qué le pasa a la última. */
export function explicaRedondeo(item, { idioma }) {
  const es = idioma === 'es';
  const d = D(item.d), c = item.c;
  const R = aTexto(redondeoBueno(item), idioma);
  const sig = cifraSiguiente(d, c);
  const hasta = orden(-c, idioma);
  const siguiente = orden(-(c + 1), idioma);
  const dejadas = truncar(d, c);
  const ultima = Math.abs(dejadas.m) % 10;
  const arrastra = haceArrastre(item.d, c);
  const regla = es
    ? 'Mira solo la cifra siguiente a la última que dejas: con 5 o más, la última sube 1; con 4 o menos, se queda.'
    : 'Look only at the digit after the last one you keep: with 5 or more, the last one goes up by 1; with 4 or less, it stays.';
  const queda = sig < 5
    ? (es ? `es 4 o menos, así que el ${ultima} se queda.` : `it is 4 or less, so the ${ultima} stays.`)
    : arrastra
      ? (es ? 'es 5 o más: el 9 sube a 10, así que se escribe 0 y se lleva 1.' : 'it is 5 or more: the 9 goes up to 10, so write 0 and carry 1.')
      : (es ? `es 5 o más, así que el ${ultima} sube a ${ultima + 1}.` : `it is 5 or more, so the ${ultima} goes up to ${ultima + 1}.`);
  // 7,96 a la décima es 8,0: el ejercicio pide exactamente c cifras decimales.
  const cero = arrastra && c > 0 ? (es ? ' El 0 del final no se quita.' : ' Do not drop the final 0.') : '';
  const D0 = cuenta(aTexto(dejadas, idioma));
  const conCifras = es ? `Con ${c} ${c === 1 ? 'cifra decimal' : 'cifras decimales'}, se deja` : `With ${c} decimal ${c === 1 ? 'place' : 'places'}, keep`;
  const primero = item.consigna === 'cifras'
    ? `${conCifras} ${es ? 'hasta las' : 'up to the'} ${hasta}: ${D0}.`
    : (es ? `Se deja hasta las ${hasta}: ${D0}.` : `Keep up to the ${hasta}: ${D0}.`);
  return `<p>${regla}</p>`
    + pasos([
      primero,
      es ? `La siguiente, la de las ${siguiente}, es ${cuenta(sig)}: ${queda}${cero}` : `The next one, in the ${siguiente}, is ${cuenta(sig)}: ${queda}${cero}`,
    ])
    + respuesta(idioma, R);
}
