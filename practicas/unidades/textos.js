// Práctica «Cambia de unidad»: textos propios, siempre { es, en }. Reglas: «·», nunca «×»; los símbolos del SI
// (L mayúscula; hL, daL, dam…); el salto es por 10 y el tiempo, por 60; cada explicación habla de LOS NÚMEROS DE ESE ÍTEM.
// Sin superficie ni volumen (acta de la U7, punto n): la superficie va a la U8.

import { aTexto, cantidad, UNIDADES_MEDIDA } from '../_comun/proporcion.js';
import { Fraccion } from '../_comun/fracciones.js';
import { ESCALERA, EXP, factor, saltos, decimales, valorEn, porCuanto, buenoComplejo } from './logica.js';

const t = (i, es, en) => (i === 'es' ? es : en);
const bajaInicial = s => s.charAt(0).toLowerCase() + s.slice(1);
const c = s => `<span class="cuenta">${s}</span>`;
const pasos = ps => `<ol class="pasos-ayuda">${ps.map(p => `<li>${p}</li>`).join('')}</ol>`;
export const NO_SE_HACERLO = { es: 'No sé hacerlo', en: 'I don’t know how' };
const ej = (es, en) => ({ es, en });
const F = (n, d = 1) => new Fraccion(n, d).simplificar();

const N = (x, i) => aTexto(cantidad(x, null), i);
const M = (x, u, i) => aTexto(cantidad(x, u), i);
const nombre = (u, i) => UNIDADES_MEDIDA[u].nombre[i][1];
const num = x => Number(x.num) / Number(x.den);

// ─── Enunciados ──────────────────────────────────────────────────────────────────────────────────

export const enunciadoLongitud = (it, i) => t(i,
  `Expresa en ${nombre(it.a, 'es')}: ${M(it.x, it.de, 'es')}.`,
  `Write in ${nombre(it.a, 'en')}: ${M(it.x, it.de, 'en')}.`);

export const enunciadoMasaCapacidad = (it, i) => t(i,
  `¿Cuántos ${nombre(it.a, 'es')} son ${M(it.x, it.de, 'es')}?`,
  `How many ${nombre(it.a, 'en')} is ${M(it.x, it.de, 'en')}?`);

export const enunciadoTiempo = (it, i) => (it.pasos === 'h-min'
  ? t(i, `Pasa a minutos: ${M(it.x, 'h', 'es')}.`, `Change to minutes: ${M(it.x, 'h', 'en')}.`)
  : t(i, `Pasa a horas (con decimales): ${M(it.x, 'min', 'es')}.`, `Change to hours (with decimals): ${M(it.x, 'min', 'en')}.`));

export function enunciadoComplejo(it, i) {
  const { grande: G, pequena: P, big, small, total, forma } = it;
  if (forma === 'a') return t(i, `Pasa a ${nombre(P, 'es')}: ${big} ${G} ${small} ${P}.`, `Change to ${nombre(P, 'en')}: ${big} ${G} ${small} ${P}.`);
  const izquierda = forma === 'b1' ? M(it.x, G, i) : M(total, P, i);
  return t(i, `Completa: ${izquierda} = ${big} ${G} … ${P}.`, `Complete: ${izquierda} = ${big} ${G} … ${P}.`);
}

export const enunciadoUnidad = (it, i) => `${it.caso[i]}: ${N(it.caso.n, i)} …`;

// ─── Qué ha pasado con cada error ────────────────────────────────────────────────────────────────

export const NOMBRE_ERROR = {
  'subir-por-bajar': { es: 'Has multiplicado donde había que dividir (o al revés)', en: 'You multiplied where you had to divide (or the other way round)' },
  'salto-de-unidad-de-mas': { es: 'Te has pasado un salto de unidad (queda más grande)', en: 'You went one unit step too far (the number is too big)' },
  'salto-de-unidad-de-menos': { es: 'Te has quedado corto un salto de unidad (queda más pequeño)', en: 'You went one unit step too short (the number is too small)' },
  'sin-cambiar-el-numero': { es: 'Has dejado el mismo número', en: 'You left the number as it was' },
  'cien-en-vez-de-sesenta': { es: 'Has usado 100 donde había que usar 60', en: 'You used 100 where you had to use 60' },
  'horas-y-minutos-pegados': { es: 'Has escrito los minutos como decimales de la hora', en: 'You wrote the minutes as decimals of the hour' },
  'pegar-cifras': { es: 'Has pegado las cifras', en: 'You stuck the digits together' },
  'sumar-sin-pasar': { es: 'Has sumado sin pasar a la misma unidad', en: 'You added without changing to the same unit' },
  'decimal-como-unidad-pequena': { es: 'Has leído los decimales como unidades pequeñas', en: 'You read the decimals as small units' },
  'total-sin-quitar': { es: 'Falta quitar la parte que ya está puesta', en: 'You forgot to take away the part that is already written' },
  'cociente-en-vez-de-resto': { es: 'Has dado lo que cabe en vez de lo que sobra', en: 'You gave how many fit instead of what is left over' },
  'unidad-demasiado-grande': { es: 'Esa unidad es demasiado grande', en: 'That unit is far too big' },
  'unidad-demasiado-pequena': { es: 'Esa unidad es demasiado pequeña', en: 'That unit is far too small' },
  'otra-respuesta': { es: 'Ese número no sale de ningún camino habitual', en: 'That number does not come from any usual method' },
};

const lo = (c0, u) => F(Math.round((c0 / 10 ** EXP[u]) * 1e6), 1e6);
const frac = (x, big) => x.restar(F(big)).simplificar();

export function quePaso(id, it, i) {
  const crece = it.res !== undefined && num(it.res) > num(it.x);
  switch (id) {
    case 'subir-por-bajar':
      return t(i, `De ${it.de} a ${it.a} el número se hace ${crece ? 'más grande' : 'más pequeño'}: se ${crece ? 'multiplica' : 'divide'}, no al revés.`,
        `From ${it.de} to ${it.a} the number gets ${crece ? 'bigger' : 'smaller'}: you ${crece ? 'multiply' : 'divide'}, not the other way round.`);
    case 'salto-de-unidad-de-mas':
    case 'salto-de-unidad-de-menos':
      return it.mag === 'tiempo'
        ? t(i, 'Una hora son 60 minutos: el cambio no es por 10.', 'One hour is 60 minutes: the change is not by 10.')
        : t(i, `Cuenta bien los saltos: de ${it.de} a ${it.a} hay ${saltos(it.de, it.a)}, y cada uno es por 10.`,
          `Count the steps carefully: from ${it.de} to ${it.a} there are ${saltos(it.de, it.a)}, and each one is by 10.`);
    case 'sin-cambiar-el-numero':
      return t(i, `El número tiene que cambiar: al pasar de ${it.de} a ${it.a} se ${crece ? 'multiplica' : 'divide'} por ${N(crece ? factor(it.de, it.a) : factor(it.a, it.de), 'es')}.`,
        `The number has to change: going from ${it.de} to ${it.a} you ${crece ? 'multiply' : 'divide'} by ${N(crece ? factor(it.de, it.a) : factor(it.a, it.de), 'en')}.`);
    case 'cien-en-vez-de-sesenta':
      return t(i, 'Una hora tiene 60 minutos, no 100: los decimales de una hora no son centésimas.', 'One hour has 60 minutes, not 100: the decimals of an hour are not hundredths.');
    case 'horas-y-minutos-pegados': {
      const m = Math.round((num(it.res) - Math.floor(num(it.res))) * 60);
      return t(i, `Los minutos no son decimales de la hora: ${m} min son ${N(F(m, 60), 'es')} h.`, `Minutes are not decimals of the hour: ${m} min is ${N(F(m, 60), 'en')} h.`);
    }
    case 'pegar-cifras':
      return t(i, `No se pegan las cifras: primero ${it.big} ${it.grande} = ${N(it.big * porCuanto(it), 'es')} ${it.pequena}, y después se suma.`,
        `Don’t stick the digits together: first ${it.big} ${it.grande} = ${N(it.big * porCuanto(it), 'en')} ${it.pequena}, then add.`);
    case 'sumar-sin-pasar':
      return t(i, `Antes de sumar hay que pasar ${it.big} ${it.grande} a ${it.pequena}.`, `Before adding, change ${it.big} ${it.grande} to ${it.pequena}.`);
    case 'decimal-como-unidad-pequena': {
      const f = frac(it.x, it.big);
      return t(i, `Los decimales no son ${it.pequena} sueltos: ${M(f, it.grande, 'es')} = ${M(f.multiplicar(porCuanto(it)).simplificar(), it.pequena, 'es')}.`,
        `The decimals are not single ${it.pequena}: ${M(f, it.grande, 'en')} = ${M(f.multiplicar(porCuanto(it)).simplificar(), it.pequena, 'en')}.`);
    }
    case 'total-sin-quitar':
      return t(i, `A ${M(it.total, it.pequena, 'es')} hay que quitarle ${it.big} ${it.grande}, que ya están escritos.`, `From ${M(it.total, it.pequena, 'en')} you must take away ${it.big} ${it.grande}, which are already written.`);
    case 'cociente-en-vez-de-resto':
      return t(i, `${it.big} es cuántas ${it.grande} caben; lo que se pide es lo que sobra, en ${it.pequena}.`, `${it.big} is how many ${it.grande} fit; what is asked is what is left over, in ${it.pequena}.`);
    case 'unidad-demasiado-grande':
    case 'unidad-demasiado-pequena': {
      const c0 = it.caso, u = it.elegida;
      const grande = id === 'unidad-demasiado-grande';
      return t(i, `Lo normal para ${bajaInicial(c0.es)} está entre ${M(lo(c0.lo, c0.u), c0.u, 'es')} y ${M(lo(c0.hi, c0.u), c0.u, 'es')}; ${M(c0.n, u, 'es')} sería muchísimo ${grande ? 'más' : 'menos'}.`,
        `A normal value for ${bajaInicial(c0.en)} is between ${M(lo(c0.lo, c0.u), c0.u, 'en')} and ${M(lo(c0.hi, c0.u), c0.u, 'en')}; ${M(c0.n, u, 'en')} would be far ${grande ? 'more' : 'less'}.`);
    }
    default:
      return t(i, 'Repasa qué se calcula en cada paso.', 'Check what is worked out in each step.');
  }
}

// ─── Explicaciones («No lo sé» y feedback) ───────────────────────────────────────────────────────

function cadena(de, a) {
  const l = Object.values(ESCALERA).find(L => L.includes(de) && L.includes(a));
  const i = l.indexOf(de), j = l.indexOf(a);
  const trozo = i < j ? l.slice(i, j + 1) : l.slice(j, i + 1).reverse();
  return trozo.join(' → ');
}

/** Un cambio de unidad de la escalera (longitud, masa, capacidad): saltos, factor y cuenta. */
export function explicaCambio(it, { idioma = 'es' } = {}) {
  const i = idioma, { de, a, x, res } = it, s = saltos(de, a), baja = EXP[de] > EXP[a];
  const f = baja ? factor(de, a) : factor(a, de);
  const paso1 = (de === 't' || a === 't')
    ? t(i, `1 ${baja ? de : a} = ${N(f, 'es')} ${baja ? a : de}.`, `1 ${baja ? de : a} = ${N(f, 'en')} ${baja ? a : de}.`)
    : t(i, `De ${de} a ${a} hay ${s} ${s === 1 ? 'salto' : 'saltos'} hacia ${baja ? 'abajo' : 'arriba'} (${cadena(de, a)}); cada salto es por 10, así que en total es por ${N(f, 'es')}.`,
      `From ${de} to ${a} there ${s === 1 ? 'is 1 step' : `are ${s} steps`} ${baja ? 'down' : 'up'} (${cadena(de, a)}); each step is by 10, so in total it is by ${N(f, 'en')}.`);
  const cuenta = baja ? `${N(x, i)} · ${N(f, i)} = ${N(res, i)}` : `${N(x, i)} : ${N(f, i)} = ${N(res, i)}`;
  return pasos([
    paso1,
    t(i, `Hacia ${baja ? 'abajo' : 'arriba'} el número se hace ${baja ? 'más grande' : 'más pequeño'}: se ${baja ? 'multiplica' : 'divide'}: ${c(cuenta)}.`,
      `Going ${baja ? 'down' : 'up'} the number gets ${baja ? 'bigger' : 'smaller'}: you ${baja ? 'multiply' : 'divide'}: ${c(cuenta)}.`),
    t(i, `La respuesta es ${M(res, a, 'es')}.`, `The answer is ${M(res, a, 'en')}.`),
  ]);
}

export function explicaTiempo(it, { idioma = 'es' } = {}) {
  const i = idioma, { x, res } = it, aMin = it.pasos === 'h-min';
  const cuenta = aMin ? `${N(x, i)} · 60 = ${N(res, i)}` : `${N(x, i)} : 60 = ${N(res, i)}`;
  return pasos([
    t(i, '1 h son 60 min (no 100).', '1 h is 60 min (not 100).'),
    aMin
      ? t(i, `De horas a minutos el número se hace más grande: se multiplica por 60: ${c(cuenta)}.`, `From hours to minutes the number gets bigger: you multiply by 60: ${c(cuenta)}.`)
      : t(i, `De minutos a horas el número se hace más pequeño: se divide entre 60: ${c(cuenta)}.`, `From minutes to hours the number gets smaller: you divide by 60: ${c(cuenta)}.`),
    t(i, `La respuesta es ${M(res, aMin ? 'min' : 'h', 'es')}.`, `The answer is ${M(res, aMin ? 'min' : 'h', 'en')}.`),
  ]);
}

export function explicaComplejo(it, { idioma = 'es' } = {}) {
  const i = idioma, { grande: G, pequena: P, big, small, total, forma } = it, FF = porCuanto(it);
  const r = M(buenoComplejo(it), P, 'es'), re = M(buenoComplejo(it), P, 'en');
  const cierre = t(i, `La respuesta es ${r}.`, `The answer is ${re}.`);
  const unaG = t(i, `1 ${G} = ${N(FF, 'es')} ${P}.`, `1 ${G} = ${N(FF, 'en')} ${P}.`);
  if (forma === 'a') {
    return pasos([
      unaG,
      t(i, `Pasa la parte grande a ${P}: ${c(`${big} · ${N(FF, 'es')} = ${N(big * FF, 'es')}`)}.`, `Change the big part to ${P}: ${c(`${big} · ${N(FF, 'en')} = ${N(big * FF, 'en')}`)}.`),
      t(i, `Suma la parte pequeña: ${c(`${N(big * FF, 'es')} + ${small} = ${N(total, 'es')}`)}.`, `Add the small part: ${c(`${N(big * FF, 'en')} + ${small} = ${N(total, 'en')}`)}.`),
      cierre,
    ]);
  }
  if (forma === 'b1') {
    const f = frac(it.x, big), enP = f.multiplicar(FF).simplificar();
    return pasos([
      unaG,
      t(i, `La parte entera es ${big} ${G}; los decimales son ${M(f, G, 'es')}.`, `The whole part is ${big} ${G}; the decimals are ${M(f, G, 'en')}.`),
      t(i, `Pasa los decimales a ${P}: ${c(`${N(f, 'es')} · ${N(FF, 'es')} = ${N(enP, 'es')}`)}.`, `Change the decimals to ${P}: ${c(`${N(f, 'en')} · ${N(FF, 'en')} = ${N(enP, 'en')}`)}.`),
      cierre,
    ]);
  }
  return pasos([
    unaG,
    t(i, `Las ${G} que ya están escritas, en ${P}: ${c(`${big} · ${N(FF, 'es')} = ${N(big * FF, 'es')}`)}.`, `The ${G} already written, in ${P}: ${c(`${big} · ${N(FF, 'en')} = ${N(big * FF, 'en')}`)}.`),
    t(i, `Lo que sobra: ${c(`${N(total, 'es')} − ${N(big * FF, 'es')} = ${N(small, 'es')}`)}.`, `What is left over: ${c(`${N(total, 'en')} − ${N(big * FF, 'en')} = ${N(small, 'en')}`)}.`),
    cierre,
  ]);
}

export function explicaUnidad(it, { idioma = 'es' } = {}) {
  const i = idioma, k = it.caso, u = k.u;
  const bajo = lo(k.lo, u), alto = lo(k.hi, u);
  return pasos([
    t(i, `Lo normal para ${bajaInicial(k.es)} está entre ${M(bajo, u, 'es')} y ${M(alto, u, 'es')}.`, `A normal value for ${bajaInicial(k.en)} is between ${M(bajo, u, 'en')} and ${M(alto, u, 'en')}.`),
    t(i, `${M(k.n, u, 'es')} está en ese intervalo; con las otras unidades el valor sería muchísimo más grande o más pequeño.`,
      `${M(k.n, u, 'en')} is inside that range; with the other units the value would be far bigger or far smaller.`),
    t(i, `La respuesta es ${M(k.n, u, 'es')}.`, `The answer is ${M(k.n, u, 'en')}.`),
  ]);
}

// ─── Introducciones y nombres ────────────────────────────────────────────────────────────────────

export const TX = {
  ej1: {
    nombre: ej('Longitud', 'Length'),
    detalle: ej('Cambiar de unidad de km a mm, de 1 a 3 saltos', 'Change units from km to mm, 1 to 3 steps'),
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Los escalones de la longitud: ${c('km → hm → dam → m → dm → cm → mm')}. <strong>Cada salto es por 10</strong>: hacia abajo se <strong>multiplica</strong> y hacia arriba se <strong>divide</strong>.</p>
        <p>Ejemplo: ${c('3,5 km')} a metros. Hay 3 saltos hacia abajo: ${c('3,5 · 1000 = 3500')}. Son ${c('3500 m')}.</p>`,
      en: `<h2>How it works</h2>
        <p>The steps of length: ${c('km → hm → dam → m → dm → cm → mm')}. <strong>Each step is by 10</strong>: going down you <strong>multiply</strong> and going up you <strong>divide</strong>.</p>
        <p>Example: ${c('3.5 km')} to metres. There are 3 steps down: ${c('3.5 · 1000 = 3500')}. It is ${c('3500 m')}.</p>`,
    },
    instruccion: ej('Escribe el número (si quieres, con la unidad).', 'Write the number (you can add the unit).'),
    solucion: { es: it => explicaCambio(it, { idioma: 'es' }), en: it => explicaCambio(it, { idioma: 'en' }) },
  },
  ej2: {
    nombre: ej('Masa y capacidad', 'Mass and capacity'),
    detalle: ej('Gramos y litros: de t y kL a mg y mL', 'Grams and litres: from t and kL to mg and mL'),
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Masa: ${c('kg → hg → dag → g → dg → cg → mg')} (y 1 t son 1000 kg). Capacidad: ${c('kL → hL → daL → L → dL → cL → mL')}. Cada salto es <strong>por 10</strong>.</p>
        <p>Ejemplo: ${c('2,5 hL')} a litros. Hay 2 saltos hacia abajo: ${c('2,5 · 100 = 250')}. Son ${c('250 L')}.</p>`,
      en: `<h2>How it works</h2>
        <p>Mass: ${c('kg → hg → dag → g → dg → cg → mg')} (and 1 t is 1000 kg). Capacity: ${c('kL → hL → daL → L → dL → cL → mL')}. Each step is <strong>by 10</strong>.</p>
        <p>Example: ${c('2.5 hL')} to litres. There are 2 steps down: ${c('2.5 · 100 = 250')}. It is ${c('250 L')}.</p>`,
    },
    instruccion: ej('Elige la cantidad que vale lo mismo.', 'Choose the amount that is worth the same.'),
    solucion: { es: it => explicaCambio(it, { idioma: 'es' }), en: it => explicaCambio(it, { idioma: 'en' }) },
  },
  ej3: {
    nombre: ej('Horas y minutos', 'Hours and minutes'),
    detalle: ej('Una hora son 60 minutos, no 100', 'One hour is 60 minutes, not 100'),
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Aquí el cambio no es por 10: <strong>1 h = 60 min</strong>. De horas a minutos se <strong>multiplica por 60</strong>; de minutos a horas se <strong>divide entre 60</strong>.</p>
        <p>Ejemplo: ${c('1,5 h')} a minutos: ${c('1,5 · 60 = 90')}. Son ${c('90 min')}. Y ${c('45 min')} a horas: ${c('45 : 60 = 0,75')} h.</p>`,
      en: `<h2>How it works</h2>
        <p>Here the change is not by 10: <strong>1 h = 60 min</strong>. From hours to minutes you <strong>multiply by 60</strong>; from minutes to hours you <strong>divide by 60</strong>.</p>
        <p>Example: ${c('1.5 h')} to minutes: ${c('1.5 · 60 = 90')}. It is ${c('90 min')}. And ${c('45 min')} to hours: ${c('45 : 60 = 0.75')} h.</p>`,
    },
    instruccion: ej('Elige la cantidad que vale lo mismo.', 'Choose the amount that is worth the same.'),
    solucion: { es: it => explicaTiempo(it, { idioma: 'es' }), en: it => explicaTiempo(it, { idioma: 'en' }) },
  },
  ej4: {
    nombre: ej('Complejo e incomplejo', 'Mixed units'),
    detalle: ej('3 km 250 m = 3250 m, y al revés', '3 km 250 m = 3250 m, and the other way round'),
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Una medida <strong>compleja</strong> usa dos unidades (3 km 250 m); una <strong>incompleja</strong>, una sola (3250 m). Para juntarlas, pasa la parte grande a la unidad pequeña y suma.</p>
        <p>Ejemplo: ${c('3 km 250 m')}. ${c('3 · 1000 = 3000')} m, ${c('3000 + 250 = 3250')}. Son ${c('3250 m')}. Con horas, 1 h son 60 min.</p>`,
      en: `<h2>How it works</h2>
        <p>A <strong>mixed</strong> measure uses two units (3 km 250 m); a <strong>single-unit</strong> one uses one (3250 m). To join them, change the big part to the small unit and add.</p>
        <p>Example: ${c('3 km 250 m')}. ${c('3 · 1000 = 3000')} m, ${c('3000 + 250 = 3250')}. It is ${c('3250 m')}. With hours, 1 h is 60 min.</p>`,
    },
    instruccion: ej('Escribe el número que falta (en la unidad pequeña).', 'Write the missing number (in the small unit).'),
    solucion: { es: it => explicaComplejo(it, { idioma: 'es' }), en: it => explicaComplejo(it, { idioma: 'en' }) },
  },
  ej5: {
    nombre: ej('¿Qué unidad?', 'Which unit makes sense?'),
    detalle: ej('Elegir la unidad con la que la medida es creíble', 'Choose the unit that makes the measure believable'),
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Piensa <strong>cuánto mide o pesa</strong> de verdad lo que te piden y elige la unidad con la que el número tiene sentido.</p>
        <p>Ejemplo: «una cucharada de jarabe: 5 …». Con litros serían 5 L, casi un cubo lleno; con mililitros, ${c('5 mL')}: eso sí cabe en una cuchara.</p>`,
      en: `<h2>How it works</h2>
        <p>Think about <strong>how big or heavy</strong> the thing really is, and choose the unit that makes the number believable.</p>
        <p>Example: “a spoonful of syrup: 5 …”. With litres it would be 5 L, almost a full bucket; with millilitres, ${c('5 mL')}: that does fit in a spoon.</p>`,
    },
    instruccion: ej('Elige la unidad.', 'Choose the unit.'),
    solucion: { es: it => explicaUnidad(it, { idioma: 'es' }), en: it => explicaUnidad(it, { idioma: 'en' }) },
  },
};
export { decimales, valorEn };
