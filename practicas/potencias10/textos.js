// Potencias de 10 y números grandes: textos propios, siempre { es, en }.
// Los nombres de número («one hundred thousand»…) vienen de logica.js y no se traducen:
// son el contenido que se practica.

import { agrupar, gruposDe, mostrarDeslizador, formasDe } from './logica.js';

const pot = (c, e) => (c > 1 ? `${c} · 10<sup>${e}</sup>` : `10<sup>${e}</sup>`);

// ─── «No lo sé»: la explicación de cada ejercicio ───────────────────────────────

const RESPUESTA = { es: 'La respuesta es', en: 'The answer is' };
const cuenta = s => `<span class="cuenta">${s}</span>`;

/** Ejercicio 1: el deslizador de ceros. La solución es la posición del deslizador, n. */
export function explicaDeslizador(item, { tt }) {
  const v = mostrarDeslizador(item.n);
  const regla = {
    es: 'Una potencia de 10 es un 1 seguido de tantos ceros como dice el exponente.',
    en: 'A power of 10 is a 1 followed by as many zeros as the exponent says.',
  };
  const ceros = { es: n => (n === 1 ? '1 cero' : `${n} ceros`), en: n => (n === 1 ? '1 zero' : `${n} zeros`) };
  const nombres = `${v.en}${v.enGb ? ` = ${v.enGb}` : ''} = ${v.es}`;
  const lectura = {
    es: `Aquí: ${cuenta(`10<sup>${item.n}</sup> = ${v.cifras}`)} (${tt(ceros)(item.n)}), en inglés y español: ${nombres}.`,
    en: `Here: ${cuenta(`10<sup>${item.n}</sup> = ${v.cifras}`)} (${tt(ceros)(item.n)}), in English and Spanish: ${nombres}.`,
  };
  const fin = { es: `el deslizador va en ${item.n}.`, en: `the slider goes to ${item.n}.` };
  return `${tt(regla)} ${tt(lectura)} ${tt(RESPUESTA)} ${cuenta(item.n)}: ${tt(fin)}`;
}

/** Ejercicio 2: el «and» (emparejar) o escribir con cifras (ceros de cada grupo). */
export function explicaAndOCifras(item, { tt }) {
  if (item.tipo === 'and') {
    const intro = {
      es: 'El «and» marca dónde empiezan las unidades sueltas.',
      en: 'The "and" shows where the loose units start.',
    };
    const lineas = item.nombres.map((nombre, i) => {
      const n = item.numeros[item.solucion[i]], g = gruposDe(n);
      const razon = tt(/ thousand and /.test(nombre) ? TX.and.por_que.despues : TX.and.por_que.dentro)(g.miles, g.unidades);
      return `${nombre}<br>${cuenta(`= ${agrupar(n)}`)}<br>${razon}`;
    });
    const fin = { es: 'cada nombre con el número que va debajo de él.', en: 'each name with the number written under it.' };
    return `${tt(intro)}<br>${lineas.join('<br><br>')}<br>${tt(RESPUESTA)}: ${tt(fin)}`;
  }
  const g = gruposDe(item.n);
  const regla = item.lengua === 'en' ? TX.and.pista_grupos : TX.and.pista_grupos_es;
  const lectura = {
    es: `Lee el número por grupos de tres cifras (${tt(TX.and.grupos)(g)}).`,
    en: `Read the number in groups of three digits (${tt(TX.and.grupos)(g)}).`,
  };
  return `${item.texto}<br>${tt(lectura)} ${tt(regla)}<br>${tt(RESPUESTA)} ${cuenta(agrupar(item.n))}.`;
}

/** Ejercicio 3: billion, million y trillion. */
export function explicaBillion(item, { tt }) {
  const SI = { es: 'Sí', en: 'Yes' }, NO = { es: 'No', en: 'No' };
  if (item.clase === 'mismo') {
    let h = `${item.a.texto}<br>${cuenta(`= ${agrupar(item.a.valor)}`)}<br>${item.b.texto}<br>${cuenta(`= ${agrupar(item.b.valor)}`)}<br>`;
    h += `${tt(item.verdad ? TX.billion.es_igual : TX.billion.es_distinto)}.`;
    if (item.verdad) h += ` ${tt(TX.billion.nota_billion)}`;
    else if ([item.a, item.b].some(x => /trillion/.test(x.texto))) h += ` ${tt(TX.billion.nota_trillion)}`;
    return `${h} ${tt(RESPUESTA)} ${cuenta(tt(item.verdad ? SI : NO))}.`;
  }
  const f = formasDe(item.c, item.e);
  let h = `${cuenta(`${f.cifras} = ${pot(item.c, item.e)}`)} = ${f.en}${f.enGb ? ` = ${f.enGb}` : ''} = ${f.es}.`;
  if (item.e === 9) h += ` ${tt(TX.billion.nota_billion)}`;
  if (item.e === 12) h += ` ${tt(TX.billion.nota_trillion)}`;
  const buena = item.clase === 'potencia' ? pot(item.c, item.e) : item.opciones[item.solucion];
  return `${h} ${tt(RESPUESTA)} ${cuenta(buena)}.`;
}

export const TX = {
  pot,
  desl: {
    nombre: { es: 'El deslizador de ceros', en: 'The zeros slider' },
    detalle: { es: 'Mueve el deslizador: la potencia de 10, sus ceros y su nombre', en: 'Move the slider: the power of 10, its zeros and its name' },
    cifras: {
      es: nombre => `Mueve el deslizador hasta el número <strong>${nombre}</strong>.`,
      en: nombre => `Move the slider to the number <strong>${nombre}</strong>.`,
    },
    potencia: {
      es: cifras => `¿Qué potencia de 10 es <strong>${cifras}</strong>? Mueve el deslizador hasta encontrarla.`,
      en: cifras => `Which power of 10 is <strong>${cifras}</strong>? Move the slider to find it.`,
    },
    ceros: {
      es: n => `¿Cuántos ceros tiene <strong>10<sup>${n}</sup></strong>? Mueve el deslizador hasta 10<sup>${n}</sup> y cuéntalos.`,
      en: n => `How many zeros does <strong>10<sup>${n}</sup></strong> have? Move the slider to 10<sup>${n}</sup> and count them.`,
    },
    este: { es: 'Este', en: 'This one' },
    ceros_dice: { es: n => (n === 1 ? '1 cero' : `${n} ceros`), en: n => (n === 1 ? '1 zero' : `${n} zeros`) },
    etiqueta: { es: 'Exponente', en: 'Exponent' },
    tiene: { es: 'tiene', en: 'has' },
    tu_respuesta: {
      es: n => `Has dejado el deslizador en 10<sup>${n}</sup>.`,
      en: n => `You left the slider at 10<sup>${n}</sup>.`,
    },
    gb: { es: 'en inglés británico', en: 'in British English' },
  },
  and: {
    nombre: { es: 'El «and» y los ceros', en: 'The "and" and the zeros' },
    detalle: { es: 'Emparejar nombres y escribir números con ceros en cada grupo', en: 'Match names and write numbers with zeros in each group' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>En inglés, la posición del <strong>and</strong> cambia el número: <strong>four hundred thousand and twenty</strong> es 400&nbsp;020, pero <strong>four hundred and twenty thousand</strong> es 420&nbsp;000.</p>
        <p>A veces tendrás que emparejar dos nombres con dos números y otras escribir con cifras un número grande. Cada grupo de tres cifras se rellena con ceros si hace falta.</p>`,
      en: `<h2>How it works</h2>
        <p>In English, the position of <strong>and</strong> changes the number: <strong>four hundred thousand and twenty</strong> is 400&nbsp;020, but <strong>four hundred and twenty thousand</strong> is 420&nbsp;000.</p>
        <p>Sometimes you match two names with two numbers, and sometimes you write a big number in figures. Each group of three digits is filled with zeros when needed.</p>`,
    },
    empareja: {
      es: 'Elige el número que corresponde a cada nombre.',
      en: 'Choose the number that matches each name.',
    },
    escribe: {
      es: texto => `Escribe con cifras: <strong>${texto}</strong>`,
      en: texto => `Write in figures: <strong>${texto}</strong>`,
    },
    por_que: {
      despues: {
        es: (miles, unidades) => `El «and» va después de «thousand», así que lo que sigue son las unidades sueltas. Miles: ${miles} · unidades: ${unidades}.`,
        en: (miles, unidades) => `The "and" comes after "thousand", so what follows is the loose units. Thousands: ${miles} · units: ${unidades}.`,
      },
      dentro: {
        es: (miles, unidades) => `El «and» va antes de «thousand», dentro de los miles. Miles: ${miles} · unidades: ${unidades}.`,
        en: (miles, unidades) => `The "and" comes before "thousand", inside the thousands. Thousands: ${miles} · units: ${unidades}.`,
      },
    },
    borrar: { es: 'Borrar', en: 'Delete' },
    vacio: { es: 'Pulsa las cifras', en: 'Press the digits' },
    grupos: {
      es: g => `${g.millones ? `millones: ${g.millones} · ` : ''}miles: ${g.miles} · unidades: ${g.unidades}`,
      en: g => `${g.millones ? `millions: ${g.millones} · ` : ''}thousands: ${g.miles} · units: ${g.unidades}`,
    },
    tu_respuesta: {
      es: n => `Has escrito <span class="cuenta">${n}</span>, que no es.`,
      en: n => `You wrote <span class="cuenta">${n}</span>, which is not right.`,
    },
    pista_grupos: {
      es: 'Cada grupo de tres cifras se rellena con ceros: «two thousand» → 002.',
      en: 'Each group of three digits is filled with zeros: "two thousand" → 002.',
    },
    pista_grupos_es: {
      es: 'Cada grupo de tres cifras se rellena con ceros: «dos mil» → 002.',
      en: 'Each group of three digits is filled with zeros: "dos mil" → 002.',
    },
  },
  billion: {
    nombre: { es: 'Billion, million y trillion', en: 'Billion, million and trillion' },
    detalle: { es: 'Nombres de números muy grandes en inglés y en español', en: 'Names of very big numbers in English and Spanish' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Hoy, en inglés, <strong>one billion</strong> es 10<sup>9</sup> (mil millones). También se dice <strong>one thousand million</strong> (inglés británico): es el mismo número.</p>
        <p><strong>One trillion</strong> es 10<sup>12</sup>, que en español es <strong>un billón</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p>Today, in English, <strong>one billion</strong> is 10<sup>9</sup> (mil millones in Spanish). It is also called <strong>one thousand million</strong> (British English): it is the same number.</p>
        <p><strong>One trillion</strong> is 10<sup>12</sup>, which is <strong>un billón</strong> in Spanish.</p>`,
    },
    potencia: {
      es: (nombre, uso) => `¿Cuánto vale <strong>${nombre}</strong>${uso ? ` (${uso})` : ''}?`,
      en: (nombre, uso) => `What is <strong>${nombre}</strong>${uso ? ` (${uso})` : ''} equal to?`,
    },
    en_ingles: {
      es: (cifras, p) => `¿Cómo se dice en inglés <strong>${cifras}</strong> (${p})?`,
      en: (cifras, p) => `How do you say <strong>${cifras}</strong> (${p}) in English?`,
    },
    en_espanol: {
      es: (nombre, uso) => `¿Cómo se dice en español <strong>${nombre}</strong>${uso ? ` (${uso})` : ''}?`,
      en: (nombre, uso) => `How do you say <strong>${nombre}</strong>${uso ? ` (${uso})` : ''} in Spanish?`,
    },
    mismo: {
      es: (a, b) => `¿Nombran el mismo número <strong>${a}</strong> y <strong>${b}</strong>?`,
      en: (a, b) => `Do <strong>${a}</strong> and <strong>${b}</strong> name the same number?`,
    },
    es_igual: { es: 'son el mismo número', en: 'are the same number' },
    es_distinto: { es: 'son números distintos', en: 'are different numbers' },
    nota_billion: {
      es: 'Hoy, en inglés, billion es 10<sup>9</sup> (mil millones); thousand million es lo mismo.',
      en: 'Today, in English, billion is 10<sup>9</sup> (mil millones in Spanish); thousand million is the same.',
    },
    nota_trillion: {
      es: 'Trillion es 10<sup>12</sup>, que en español es «billón»; billion y billón no son lo mismo.',
      en: 'Trillion is 10<sup>12</sup>, which is "billón" in Spanish; billion and billón are not the same.',
    },
  },
};
