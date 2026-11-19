// Práctica «Razones y proporciones» (PU2, tarea 212): textos propios, siempre { es, en }, los enunciados y el
// feedback con los números del ítem, y las explicaciones del botón «No lo sé». Todo puro (se prueba sin navegador).
// Las razones se escriben como fracción (htmlFraccion), nunca «2 : 3»; los productos, con «·».

import { fraccion, htmlCuenta, htmlFraccion, htmlRaya } from '../_comun/fracciones.js';
import { mcd } from '../_comun/aritmetica.js';
import { buenaRazon, gruposRazon, factorDe } from './logica.js';

const fr = (n, d) => htmlFraccion(fraccion(n, d), { compacta: true, conUno: true });
const cuenta = t => `<span class="cuenta">${t}</span>`;
const lista = pasos => `<ol class="pasos-ayuda">${pasos.map(p => `<li>${p}</li>`).join('')}</ol>`;
const dos = (es, en, idioma) => (idioma === 'es' ? es : en);
const nombre = (g, n, idioma) => `${n} ${g[idioma][n === 1 ? 0 : 1]}`;
const GCD = { es: 'm.c.d.', en: 'GCD' };

// ─── Contextos del ejercicio 1 (por cada) ──────────────────────────────────────

export const CONTEXTOS_RAZON = {
  clase: {
    g: [{ es: ['chico', 'chicos'], en: ['boy', 'boys'] }, { es: ['chica', 'chicas'], en: ['girl', 'girls'] }],
    enun: { es: 'En una clase hay {A} por cada {B}.', en: 'In a class there are {A} for every {B}.' },
    todo: { es: 'los alumnos de la clase', en: 'the pupils in the class' }, unidad: { es: 'alumnos', en: 'pupils' },
  },
  limonada: {
    g: [{ es: ['vaso de zumo', 'vasos de zumo'], en: ['glass of juice', 'glasses of juice'] }, { es: ['vaso de agua', 'vasos de agua'], en: ['glass of water', 'glasses of water'] }],
    enun: { es: 'Para hacer limonada se mezclan {A} por cada {B}.', en: 'To make lemonade you mix {A} for every {B}.' },
    todo: { es: 'los vasos de la mezcla', en: 'the glasses in the mix' }, unidad: { es: 'vasos', en: 'glasses' },
  },
  bolsa: {
    g: [{ es: ['bola roja', 'bolas rojas'], en: ['red ball', 'red balls'] }, { es: ['bola azul', 'bolas azules'], en: ['blue ball', 'blue balls'] }],
    enun: { es: 'En una bolsa hay {A} por cada {B}.', en: 'In a bag there are {A} for every {B}.' },
    todo: { es: 'las bolas de la bolsa', en: 'the balls in the bag' }, unidad: { es: 'bolas', en: 'balls' },
  },
  partidos: {
    g: [{ es: ['partido ganado', 'partidos ganados'], en: ['game won', 'games won'] }, { es: ['partido perdido', 'partidos perdidos'], en: ['game lost', 'games lost'] }],
    enun: { es: 'Un equipo tiene {A} por cada {B}, sin empates.', en: 'A team has {A} for every {B}, with no draws.' },
    todo: { es: 'los partidos jugados', en: 'the games played' }, unidad: { es: 'partidos', en: 'games' },
  },
  frutero: {
    g: [{ es: ['manzana', 'manzanas'], en: ['apple', 'apples'] }, { es: ['pera', 'peras'], en: ['pear', 'pears'] }],
    enun: { es: 'En un frutero hay {A} por cada {B}.', en: 'In a fruit bowl there are {A} for every {B}.' },
    todo: { es: 'las frutas del frutero', en: 'the fruit in the bowl' }, unidad: { es: 'frutas', en: 'pieces of fruit' },
  },
  refugio: {
    g: [{ es: ['perro', 'perros'], en: ['dog', 'dogs'] }, { es: ['gato', 'gatos'], en: ['cat', 'cats'] }],
    enun: { es: 'En un refugio hay {A} por cada {B}.', en: 'In a shelter there are {A} for every {B}.' },
    todo: { es: 'los animales del refugio', en: 'the animals in the shelter' }, unidad: { es: 'animales', en: 'animals' },
  },
};

// ─── Contextos del ejercicio 2 (b): la razón más sencilla ──────────────────────

export const CONTEXTOS_SENCILLA_TX = {
  clase: { x: { es: 'chicos', en: 'boys' }, y: { es: 'chicas', en: 'girls' }, enun: { es: 'En una clase hay {a} chicos y {b} chicas.', en: 'In a class there are {a} boys and {b} girls.' } },
  azucar: { x: { es: 'azúcar', en: 'sugar' }, y: { es: 'harina', en: 'flour' }, enun: { es: 'Una receta lleva {a} g de azúcar por cada {b} g de harina.', en: 'A recipe uses {a} g of sugar for every {b} g of flour.' } },
  bolsa: { x: { es: 'bolas rojas', en: 'red balls' }, y: { es: 'bolas azules', en: 'blue balls' }, enun: { es: 'En una bolsa hay {a} bolas rojas y {b} bolas azules.', en: 'In a bag there are {a} red balls and {b} blue balls.' } },
  zumo: { x: { es: 'zumo', en: 'juice' }, y: { es: 'agua', en: 'water' }, enun: { es: 'Una jarra de refresco lleva {a} mL de zumo y {b} mL de agua.', en: 'A jug of drink has {a} mL of juice and {b} mL of water.' } },
  concierto: { x: { es: 'adultos', en: 'adults' }, y: { es: 'niños', en: 'children' }, enun: { es: 'En un concierto hay {a} adultos y {b} niños.', en: 'At a concert there are {a} adults and {b} children.' } },
  biblioteca: { x: { es: 'libros de cuentos', en: 'story books' }, y: { es: 'libros de cómic', en: 'comic books' }, enun: { es: 'En una biblioteca hay {a} libros de cuentos y {b} libros de cómic.', en: 'In a library there are {a} story books and {b} comic books.' } },
};

// ─── Introducciones (con un ejemplo resuelto) ──────────────────────────────────

export const TX = {
  razon: {
    nombre: { es: 'La razón', en: 'Write the ratio' },
    detalle: { es: 'De «por cada» a una fracción', en: 'From “for every” to a fraction' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Una <strong>razón</strong> compara dos cantidades. En una clase hay <strong>2 chicos por cada 3 chicas</strong>.</p>
        <p>La razón de chicos a chicas compara una parte con la otra: ${fr(2, 3)}.</p>
        <p>Para la fracción de la clase que son chicos hay que contar todos: 2 + 3 = 5, y son ${fr(2, 5)}.</p>`,
      en: `<h2>How it works</h2>
        <p>A <strong>ratio</strong> compares two quantities. In a class there are <strong>2 boys for every 3 girls</strong>.</p>
        <p>The ratio of boys to girls compares one part with the other: ${fr(2, 3)}.</p>
        <p>For the fraction of the class that are boys you must count everybody: 2 + 3 = 5, so it is ${fr(2, 5)}.</p>`,
    },
    elige: { es: 'Elige la fracción correcta', en: 'Choose the right fraction' },
  },
  equi: {
    nombre: { es: 'Equivalentes y la más sencilla', en: 'Equivalent ratios and simplest form' },
    detalle: { es: 'Mismo valor, otros términos', en: 'Same value, different terms' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Dos razones son <strong>equivalentes</strong> si valen lo mismo. Se multiplican (o se dividen) los dos términos por el mismo número: ${htmlCuenta([fraccion(3, 4), '=', fraccion(9, 12)])} (por 3).</p>
        <p>Sumar el mismo número arriba y abajo no vale: ${fr(3, 4)} no es ${fr(5, 6)}.</p>
        <p>Para escribir la razón <strong>más sencilla</strong> se divide entre el m.c.d.: el m.c.d. de 18 y 12 es 6, y ${htmlCuenta([fraccion(18, 12), '=', fraccion(3, 2)])}.</p>`,
      en: `<h2>How it works</h2>
        <p>Two ratios are <strong>equivalent</strong> if they have the same value. Multiply (or divide) both terms by the same number: ${htmlCuenta([fraccion(3, 4), '=', fraccion(9, 12)])} (by 3).</p>
        <p>Adding the same number to the top and the bottom does not work: ${fr(3, 4)} is not ${fr(5, 6)}.</p>
        <p>To write the <strong>simplest</strong> ratio, divide by the GCD: the GCD of 18 and 12 is 6, and ${htmlCuenta([fraccion(18, 12), '=', fraccion(3, 2)])}.</p>`,
    },
  },
  prop: {
    nombre: { es: '¿Forman proporción?', en: 'Do they form a proportion?' },
    detalle: { es: 'Con los productos cruzados', en: 'With cross products' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Dos razones forman una <strong>proporción</strong> si valen lo mismo. Se comprueba con los <strong>productos cruzados</strong>.</p>
        <p>${fr(6, 8)} y ${fr(9, 12)}: ${cuenta('6 · 12 = 72')} y ${cuenta('8 · 9 = 72')}. Son iguales: sí forman proporción.</p>`,
      en: `<h2>How it works</h2>
        <p>Two ratios form a <strong>proportion</strong> if they have the same value. Check it with the <strong>cross products</strong>.</p>
        <p>${fr(6, 8)} and ${fr(9, 12)}: ${cuenta('6 · 12 = 72')} and ${cuenta('8 · 9 = 72')}. They are equal: they form a proportion.</p>`,
    },
    si: { es: 'Sí, forman proporción', en: 'Yes, they form a proportion' },
    no: { es: 'No forman proporción', en: 'No, they do not form a proportion' },
    instruccion: { es: '¿Forman proporción estas dos razones?', en: 'Do these two ratios form a proportion?' },
  },
  term: {
    nombre: { es: 'El término que falta', en: 'The missing term' },
    detalle: { es: 'Halla la x con productos cruzados', en: 'Find x with cross products' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>En una proporción, los productos cruzados son iguales. Para ${htmlCuenta([fraccion(3, 4), '=', 'x/20'])}:</p>
        <p>${cuenta('3 · 20 = 4 · x')}, es decir, ${cuenta('60 = 4x')}, y ${cuenta('x = 60 : 4 = 15')}.</p>`,
      en: `<h2>How it works</h2>
        <p>In a proportion the cross products are equal. For ${htmlCuenta([fraccion(3, 4), '=', 'x/20'])}:</p>
        <p>${cuenta('3 · 20 = 4 · x')}, that is, ${cuenta('60 = 4x')}, and ${cuenta('x = 60 : 4 = 15')}.</p>`,
    },
    instruccion: { es: 'Escribe el valor de <strong>x</strong>', en: 'Write the value of <strong>x</strong>' },
    nombreCampo: { es: 'Valor de x', en: 'Value of x' },
  },
  sencilla: {
    arriba: { es: 'Numerador', en: 'Numerator' },
    abajo: { es: 'Denominador', en: 'Denominator' },
  },
};

// ─── Ejercicio 1 ───────────────────────────────────────────────────────────────

const sustituir = (plantilla, valores) => plantilla.replace(/\{(\w+)\}/g, (_, k) => valores[k]);

/** Los textos del ítem: la situación, la pregunta y los nombres de los grupos. */
function datosRazon(it, idioma) {
  const c = CONTEXTOS_RAZON[it.ctx];
  const [g1, g2] = c.g;
  const situacion = sustituir(c.enun[idioma], { A: nombre(g1, it.a, idioma), B: nombre(g2, it.b, idioma) });
  const gx = it.sujeto === 0 ? g1 : g2, gy = it.sujeto === 0 ? g2 : g1;
  const X = gx[idioma][1], Y = gy[idioma][1];
  return { c, situacion, gx, gy, X, Y };
}

export function enunciadoRazon(it, { idioma }) {
  const { c, situacion, X, Y } = datosRazon(it, idioma);
  const pregunta = it.pregunta === 'parte-parte'
    ? dos(`¿Cuál es la razón del número de ${X} al de ${Y}?`, `What is the ratio of the number of ${X} to the number of ${Y}?`, idioma)
    : dos(`¿Qué fracción de ${c.todo.es} son ${X}?`, `What fraction of ${c.todo.en} are ${X}?`, idioma);
  return `<p class="instruccion">${situacion}</p><p class="instruccion">${pregunta}</p>`;
}

export function feedbackRazon(it, error, idioma) {
  const { c, gx, gy, X, Y } = datosRazon(it, idioma);
  const { x, y, total } = gruposRazon(it);
  const parte = it.pregunta === 'parte-parte';
  const bien = parte ? fr(x, y) : fr(x, total);
  const hay = dos(`Hay ${nombre(gx, x, 'es')} por cada ${nombre(gy, y, 'es')}`, `There are ${nombre(gx, x, 'en')} for every ${nombre(gy, y, 'en')}`, idioma);
  const base = parte
    ? dos(`${hay}: la razón de ${X} a ${Y} es ${bien}.`, `${hay}: the ratio of ${X} to ${Y} is ${bien}.`, idioma)
    : dos(`${hay}. De cada ${cuenta(`${x} + ${y} = ${total}`)} ${c.unidad.es}, ${x} son ${X}: la fracción es ${bien}.`,
      `${hay}. Out of every ${cuenta(`${x} + ${y} = ${total}`)} ${c.unidad.en}, ${x} are ${X}: the fraction is ${bien}.`, idioma);
  const aparte = {
    'invertir-razon': parte
      ? dos(`Al revés: se pide ${X} a ${Y}, así que ${x} va arriba y ${y} abajo.`, `The wrong way round: it asks for ${X} to ${Y}, so ${x} goes on top and ${y} below.`, idioma)
      : dos(`Al revés: la parte (${x}) va arriba y el total (${total}) abajo.`, `The wrong way round: the part (${x}) goes on top and the total (${total}) below.`, idioma),
    'parte-parte-como-parte-todo': dos(`${fr(x, total)} compara ${X} con el total; se pide ${X} con ${Y}.`, `${fr(x, total)} compares ${X} with the total; it asks for ${X} with ${Y}.`, idioma),
    'parte-todo-como-parte-parte': dos(`${fr(x, y)} compara ${X} con ${Y}; se pide la fracción del total, que es ${total}.`, `${fr(x, y)} compares ${X} with ${Y}; it asks for the fraction of the total, which is ${total}.`, idioma),
    'otra-parte-sobre-el-total': dos(`${fr(y, total)} son los ${Y}, no los ${X}.`, `${fr(y, total)} is the ${Y}, not the ${X}.`, idioma),
  }[error];
  return aparte ? `${aparte} ${base}` : base;
}

export function explicaRazon(it, { idioma }) {
  const { c, gx, gy, X, Y } = datosRazon(it, idioma);
  const { x, y, total } = gruposRazon(it);
  const parte = it.pregunta === 'parte-parte';
  const pasos = [
    dos(`Hay ${nombre(gx, x, 'es')} por cada ${nombre(gy, y, 'es')}.`, `There are ${nombre(gx, x, 'en')} for every ${nombre(gy, y, 'en')}.`, idioma),
    parte
      ? dos(`Se compara una parte con la otra: ${X} arriba, ${Y} abajo.`, `One part is compared with the other: ${X} on top, ${Y} below.`, idioma)
      : dos(`El total es ${cuenta(`${x} + ${y} = ${total}`)} ${c.unidad.es}.`, `The total is ${cuenta(`${x} + ${y} = ${total}`)} ${c.unidad.en}.`, idioma),
    parte
      ? dos(`Arriba van los ${x} y abajo los ${y}.`, `The ${x} go on top and the ${y} below.`, idioma)
      : dos(`Se compara la parte (${x}) con el total (${total}): ${x} arriba y ${total} abajo.`, `The part (${x}) is compared with the total (${total}): ${x} on top and ${total} below.`, idioma),
  ];
  const bien = parte ? fr(x, y) : fr(x, total);
  return `${lista(pasos)}${dos(`La respuesta es ${cuenta(bien)}.`, `The answer is ${cuenta(bien)}.`, idioma)}`;
}

export const respuestaRazon = o => `${o.num}/${o.den}`;

// ─── Ejercicio 2 ───────────────────────────────────────────────────────────────

export function enunciadoEquivalentes(it, { idioma }) {
  if (it.tipo === 'elegir') {
    return `<p class="instruccion">${dos('¿Cuál es equivalente a esta razón?', 'Which one is equivalent to this ratio?', idioma)}</p><div class="operacion">${htmlFraccion(fraccion(it.p, it.q), { conUno: true })}</div>`;
  }
  const c = CONTEXTOS_SENCILLA_TX[it.ctx];
  const frase = sustituir(c.enun[idioma], { a: it.p * it.k, b: it.q * it.k });
  const pide = dos(
    `Escribe la razón de ${c.x.es} a ${c.y.es} como fracción, <strong>lo más sencilla posible</strong>: tiene que estar simplificada del todo (irreducible).`,
    `Write the ratio of ${c.x.en} to ${c.y.en} as a fraction in its <strong>simplest form</strong>: it has to be fully simplified (lowest terms).`, idioma);
  return `<p class="instruccion">${frase}</p><p class="instruccion">${pide}</p>`;
}

export function feedbackEquivalentes(it, error, respuesta, idioma) {
  if (it.tipo === 'elegir') {
    const buena = buenaRazon(it);
    const base = dos(`Se multiplican los dos términos por ${it.k}: ${cuenta(`${it.p} · ${it.k} = ${buena.num}`)} y ${cuenta(`${it.q} · ${it.k} = ${buena.den}`)}, así que ${fr(it.p, it.q)} = ${fr(buena.num, buena.den)}.`,
      `Multiply both terms by ${it.k}: ${cuenta(`${it.p} · ${it.k} = ${buena.num}`)} and ${cuenta(`${it.q} · ${it.k} = ${buena.den}`)}, so ${fr(it.p, it.q)} = ${fr(buena.num, buena.den)}.`, idioma);
    const mala = respuesta ? it.opciones.find(o => respuestaRazon(o) === respuesta) : null;
    let aparte = '';
    if (mala && error === 'suma-mismo-numero') {
      const m = mala.num - it.p;
      aparte = dos(`${fr(mala.num, mala.den)}: se ha sumado ${m} arriba y abajo, y sumar no mantiene la razón.`, `${fr(mala.num, mala.den)}: ${m} was added to the top and the bottom, and adding does not keep the ratio.`, idioma);
    } else if (mala && error === 'amplia-un-termino') {
      const arriba = mala.den === it.q;
      const f = arriba ? mala.num / it.p : mala.den / it.q;
      aparte = dos(`${fr(mala.num, mala.den)}: solo se ha multiplicado por ${f} el término de ${arriba ? 'arriba' : 'abajo'}; hay que multiplicar los dos.`,
        `${fr(mala.num, mala.den)}: only the ${arriba ? 'top' : 'bottom'} term was multiplied by ${f}; you must multiply both.`, idioma);
    } else if (mala && error === 'razon-invertida') {
      aparte = dos(`${fr(mala.num, mala.den)} vale ${fr(it.q, it.p)}: es la razón al revés.`, `${fr(mala.num, mala.den)} equals ${fr(it.q, it.p)}: it is the ratio the wrong way round.`, idioma);
    }
    return aparte ? `${aparte} ${base}` : base;
  }
  const g = it.k;
  const a = it.p * it.k, b = it.q * it.k;
  const base = dos(`El ${GCD.es} de ${a} y ${b} es ${g}: ${cuenta(`${a} : ${g} = ${it.p}`)} y ${cuenta(`${b} : ${g} = ${it.q}`)}. La razón más sencilla es ${fr(it.p, it.q)}.`,
    `The ${GCD.en} of ${a} and ${b} is ${g}: ${cuenta(`${a} : ${g} = ${it.p}`)} and ${cuenta(`${b} : ${g} = ${it.q}`)}. The simplest ratio is ${fr(it.p, it.q)}.`, idioma);
  if (error === 'sin-simplificar-del-todo' && respuesta) {
    const h = mcd(respuesta.num, respuesta.den);
    return dos(`${fr(respuesta.num, respuesta.den)} vale lo mismo, pero todavía se puede dividir entre ${h}. ${base}`,
      `${fr(respuesta.num, respuesta.den)} has the same value, but you can still divide by ${h}. ${base}`, idioma);
  }
  if (error === 'razon-invertida') {
    const c = CONTEXTOS_SENCILLA_TX[it.ctx];
    return dos(`Está al revés: se pide ${c.x.es} a ${c.y.es}, con ${c.x.es} arriba. ${base}`, `It is the wrong way round: it asks for ${c.x.en} to ${c.y.en}, with ${c.x.en} on top. ${base}`, idioma);
  }
  if (respuesta) {
    return dos(`${fr(respuesta.num, respuesta.den)} no vale lo mismo que ${fr(a, b)}. ${base}`, `${fr(respuesta.num, respuesta.den)} does not have the same value as ${fr(a, b)}. ${base}`, idioma);
  }
  return base;
}

export function explicaEquivalentes(it, { idioma }) {
  if (it.tipo === 'elegir') {
    const buena = buenaRazon(it);
    const pasos = [
      dos('Una razón equivalente se consigue multiplicando los dos términos por el mismo número.', 'An equivalent ratio comes from multiplying both terms by the same number.', idioma),
      dos(`Por ejemplo, por ${it.k}: ${cuenta(`${it.p} · ${it.k} = ${buena.num}`)} y ${cuenta(`${it.q} · ${it.k} = ${buena.den}`)}.`, `For example, by ${it.k}: ${cuenta(`${it.p} · ${it.k} = ${buena.num}`)} and ${cuenta(`${it.q} · ${it.k} = ${buena.den}`)}.`, idioma),
      dos('Las que suman un número, multiplican solo un término o están al revés no valen.', 'Ratios that add a number, multiply only one term or are the wrong way round do not work.', idioma),
    ];
    return `${lista(pasos)}${dos(`La respuesta es ${cuenta(fr(buena.num, buena.den))}.`, `The answer is ${cuenta(fr(buena.num, buena.den))}.`, idioma)}`;
  }
  const a = it.p * it.k, b = it.q * it.k;
  const pasos = [
    dos(`Busca el mayor número que divide a ${a} y a ${b}: ${GCD.es}(${a}, ${b}) = ${it.k}.`, `Find the biggest number that divides ${a} and ${b}: ${GCD.en}(${a}, ${b}) = ${it.k}.`, idioma),
    dos(`Divide arriba y abajo entre ${it.k}: ${cuenta(`${a} : ${it.k} = ${it.p}`)} y ${cuenta(`${b} : ${it.k} = ${it.q}`)}.`, `Divide the top and the bottom by ${it.k}: ${cuenta(`${a} : ${it.k} = ${it.p}`)} and ${cuenta(`${b} : ${it.k} = ${it.q}`)}.`, idioma),
    dos(`Entre ${it.p} y ${it.q} ya no hay ningún divisor común: está simplificada del todo.`, `${it.p} and ${it.q} have no common divisor any more: it is fully simplified.`, idioma),
  ];
  return `${lista(pasos)}${dos(`La respuesta es ${cuenta(`${fr(a, b)} = ${fr(it.p, it.q)}`)}.`, `The answer is ${cuenta(`${fr(a, b)} = ${fr(it.p, it.q)}`)}.`, idioma)}`;
}

// ─── Ejercicio 3 ───────────────────────────────────────────────────────────────

export function enunciadoProporcion(it, { idioma }) {
  return `<p class="instruccion">${TX.prop.instruccion[idioma]}</p>
    <div class="operacion">${htmlCuenta([fraccion(it.a, it.b), 'y', fraccion(it.c, it.d)])}</div>`;
}

export function feedbackProporcion(it, error, idioma) {
  const ad = it.a * it.d, bc = it.b * it.c;
  const cuentas = `${cuenta(`${it.a} · ${it.d} = ${ad}`)} ${dos('y', 'and', idioma)} ${cuenta(`${it.b} · ${it.c} = ${bc}`)}`;
  const final = it.si
    ? dos(`Son iguales: sí forman proporción.`, `They are equal: they form a proportion.`, idioma)
    : dos(`Son distintos: no forman proporción.`, `They are different: they do not form a proportion.`, idioma);
  const aparte = {
    'suma-mismo-numero': () => {
      const m = Math.abs(it.c - it.a);
      return dos(`A ${fr(Math.min(it.a, it.c), Math.min(it.b, it.d))} se le ha sumado ${m} arriba y abajo, y sumar no mantiene la razón.`, `${m} was added to the top and the bottom of ${fr(Math.min(it.a, it.c), Math.min(it.b, it.d))}, and adding does not keep the ratio.`, idioma);
    },
    'termino-desviado': () => dos('Un solo término cambia en 1 y la razón ya no es la misma: hay que calcular.', 'One term changes by 1 and the ratio is no longer the same: you have to calculate.', idioma),
  }[error];
  return `${aparte ? `${aparte()} ` : ''}${cuentas}. ${final}`;
}

export function explicaProporcion(it, { idioma }) {
  const ad = it.a * it.d, bc = it.b * it.c;
  const pasos = [
    dos('Dos razones forman proporción si los productos cruzados son iguales.', 'Two ratios form a proportion if the cross products are equal.', idioma),
    dos(`Arriba por abajo en cruz: ${cuenta(`${it.a} · ${it.d} = ${ad}`)}.`, `Cross over: ${cuenta(`${it.a} · ${it.d} = ${ad}`)}.`, idioma),
    dos(`Y el otro: ${cuenta(`${it.b} · ${it.c} = ${bc}`)}.`, `And the other one: ${cuenta(`${it.b} · ${it.c} = ${bc}`)}.`, idioma),
    ad === bc
      ? dos(`${ad} = ${bc}: son iguales.`, `${ad} = ${bc}: they are equal.`, idioma)
      : dos(`${ad} ≠ ${bc}: son distintos.`, `${ad} ≠ ${bc}: they are different.`, idioma),
  ];
  const r = it.si ? dos('sí forman proporción', 'they form a proportion', idioma) : dos('no forman proporción', 'they do not form a proportion', idioma);
  return `${lista(pasos)}${dos(`La respuesta es: ${r}.`, `The answer is: ${r}.`, idioma)}`;
}

// ─── Ejercicio 4 ───────────────────────────────────────────────────────────────

const ecuacionHtml = it => {
  const x = htmlRaya('x', it.d);
  const f = htmlFraccion(fraccion(it.a, it.b), { conUno: true });
  return `<span class="cuenta-frac">${it.lado === 'derecha' ? `${f} = ${x}` : `${x} = ${f}`}</span>`;
};

export function enunciadoTermino(it, { idioma }) {
  return `<p class="instruccion">${TX.term.instruccion[idioma]}</p><div class="operacion">${ecuacionHtml(it)}</div>`;
}

/** El otro camino, cuando un factor es entero: ni el 1 ni el mismo factor. */
function otroCamino(it, idioma) {
  if (it.d % it.b === 0 && it.d !== it.b) {
    const k = it.d / it.b;
    return dos(`O bien: ${cuenta(`${it.b} · ${k} = ${it.d}`)}, así que ${cuenta(`${it.a} · ${k} = ${it.x}`)}.`, `Or: ${cuenta(`${it.b} · ${k} = ${it.d}`)}, so ${cuenta(`${it.a} · ${k} = ${it.x}`)}.`, idioma);
  }
  if (it.b % it.d === 0 && it.b !== it.d) {
    const k = it.b / it.d;
    return dos(`O bien: ${cuenta(`${it.b} : ${k} = ${it.d}`)}, así que ${cuenta(`${it.a} : ${k} = ${it.x}`)}.`, `Or: ${cuenta(`${it.b} : ${k} = ${it.d}`)}, so ${cuenta(`${it.a} : ${k} = ${it.x}`)}.`, idioma);
  }
  return null;
}

export function feedbackTermino(it, error, idioma) {
  const ad = it.a * it.d;
  const base = dos(`Productos cruzados: ${cuenta(`${it.a} · ${it.d} = ${it.b} · x`)}, es decir, ${cuenta(`${ad} = ${it.b}x`)}, y ${cuenta(`x = ${ad} : ${it.b} = ${it.x}`)}.`,
    `Cross products: ${cuenta(`${it.a} · ${it.d} = ${it.b} · x`)}, that is, ${cuenta(`${ad} = ${it.b}x`)}, and ${cuenta(`x = ${ad} : ${it.b} = ${it.x}`)}.`, idioma);
  const aparte = {
    'suma-en-vez-de-multiplicar': dos(`Restar mantiene la diferencia, no la razón: hay que multiplicar o dividir los dos términos por el mismo número.`, `Subtracting keeps the difference, not the ratio: you have to multiply or divide both terms by the same number.`, idioma),
    'da-el-factor': dos(`${factorDe(it)} es el número por el que se multiplica ${it.b}, pero falta aplicarlo también a ${it.a}.`, `${factorDe(it)} is the number ${it.b} is multiplied by, but it still has to be applied to ${it.a} as well.`, idioma),
  }[error];
  return `${aparte ? `${aparte} ` : ''}${base}`;
}

export function explicaTermino(it, { idioma }) {
  const ad = it.a * it.d;
  const pasos = [
    dos(`Productos cruzados: ${cuenta(`${it.a} · ${it.d} = ${it.b} · x`)}.`, `Cross products: ${cuenta(`${it.a} · ${it.d} = ${it.b} · x`)}.`, idioma),
    dos(`Se hace el producto: ${cuenta(`${ad} = ${it.b}x`)}.`, `Work out the product: ${cuenta(`${ad} = ${it.b}x`)}.`, idioma),
    dos(`Se divide entre ${it.b}: ${cuenta(`x = ${ad} : ${it.b} = ${it.x}`)}.`, `Divide by ${it.b}: ${cuenta(`x = ${ad} : ${it.b} = ${it.x}`)}.`, idioma),
  ];
  const otro = otroCamino(it, idioma);
  if (otro) pasos.push(otro);
  return `${lista(pasos)}${dos(`La respuesta es ${cuenta(`x = ${it.x}`)}.`, `The answer is ${cuenta(`x = ${it.x}`)}.`, idioma)}`;
}
