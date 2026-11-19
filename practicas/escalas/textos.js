// Práctica «Escalas»: textos propios, siempre { es, en }. Reglas: «·», nunca «×»; la escala se escribe «1 : 50 000» y
// va sola en su línea (nunca con una división); el cambio de unidad, a la vista, una operación por línea; cada
// explicación habla de LOS NÚMEROS DE ESE ÍTEM. Una escala se aplica a longitudes, nunca a áreas.

import { aTexto, cantidad as cantidad2 } from '../_comun/proporcion.js';
import { medida, enUnidad, escalaTxt, nTxt, dibujoDe, dibujoCm, DIBUJO_MIN_CM, DIBUJO_MAX_CM } from './logica.js';

const t = (i, es, en) => (i === 'es' ? es : en);
const c = s => `<span class="cuenta">${s}</span>`;
const pasos = ps => `<ol class="pasos-ayuda">${ps.map(p => `<li>${p}</li>`).join('')}</ol>`;
export const NO_SE_HACERLO = { es: 'No sé hacerlo', en: 'I don’t know how' };
const ej = (es, en) => ({ es, en });
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

const A = (c0, i) => aTexto(c0, i);
const mm = (v, u, i) => A(medida(v, u), i);
const sinCm = (v, i) => mm(v, 'cm', i).replace(/\s*cm$/, '');
const MEDIO = { plano: { es: 'un plano', en: 'a plan' }, mapa: { es: 'un mapa', en: 'a map' }, maqueta: { es: 'una maqueta', en: 'a scale model' } };
const MEDIO_DEF = { plano: { es: 'el plano', en: 'the plan' }, mapa: { es: 'el mapa', en: 'the map' }, maqueta: { es: 'la maqueta', en: 'the scale model' } };
const UNIDAD_NOMBRE = { m: { es: 'metros', en: 'metres' }, km: { es: 'kilómetros', en: 'kilometres' } };
const notaMaqueta = (it, i) => (it.fam === 'maqueta' && i === 'en' ? ' (scale model = maqueta)' : '');

// ─── Enunciados ──────────────────────────────────────────────────────────────────────────────────

export function enunciadoARealidad(it, i) {
  const { obj, D, pmm, unidad } = it, S = escalaTxt(D);
  return t(i,
    `En ${MEDIO[it.fam].es} a escala ${S}, ${obj.sub.es} mide ${mm(pmm, 'cm', 'es')}. ¿Cuánto mide de verdad? Escríbelo en ${UNIDAD_NOMBRE[unidad].es}.`,
    `On ${MEDIO[it.fam].en} at a scale of ${S}, ${obj.sub.en} is ${mm(pmm, 'cm', 'en')}. How long is it in real life? Write it in ${UNIDAD_NOMBRE[unidad].en}.${notaMaqueta(it, 'en')}`);
}
export function enunciadoAlPlano(it, i) {
  const { obj, D, rmm, unidad } = it, S = escalaTxt(D);
  return t(i,
    `${obj.Sub.es} ${obj.verbo.es} ${mm(rmm, unidad, 'es')}${obj.largo.es}. ¿Cuántos centímetros mide en ${MEDIO[it.fam].es} a escala ${S}?`,
    `${obj.Sub.en} ${obj.verbo.en} ${mm(rmm, unidad, 'en')}${obj.largo.en}. How many centimetres is it on ${MEDIO[it.fam].en} at a scale of ${S}?${notaMaqueta(it, 'en')}`);
}
export function enunciadoQueEscala(it, i) {
  const { obj, pmm, rmm, unidad } = it;
  return t(i,
    `${obj.Sub.es} ${obj.verbo.es} ${mm(rmm, unidad, 'es')}${obj.largo.es} de verdad y en ${MEDIO_DEF[it.fam].es} mide ${mm(pmm, 'cm', 'es')}. ¿Qué escala se ha usado?`,
    `${obj.Sub.en} ${obj.verbo.en} ${mm(rmm, unidad, 'en')}${obj.largo.en} in real life and on ${MEDIO_DEF[it.fam].en} it is ${mm(pmm, 'cm', 'en')}. What scale was used?${notaMaqueta(it, 'en')}`);
}

const OBJETO_ENCAJA = {
  habitacion: { es: R => `Quieres dibujar en un folio el plano de una habitación de ${R} de largo.`, en: R => `You want to draw a plan of a room ${R} long on a sheet of paper.` },
  piso: { es: R => `Quieres dibujar en un folio el plano de un piso de ${R} de largo.`, en: R => `You want to draw a plan of a flat ${R} long on a sheet of paper.` },
  pista: { es: R => `Quieres dibujar en un folio el plano de una pista de baloncesto de ${R} de largo.`, en: R => `You want to draw a plan of a basketball court ${R} long on a sheet of paper.` },
  piscina: { es: R => `Quieres dibujar en un folio el plano de una piscina de ${R} de largo.`, en: R => `You want to draw a plan of a swimming pool ${R} long on a sheet of paper.` },
  ciudades: { es: R => `Quieres dibujar en un folio un mapa con dos ciudades que están a ${R}.`, en: R => `You want to draw a map on a sheet of paper with two cities ${R} apart.` },
  coche: { es: R => `Quieres poner en una estantería la maqueta de un coche de ${R} de largo.`, en: R => `You want to put a scale model of a car ${R} long on a shelf. (scale model = maqueta)` },
};
export function enunciadoEncaja(it, i) {
  const u = it.b.cat === 'ciudades' ? 'km' : 'm', R = mm(it.rmm, u, i);
  return t(i,
    `${OBJETO_ENCAJA[it.b.cat].es(R)} Tiene que caber y verse bien: entre ${DIBUJO_MIN_CM} cm y ${DIBUJO_MAX_CM} cm de largo. ¿Qué escala te sirve?`,
    `${OBJETO_ENCAJA[it.b.cat].en(R)} It has to fit and be easy to see: between ${DIBUJO_MIN_CM} cm and ${DIBUJO_MAX_CM} cm long. Which scale works?`);
}

// ─── Qué ha pasado con cada error ────────────────────────────────────────────────────────────────

export const NOMBRE_ERROR = {
  'sin-cambio-de-unidad': { es: 'Falta el cambio de unidad', en: 'The change of unit is missing' },
  'dividir-en-vez-de-multiplicar': { es: 'Has dividido donde había que multiplicar', en: 'You divided where you had to multiply' },
  'multiplicar-en-vez-de-dividir': { es: 'Has multiplicado donde había que dividir', en: 'You multiplied where you had to divide' },
  'salto-de-unidad-de-mas': { es: 'Te has pasado un salto de unidad (queda más grande)', en: 'You went one unit step too far (the number is too big)' },
  'salto-de-unidad-de-menos': { es: 'Te has quedado corto un salto de unidad (queda más pequeño)', en: 'You went one unit step too short (the number is too small)' },
  'razon-invertida': { es: 'Has puesto la escala al revés', en: 'You wrote the scale the wrong way round' },
  'salto-de-dos-unidades': { es: 'Te has pasado dos saltos de unidad', en: 'You went two unit steps too far' },
  'dibujo-diminuto': { es: 'Con esa escala el dibujo sale diminuto', en: 'With that scale the drawing comes out tiny' },
  'dibujo-enorme': { es: 'Con esa escala el dibujo no cabe', en: 'With that scale the drawing does not fit' },
  'otra-respuesta': { es: 'Ese número no sale de ningún camino habitual', en: 'That number does not come from any usual method' },
};

export function quePaso(id, it, i) {
  switch (id) {
    case 'sin-cambio-de-unidad':
      return it.ops
        ? t(i, 'Las dos medidas tienen que estar en la misma unidad antes de dividir: pasa todo a centímetros.', 'Both measures must be in the same unit before dividing: change everything to centimetres.')
        : enunciadoQuePasoUnidad(it, i);
    case 'dividir-en-vez-de-multiplicar':
      return t(i, 'Del plano a la realidad todo se hace más grande: se multiplica por la escala.', 'From the plan to real life everything gets bigger: you multiply by the scale.');
    case 'multiplicar-en-vez-de-dividir':
      return t(i, 'De la realidad al plano todo se hace más pequeño: se divide entre la escala.', 'From real life to the plan everything gets smaller: you divide by the scale.');
    case 'salto-de-unidad-de-mas':
    case 'salto-de-unidad-de-menos':
      return t(i, 'Cuenta bien los saltos del cambio de unidad: cada salto es por 10.', 'Count the steps of the change of unit carefully: each step is by 10.');
    case 'salto-de-dos-unidades':
      return t(i, 'Cuenta bien los saltos del cambio de unidad: cada salto es por 10.', 'Count the steps of the change of unit carefully: each step is by 10.');
    case 'razon-invertida':
      return t(i, 'La escala se escribe 1 : N, con el 1 del plano primero: 1 cm del plano son N cm de verdad.', 'A scale is written 1 : N, with the 1 of the plan first: 1 cm on the plan is N cm in real life.');
    case 'dibujo-diminuto':
    case 'dibujo-enorme':
      return t(i, `Con esa escala el dibujo mediría ${dibTxt(it, 'es')}.`, `With that scale the drawing would be ${dibTxt(it, 'en')} long.`);
    default:
      return t(i, 'Repasa qué se calcula en cada paso.', 'Check what is worked out in each step.');
  }
}
function enunciadoQuePasoUnidad(it, i) {
  return t(i, 'La escala da la medida en centímetros: falta pasarla a la unidad que piden.', 'The scale gives the measure in centimetres: you still have to change it to the unit they ask for.');
}

// ─── Explicaciones («No lo sé» y feedback) ───────────────────────────────────────────────────────

const frase1 = (D, i) => t(i, `La escala ${escalaTxt(D)} dice que 1 cm del plano son ${nTxt(D)} cm de verdad.`, `The scale ${escalaTxt(D)} says that 1 cm on the plan is ${nTxt(D)} cm in real life.`);

export function explicaARealidad(it, { idioma = 'es' } = {}) {
  const i = idioma, { D, pmm, rmm, unidad } = it;
  const lineas = [
    frase1(D, i),
    t(i, `Del plano a la realidad se multiplica: ${c(`${mm(pmm, 'cm', 'es')} · ${nTxt(D)} = ${mm(rmm, 'cm', 'es')}`)}.`,
      `From the plan to real life you multiply: ${c(`${mm(pmm, 'cm', 'en')} · ${nTxt(D)} = ${mm(rmm, 'cm', 'en')}`)}.`),
    t(i, `Cambio de unidad: ${c(`${mm(rmm, 'cm', 'es')} = ${mm(rmm, unidad, 'es')}`)}.`, `Change of unit: ${c(`${mm(rmm, 'cm', 'en')} = ${mm(rmm, unidad, 'en')}`)}.`),
    t(i, `La respuesta es ${mm(rmm, unidad, 'es')}.`, `The answer is ${mm(rmm, unidad, 'en')}.`),
  ];
  return pasos(lineas);
}

export function explicaAlPlano(it, { idioma = 'es' } = {}) {
  const i = idioma, { D, pmm, rmm, unidad } = it;
  return pasos([
    frase1(D, i),
    t(i, `Cambio de unidad: ${c(`${mm(rmm, unidad, 'es')} = ${mm(rmm, 'cm', 'es')}`)}.`, `Change of unit: ${c(`${mm(rmm, unidad, 'en')} = ${mm(rmm, 'cm', 'en')}`)}.`),
    t(i, `De la realidad al plano se divide: ${c(`${sinCm(rmm, 'es')} : ${nTxt(D)} = ${mm(pmm, 'cm', 'es')}`)}.`,
      `From real life to the plan you divide: ${c(`${sinCm(rmm, 'en')} : ${nTxt(D)} = ${mm(pmm, 'cm', 'en')}`)}.`),
    t(i, `La respuesta es ${mm(pmm, 'cm', 'es')}.`, `The answer is ${mm(pmm, 'cm', 'en')}.`),
  ]);
}

export function explicaQueEscala(it, { idioma = 'es' } = {}) {
  const i = idioma, { D, pmm, rmm, unidad } = it, buena = escalaTxt(D);
  return pasos([
    t(i, `Pasa la medida real a centímetros: ${c(`${mm(rmm, unidad, 'es')} = ${mm(rmm, 'cm', 'es')}`)}.`, `Change the real measure to centimetres: ${c(`${mm(rmm, unidad, 'en')} = ${mm(rmm, 'cm', 'en')}`)}.`),
    t(i, `Cuántas veces cabe la medida del plano: ${c(`${sinCm(rmm, 'es')} : ${sinCm(pmm, 'es')} = ${nTxt(D)}`)}.`,
      `How many times the measure on the plan fits: ${c(`${sinCm(rmm, 'en')} : ${sinCm(pmm, 'en')} = ${nTxt(D)}`)}.`),
    t(i, `1 cm del plano son ${nTxt(D)} cm de verdad: la escala es ${c(buena)}.`, `1 cm on the plan is ${nTxt(D)} cm in real life: the scale is ${c(buena)}.`),
    t(i, `La respuesta es ${buena}.`, `The answer is ${buena}.`),
  ]);
}

const dibTxt = (it, i) => {
  const f = dibujoDe(it, it.elegida); if (f.num < f.den) return i === 'es' ? 'menos de 1 cm' : 'less than 1 cm';
  return aTexto(cantidad2(f, 'cm'), i); };
const cmTxt = (f, i) => aTexto(cantidad2(f, 'cm'), i);
export function explicaEncaja(it, { idioma = 'es' } = {}) {
  const i = idioma, { rmm, D, b } = it, u = b.cat === 'ciudades' ? 'km' : 'm', d = dibujoCm(rmm, D);
  const rcm = sinCm(rmm, i);
  return pasos([
    t(i, `Pasa la medida a centímetros: ${c(`${mm(rmm, u, 'es')} = ${mm(rmm, 'cm', 'es')}`)}.`, `Change the measure to centimetres: ${c(`${mm(rmm, u, 'en')} = ${mm(rmm, 'cm', 'en')}`)}.`),
    t(i, `Prueba la escala ${escalaTxt(D)}.`, `Try the scale ${escalaTxt(D)}.`),
    t(i, `El dibujo mide: ${c(`${rcm} : ${nTxt(D)} = ${cmTxt(d, 'es')}`)}.`, `The drawing measures: ${c(`${rcm} : ${nTxt(D)} = ${cmTxt(d, 'en')}`)}.`),
    t(i, `${cmTxt(d, 'es')} está entre ${DIBUJO_MIN_CM} cm y ${DIBUJO_MAX_CM} cm: la respuesta es ${escalaTxt(D)}.`,
      `${cmTxt(d, 'en')} is between ${DIBUJO_MIN_CM} cm and ${DIBUJO_MAX_CM} cm: the answer is ${escalaTxt(D)}.`),
  ]);
}

// ─── Pantalla ────────────────────────────────────────────────────────────────────────────────────

export const TX = {
  ej1: {
    nombre: ej('Del plano a la realidad', 'From the plan to real life'),
    detalle: ej('Multiplicar por la escala y cambiar de unidad', 'Multiply by the scale and change the unit'),
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Una escala <strong>1 : 50</strong> dice que <strong>1 cm del plano son 50 cm de verdad</strong>. Del plano a la realidad se <strong>multiplica</strong>, y después se cambia de unidad.</p>
        <p>Ejemplo: en un plano a escala ${c('1 : 50')}, una pared mide 7 cm. ${c('7 · 50 = 350')} cm. Cambio de unidad: ${c('350 cm = 3,5 m')}.</p>`,
      en: `<h2>How it works</h2>
        <p>A scale of <strong>1 : 50</strong> says that <strong>1 cm on the plan is 50 cm in real life</strong>. From the plan to real life you <strong>multiply</strong>, and then you change the unit.</p>
        <p>Example: on a plan at a scale of ${c('1 : 50')}, a wall is 7 cm long. ${c('7 · 50 = 350')} cm. Change of unit: ${c('350 cm = 3.5 m')}.</p>`,
    },
    instruccion: ej('Escribe la medida real con su unidad si quieres (por ejemplo, 3,5 m).', 'Write the real measure; you can add the unit (for example, 3.5 m).'),
    solucion: { es: it => explicaARealidad(it, { idioma: 'es' }), en: it => explicaARealidad(it, { idioma: 'en' }) },
  },
  ej2: {
    nombre: ej('De la realidad al plano', 'From real life to the plan'),
    detalle: ej('Cambiar de unidad y dividir entre la escala', 'Change the unit and divide by the scale'),
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Primero se pasa la medida real a <strong>centímetros</strong>; después se <strong>divide</strong> entre la escala.</p>
        <p>Ejemplo: una pared de 6 m en un plano a escala ${c('1 : 200')}. Cambio de unidad: ${c('6 m = 600 cm')}. Después: ${c('600 : 200 = 3')} cm.</p>`,
      en: `<h2>How it works</h2>
        <p>First change the real measure to <strong>centimetres</strong>; then <strong>divide</strong> by the scale.</p>
        <p>Example: a 6 m wall on a plan at a scale of ${c('1 : 200')}. Change of unit: ${c('6 m = 600 cm')}. Then: ${c('600 : 200 = 3')} cm.</p>`,
    },
    instruccion: ej('Escribe la medida en el plano, en centímetros.', 'Write the measure on the plan, in centimetres.'),
    solucion: { es: it => explicaAlPlano(it, { idioma: 'es' }), en: it => explicaAlPlano(it, { idioma: 'en' }) },
  },
  ej3: {
    nombre: ej('¿Qué escala es?', 'Find the scale'),
    detalle: ej('Medida real y medida del plano', 'Real measure and measure on the plan'),
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Pasa las dos medidas a <strong>centímetros</strong> y mira <strong>cuántas veces cabe</strong> la del plano en la real: ese número es el de la escala.</p>
        <p>Ejemplo: un pasillo de 8 m mide 4 cm en el plano. ${c('8 m = 800 cm')}. ${c('800 : 4 = 200')}. La escala es ${c('1 : 200')}.</p>`,
      en: `<h2>How it works</h2>
        <p>Change both measures to <strong>centimetres</strong> and see <strong>how many times</strong> the one on the plan fits in the real one: that number is the one of the scale.</p>
        <p>Example: an 8 m corridor is 4 cm on the plan. ${c('8 m = 800 cm')}. ${c('800 : 4 = 200')}. The scale is ${c('1 : 200')}.</p>`,
    },
    instruccion: ej('Elige la escala.', 'Choose the scale.'),
    solucion: { es: it => explicaQueEscala(it, { idioma: 'es' }), en: it => explicaQueEscala(it, { idioma: 'en' }) },
  },
  ej4: {
    nombre: ej('¿Qué escala le va?', 'Which scale makes sense?'),
    detalle: ej('Que el dibujo quepa y se vea bien', 'The drawing must fit and be easy to see'),
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Prueba una escala: pasa la medida real a centímetros y <strong>divide</strong> entre la escala. El dibujo tiene que medir lo que pide el enunciado.</p>
        <p>Ejemplo: un piso de 12 m en un folio, entre 5 cm y 30 cm. ${c('12 m = 1 200 cm')}. Con ${c('1 : 50')}: ${c('1 200 : 50 = 24')} cm. Sirve.</p>`,
      en: `<h2>How it works</h2>
        <p>Try a scale: change the real measure to centimetres and <strong>divide</strong> by the scale. The drawing must be the size the question asks for.</p>
        <p>Example: a 12 m flat on a sheet of paper, between 5 cm and 30 cm. ${c('12 m = 1 200 cm')}. With ${c('1 : 50')}: ${c('1 200 : 50 = 24')} cm. It works.</p>`,
    },
    instruccion: ej('Elige la escala que sirve.', 'Choose the scale that works.'),
    solucion: { es: it => explicaEncaja(it, { idioma: 'es' }), en: it => explicaEncaja(it, { idioma: 'en' }) },
  },
};
export { enUnidad };
