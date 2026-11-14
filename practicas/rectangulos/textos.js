// Práctica «Divisores por parejas con rectángulos»: textos propios, siempre
// { es, en }. Los comunes (Comprobar, Siguiente, ¡Bien!…) están en
// `../_comun/textos.js` y llegan a `montar` en `api.t`.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md): «divisor», no
// «factor»; producto con «·», nunca «×»; inglés sencillo; el feedback dice
// qué pasa con LOS NÚMEROS DE ESE ÍTEM; el 0 es múltiplo de todo número y el
// 1 es divisor de todo número.

export const TX = {
  rect: {
    nombre: { es: 'Descubre los rectángulos', en: 'Discover the rectangles' },
    detalle: { es: 'Encuentra todas las parejas de divisores', en: 'Find every pair of divisors' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Buscar los divisores de un número es buscar rectángulos de esa área con lados
        enteros. Elige un ancho: si el rectángulo se cierra justo, has encontrado una
        pareja de divisores.</p>
        <p>Cuando creas que las tienes todas, pulsa <strong>«Ya están todas»</strong>. No
        hace falta seguir más allá de la raíz entera: a partir de ahí las parejas se
        repiten al revés.</p>`,
      en: `<h2>How it works</h2>
        <p>Finding the divisors of a number is finding rectangles of that area with whole
        sides. Choose a width: if the rectangle closes exactly, you have found a pair of
        divisors.</p>
        <p>When you think you have found them all, press <strong>“They're all there”</strong>.
        You do not need to go past the square root of the number (forget the decimals): after that the pairs repeat
        the other way round.</p>`,
    },
    instruccion: { es: n => `El <strong>área es ${n}</strong>. Elige un ancho y mira si el rectángulo se cierra.`, en: n => `The <strong>area is ${n}</strong>. Choose a width and see if the rectangle closes.` },
    ancho: { es: 'Ancho', en: 'Width' },
    sobran: { es: (w, faltan, n) => `Con ancho ${w} ${faltan === 1 ? 'falta' : 'faltan'} ${faltan} ${faltan === 1 ? 'celda' : 'celdas'} (${faltan === 1 ? 'la tachada' : 'las tachadas'}) para cerrar el rectángulo: ${w} no es divisor de ${n}.`, en: (w, faltan, n) => `With width ${w}, ${faltan} ${faltan === 1 ? 'cell is' : 'cells are'} missing (the crossed-out ${faltan === 1 ? 'one' : 'ones'}) to close the rectangle: ${w} is not a divisor of ${n}.` },
    encontradas: { es: 'Parejas encontradas', en: 'Pairs found' },
    ninguna_todavia: { es: 'Todavía ninguna.', en: 'None yet.' },
    ya_todas: { es: 'Ya están todas', en: "They're all there" },
    correcto: { es: n => `¡Eso es! Esas son todas las parejas de divisores de ${n}.`, en: n => `That's it! Those are all the pairs of divisors of ${n}.` },
    faltan: { es: 'Faltan estas parejas:', en: 'These pairs are missing:' },
    el_uno_y_el_propio: { es: 'El 1 y el propio número siempre son divisores.', en: 'The number 1 and the number itself are always divisors.' },
    se_para_en: {
      es: (r, n) => `Y no hacía falta seguir más allá del ${r}: <span class="cuenta">${r} · ${r} = ${r * r}</span> ≤ ${n} < <span class="cuenta">${r + 1} · ${r + 1} = ${(r + 1) * (r + 1)}</span>; a partir de ahí las parejas se repiten al revés.`,
      en: (r, n) => `And there was no need to go past ${r}: <span class="cuenta">${r} · ${r} = ${r * r}</span> ≤ ${n} < <span class="cuenta">${r + 1} · ${r + 1} = ${(r + 1) * (r + 1)}</span>; after that the pairs repeat the other way round.`,
    },
  },
  banco: {
    nombre: { es: 'Sin dibujo: las parejas', en: 'No drawing: the pairs' },
    detalle: { es: 'Toca los divisores en el banco de números', en: 'Tap the divisors in the number bank' },
    instruccion: { es: n => `Toca <strong>todos los divisores de ${n}</strong> y nada más.`, en: n => `Tap <strong>every divisor of ${n}</strong>, and nothing else.` },
    division_resto: { es: (n, x, c, r) => `${n} : ${x} = ${c}, resto ${r}`, en: (n, x, c, r) => `${n} : ${x} = ${c}, remainder ${r}` },
    acierto: { es: n => `¡Correcto! Esos son todos los divisores de ${n}.`, en: n => `Correct! Those are all the divisors of ${n}.` },
    el_uno_y_el_propio: { es: 'El 1 y el propio número siempre son divisores.', en: 'The number 1 and the number itself are always divisors.' },
    falta: { es: d => `Te faltó el ${d}: sí es divisor.`, en: d => `You missed ${d}: it is a divisor.` },
  },
  parar: {
    nombre: { es: '¿Dónde se para?', en: 'Where do you stop?' },
    detalle: { es: 'Hasta dónde hay que probar para tener todos los divisores', en: 'How far you must try to find every divisor' },
    pregunta: { es: n => `Para encontrar todos los divisores de ${n} por parejas, ¿<strong>hasta qué número</strong> hay que probar?`, en: n => `To find all the divisors of ${n} in pairs, <strong>up to which number</strong> do you have to try?` },
    correcto: { es: (r, n) => `Correcto: <span class="cuenta">${r} · ${r} = ${r * r}</span> ≤ ${n} < <span class="cuenta">${r + 1} · ${r + 1} = ${(r + 1) * (r + 1)}</span>; a partir de ${r + 1} las parejas se repiten al revés.`, en: (r, n) => `Correct: <span class="cuenta">${r} · ${r} = ${r * r}</span> ≤ ${n} < <span class="cuenta">${r + 1} · ${r + 1} = ${(r + 1) * (r + 1)}</span>; from ${r + 1} on, the pairs repeat the other way round.` },
    incorrecto: { es: (elegido, r, n) => `${elegido} no es el número. Hay que probar hasta ${r}: <span class="cuenta">${r} · ${r} = ${r * r}</span> ≤ ${n} < <span class="cuenta">${r + 1} · ${r + 1} = ${(r + 1) * (r + 1)}</span>.`, en: (elegido, r, n) => `${elegido} is not the number. You must try up to ${r}: <span class="cuenta">${r} · ${r} = ${r * r}</span> ≤ ${n} < <span class="cuenta">${r + 1} · ${r + 1} = ${(r + 1) * (r + 1)}</span>.` },
  },
  cuadrado: {
    pregunta: { es: (n, r) => `${n} = ${r} · ${r}. ¿<strong>Cuántas veces se escribe el ${r}</strong> en la lista de divisores de ${n}?`, en: (n, r) => `${n} = ${r} · ${r}. <strong>How many times is ${r} written</strong> in the list of divisors of ${n}?` },
    correcto: { es: (n, r) => `Correcto: en ${n} = ${r} · ${r}, la pareja central es la misma por los dos lados, así que ${r} solo se escribe una vez en la lista de divisores.`, en: (n, r) => `Correct: in ${n} = ${r} · ${r}, the middle pair is the same on both sides, so ${r} is written only once in the list of divisors.` },
    incorrecto: { es: (n, r) => `No es correcto: en ${n} = ${r} · ${r}, la pareja central es la misma por los dos lados, así que ${r} se escribe una sola vez en la lista de divisores de ${n}.`, en: (n, r) => `Not correct: in ${n} = ${r} · ${r}, the middle pair is the same on both sides, so ${r} is written only once in the list of divisors of ${n}.` },
  },
};

// ─── «No lo sé» (tarea 183): la explicación de cada ejercicio ─────────────────────────────────────

import { todasLasClaves, raizEntera } from './logica.js';

export const NO_SE_HACERLO = { es: 'No sé hacerlo', en: 'I don’t know how' };

const cuenta = texto => `<span class="cuenta">${texto}</span>`;
const pasos = lista => `<ol class="pasos-ayuda">${lista.map(p => `<li>${p}</li>`).join('')}</ol>`;
const textoPareja = clave => clave.split('x').join(' · ');
const unir = (lista, idioma) => (lista.length < 2 ? lista.join('') : `${lista.slice(0, -1).join(', ')}${idioma === 'es' ? ' y ' : ' and '}${lista.at(-1)}`);

/** Las parejas de divisores de n, con la cuenta de cada una: «1 · 12 = 12; 2 · 6 = 12». */
function parejasConCuenta(n) {
  return todasLasClaves(n).map(c => cuenta(`${textoPareja(c)} = ${n}`)).join('; ');
}

/** Ejercicio 1: se prueban los anchos hasta la raíz entera; cada uno que cierra da una pareja. */
export function explicaRectangulos(item, { idioma }) {
  const es = idioma === 'es';
  const n = item.n, r = raizEntera(n);
  const claves = todasLasClaves(n);
  const prueba = es
    ? `Prueba los anchos 1, 2, 3… hasta el ${r}: ${cuenta(`${r} · ${r} = ${r * r}`)} ≤ ${n} < ${cuenta(`${r + 1} · ${r + 1} = ${(r + 1) * (r + 1)}`)}, así que no hace falta seguir.`
    : `Try widths 1, 2, 3… up to ${r}: ${cuenta(`${r} · ${r} = ${r * r}`)} ≤ ${n} < ${cuenta(`${r + 1} · ${r + 1} = ${(r + 1) * (r + 1)}`)}, so you do not need to go on.`;
  const cierran = es
    ? `El rectángulo se cierra con los anchos que dividen ${n}, y cada uno da una pareja: ${parejasConCuenta(n)}.`
    : `The rectangle closes with the widths that divide ${n}, and each one gives a pair: ${parejasConCuenta(n)}.`;
  const fin = es
    ? `La respuesta son ${claves.length} ${claves.length === 1 ? 'pareja' : 'parejas'}: ${claves.map(c => cuenta(textoPareja(c))).join(', ')}.`
    : `The answer is ${claves.length} ${claves.length === 1 ? 'pair' : 'pairs'}: ${claves.map(c => cuenta(textoPareja(c))).join(', ')}.`;
  return `${pasos([prueba, cierran])}${fin}`;
}

/** Ejercicio 2: los divisores salen por parejas; los del banco son los que dividen n sin resto. */
export function explicaBanco(item, { idioma }) {
  const es = idioma === 'es';
  const n = item.n;
  const regla = es
    ? `Un divisor de ${n} es un número que lo divide sin resto. Se buscan por parejas: ${parejasConCuenta(n)}.`
    : `A divisor of ${n} is a number that divides it with no remainder. You find them in pairs: ${parejasConCuenta(n)}.`;
  const fin = es
    ? `La respuesta es: ${unir(item.divisoresN, idioma)}.`
    : `The answer is: ${unir(item.divisoresN, idioma)}.`;
  const consejo = es ? ' Consejo: el 1 y el propio número siempre son divisores.' : ' Tip: 1 and the number itself are always divisors.';
  return `<p>${regla}</p><p>${fin}${consejo}</p>`;
}

/** El feedback de acierto empieza con «Correcto:»; en la ayuda no se felicita a nadie. */
const sinFelicitar = texto => {
  const resto = texto.replace(/^(Correcto|Correct): /, '');
  return resto.charAt(0).toUpperCase() + resto.slice(1);
};

/** Ejercicio 3: hasta dónde se prueba (la raíz entera), o cuántas veces se escribe la raíz exacta (una). */
export function explicaParar(item, { idioma, tt }) {
  const es = idioma === 'es';
  if (item.tipo === 'cuadrado') {
    const fin = es ? 'La respuesta es 1.' : 'The answer is 1.';
    return `<p>${sinFelicitar(TX.cuadrado.correcto[idioma](item.n, item.r))}</p><p>${fin}</p>`;
  }
  const regla = es
    ? `Se prueban los números 1, 2, 3… hasta que su cuadrado pase de ${item.n}.`
    : `You try the numbers 1, 2, 3… until their square is bigger than ${item.n}.`;
  const fin = es ? `La respuesta es ${item.solucion}.` : `The answer is ${item.solucion}.`;
  return `<p>${regla}</p><p>${sinFelicitar(TX.parar.correcto[idioma](item.solucion, item.n))}</p><p>${fin}</p>`;
}
