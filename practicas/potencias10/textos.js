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
  // Revisión 193: antes, «La respuesta es 8: el deslizador va en 8» (el 8 dos veces y sin decir qué es).
  const sol = item.pide === 'ceros' ? tt(ceros)(item.n) : `10<sup>${item.n}</sup>`;
  const fin = { es: `(el deslizador, en ${item.n})`, en: `(the slider at ${item.n})` };
  return `${tt(regla)} ${tt(lectura)} ${tt(RESPUESTA)} ${cuenta(sol)} ${tt(fin)}.`;
}

const mayuscula = s => s[0].toUpperCase() + s.slice(1);
const de3 = x => String(x).padStart(3, '0');

/**
 * Por qué un nombre con «and» vale lo que vale: dónde va el «and» respecto a «thousand» (miles y unidades del número).
 * La usan la tarjeta del «No lo sé» y el feedback del ejercicio 2 (reabierta del 14-11 de la tarea 28).
 */
export function razonAnd(nombre, n, tt) {
  const g = gruposDe(n);
  return tt(/ thousand and /.test(nombre)
    ? { es: `el «and» va después de «thousand», así que lo que sigue son las unidades (miles ${g.miles}; unidades ${g.unidades}).`,
        en: `the “and” comes after “thousand”, so what follows is the units (thousands ${g.miles}; units ${g.unidades}).` }
    : { es: `el «and» va antes de «thousand», dentro de los miles (miles ${g.miles}; unidades ${g.unidades}).`,
        en: `the “and” comes before “thousand”, inside the thousands (thousands ${g.miles}; units ${g.unidades}).` });
}

/** Feedback del ejercicio 2, emparejar: cada nombre con su número y la razón (la misma que la tarjeta). */
export function feedbackAnd(item, { tt }) {
  return item.nombres.map((nombre, i) => {
    const n = item.numeros[item.solucion[i]];
    return `${nombre}<br><span class="cuenta">= ${agrupar(n)}</span><br>${razonAnd(nombre, n, tt)}`;
  }).join('<br><br>');
}

/** Feedback del ejercicio 2, escribir con cifras: el número y sus grupos (con «;», nunca «·»). */
export function feedbackCifras(item, escrito, acierto, { tt }) {
  const g = gruposDe(item.n);
  const buena = `${item.texto}<br><span class="cuenta">= ${agrupar(item.n)}</span><br>${tt(TX.and.grupos)(g)}`;
  if (acierto) return buena;
  return `${tt(TX.and.tu_respuesta)(agrupar(Number(escrito)))} ${buena}<br>${tt(item.lengua === 'en' ? TX.and.pista_grupos : TX.and.pista_grupos_es)}`;
}

/** Ejercicio 2: el «and» (emparejar) o escribir con cifras (ceros de cada grupo). */
export function explicaAndOCifras(item, { tt }) {
  // Revisión 193: la regla de delante («el and marca dónde empiezan las unidades») era falsa en el segundo
  // nombre («five hundred and sixty thousand»: ahí el and va dentro de los miles); la respuesta acababa en
  // «La respuesta es: cada nombre con el número que va debajo»; y los grupos se separaban con «·», que en
  // esta unidad es el signo de multiplicar. El feedback usa la misma razón (`razonAnd`).
  if (item.tipo === 'and') {
    const regla = {
      es: 'Fíjate en si el «and» va después o antes de «thousand».',
      en: 'Look at whether the “and” comes after or before “thousand”.',
    };
    const pares = item.nombres.map((nombre, i) => ({ nombre, n: item.numeros[item.solucion[i]] }));
    const lineas = pares.map(({ nombre, n }) => `${tt({ es: `«${nombre}»: `, en: `“${nombre}”: ` })}${razonAnd(nombre, n, tt)}`);
    const [p, q] = pares.map(({ nombre, n }) => cuenta(`${nombre} = ${agrupar(n)}`));
    const fin = { es: `${p} y ${q}`, en: `${p} and ${q}` };
    return `${tt(regla)}<ol class="pasos-ayuda">${lineas.map(l => `<li>${l}</li>`).join('')}</ol>${tt(RESPUESTA)} ${tt(fin)}.`;
  }
  const g = gruposDe(item.n);
  const k = Math.floor((item.n % 1e6) / 1e3), u = item.n % 1e3;
  const regla = { es: 'Se escribe por grupos de tres cifras: millones, miles y unidades.', en: 'Write it in groups of three digits: millions, thousands and units.' };
  // Lo que suele fallar, con los números del ítem: un grupo corto lleva ceros delante y un grupo que no se dice es 000.
  const corto = [k, u].find(x => x > 0 && x < 100);
  const ojo = [
    corto === undefined ? null : { es: `cada grupo lleva tres cifras (${corto} → ${de3(corto)})`, en: `each group has three digits (${corto} → ${de3(corto)})` },
    k === 0 || u === 0 ? { es: 'un grupo que no se dice es 000', en: 'a group that is not said is 000' } : null,
  ].filter(Boolean).map(tt);
  const aviso = ojo.length ? ` ${mayuscula(ojo.join(tt({ es: ', y ', en: ', and ' })))}.` : '';
  const grupos = { es: `Aquí: millones ${g.millones}; miles ${g.miles}; unidades ${g.unidades}.`, en: `Here: millions ${g.millones}; thousands ${g.miles}; units ${g.unidades}.` };
  return `${tt(regla)}${aviso} ${tt(grupos)} ${tt(RESPUESTA)} ${cuenta(agrupar(item.n))}.`;
}

/** Ejercicio 3: billion, million y trillion. */
export function explicaBillion(item, { tt }) {
  // Revisión 193: «son el mismo número» empezaba línea en minúscula y «La respuesta es Sí» llevaba mayúscula a
  // media frase; ahora, una frase con mayúscula y el botón entre comillas.
  const SI = { es: '«Sí»', en: '“Yes”' }, NO = { es: '«No»', en: '“No”' };
  if (item.clase === 'mismo') {
    let h = `${cuenta(`${item.a.texto} = ${agrupar(item.a.valor)}`)}<br>${cuenta(`${item.b.texto} = ${agrupar(item.b.valor)}`)}<br>`;
    h += tt(item.verdad ? { es: 'Son el mismo número.', en: 'They are the same number.' } : { es: 'Son números distintos.', en: 'They are different numbers.' });
    if (item.verdad) h += ` ${tt(TX.billion.nota_billion)}`;
    else if ([item.a, item.b].some(x => /trillion/.test(x.texto))) h += ` ${tt(TX.billion.nota_trillion)}`;
    return `${h} ${tt(RESPUESTA)} ${tt(item.verdad ? SI : NO)}.`;
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
    nombre: { es: 'El «and» y los ceros', en: 'The “and” and the zeros' },
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
    borrar: { es: 'Borrar', en: 'Delete' },
    vacio: { es: 'Pulsa las cifras', en: 'Press the digits' },
    grupos: {
      es: g => `${g.millones ? `millones ${g.millones}; ` : ''}miles ${g.miles}; unidades ${g.unidades}`,
      en: g => `${g.millones ? `millions ${g.millones}; ` : ''}thousands ${g.miles}; units ${g.unidades}`,
    },
    tu_respuesta: {
      es: n => `Has escrito <span class="cuenta">${n}</span>, que no es.`,
      en: n => `You wrote <span class="cuenta">${n}</span>, which is not right.`,
    },
    pista_grupos: {
      es: 'Cada grupo de tres cifras se rellena con ceros: «two thousand» → 002.',
      en: 'Each group of three digits is filled with zeros: “two thousand” → 002.',
    },
    pista_grupos_es: {
      es: 'Cada grupo de tres cifras se rellena con ceros: «dos mil» → 002.',
      en: 'Each group of three digits is filled with zeros: “dos mil” → 002.',
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
      en: 'Trillion is 10<sup>12</sup>, which is “billón” in Spanish; billion and billón are not the same.',
    },
  },
};
