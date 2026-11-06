// Práctica «Suma y resta decimales»: textos propios, siempre { es, en }. Los comunes (Comprobar,
// Siguiente, Sí, No…) llegan a `montar` en `api.t`.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md, unidad 5): la coma en español y el punto en
// inglés (todo número sale de `aTexto(d, idioma)`); producto con «·» y división con «:» también en
// inglés; sin porcentajes, letras, fracciones ni «×»; unidades en inglés británico (metres, litres,
// kilograms); *change* se aclara «(la vuelta)»; el feedback dice qué pasa con LOS NÚMEROS DE ESE ÍTEM.

import { aTexto, decimal } from '../_comun/decimales.js';
import { D, CONTEXTOS_MEDIDAS, totalCentimos, respuestaSuper } from './logica.js';

const n = (d, idioma) => aTexto(D(d).normalizar(), idioma);
const bi = f => ({ es: (...a) => f('es', ...a), en: (...a) => f('en', ...a) });
/** Una cuenta corta que no se parte. */
const c = t => `<span class="cuenta">${t}</span>`;
/** Una cuenta larga, que puede partirse. */
const cl = t => `<span class="cuenta-frac">${t}</span>`;
const MENOS = '−';
const euros = (cents, idioma) => aTexto(decimal(cents, 2), idioma);
const eur = (cents, idioma) => (idioma === 'en' ? `€${euros(cents, 'en')}` : `${euros(cents, 'es')} €`);

/** La cuenta con las comas alineadas: «2,50 + 1,25 = 3,75» (todos con las mismas cifras decimales). */
export function cuentaAlineada(terminos, ops, resultado, idioma, sufijo = '') {
  const k = Math.max(...terminos.map(t => D(t).k), D(resultado).k);
  const mostrar = x => aTexto(D(x).conCifras(k), idioma);
  const partes = [mostrar(terminos[0])];
  ops.forEach((op, i) => partes.push(op, mostrar(terminos[i + 1])));
  return `${partes.join(' ')} = ${mostrar(resultado)}${sufijo}`;
}

const UNIDAD = { m: { es: 'm', en: 'm' }, L: { es: 'L', en: 'L' }, kg: { es: 'kg', en: 'kg' } };
const unidadDe = (item, idioma) => UNIDAD[CONTEXTOS_MEDIDAS[item.contexto].unidad][idioma];

// ─── Enunciados con contexto (se usan en practica.js y en el test) ─────────────────────────────

/** El enunciado del súper: { lineas: [html] | null, texto, pregunta } */
export function enunciadoSuper(item, idioma) {
  const es = idioma === 'es';
  const billete = item.billete ? (es ? `${item.billete} €` : `€${item.billete}`) : '';
  if (item.contexto === 'fruta') {
    const lineas = item.importes.map((cts, i) => `<li><span>${item.nombres[i][idioma]}</span> <strong>${eur(cts, idioma)}</strong></li>`);
    return {
      lineas,
      texto: es ? 'En la frutería, la fruta se paga al peso. El importe de cada una ya está calculado.'
        : 'At the greengrocer\'s, fruit is paid for by weight. The amount for each one is already worked out.',
      pregunta: item.pregunta === 'total'
        ? (es ? '¿Cuánto pagas en total?' : 'How much do you pay in total?')
        : (es ? `Pagas con un billete de ${billete}. ¿Cuánto te devuelven (la vuelta)?` : `You pay with a ${billete} note. How much change (la vuelta) do you get?`),
    };
  }
  if (item.pregunta === 'total') {
    const [a, b] = item.importes;
    return {
      lineas: null,
      texto: es ? `Echas gasolina dos veces: ${eur(a, idioma)} y ${eur(b, idioma)}.` : `You put petrol (gasolina) in your car twice: ${eur(a, idioma)} and ${eur(b, idioma)}.`,
      pregunta: es ? '¿Cuánto has pagado en total?' : 'How much have you paid in total?',
    };
  }
  return {
    lineas: null,
    texto: es ? `Echas gasolina por ${eur(item.importes[0], idioma)} y pagas con un billete de ${billete}.`
      : `You buy petrol (gasolina) for ${eur(item.importes[0], idioma)} and pay with a ${billete} note.`,
    pregunta: es ? '¿Cuánto te devuelven (la vuelta)?' : 'How much change (la vuelta) do you get?',
  };
}

/** El enunciado de las medidas, con las cantidades en el idioma pedido. */
export function enunciadoMedidas(item, idioma) {
  const [a, b, d] = item.datos.map(x => n(x, idioma));
  const es = idioma === 'es';
  switch (item.contexto) {
    case 'liston':
      return es ? `Un listón de madera mide ${a} m. Se cortan dos trozos: uno de ${b} m y otro de ${d} m. ¿Cuántos metros mide lo que queda?`
        : `A wooden strip is ${a} metres long. Two pieces are cut off: one of ${b} metres and one of ${d} metres. How many metres are left (lo que queda)?`;
    case 'botella':
      return es ? `Una botella tiene ${a} L de agua. Se llenan dos vasos: uno de ${b} L y otro de ${d} L. ¿Cuántos litros quedan en la botella?`
        : `A bottle holds ${a} litres of water. Two glasses are filled from it: one of ${b} litres and one of ${d} litres. How many litres are left in the bottle?`;
    case 'personas':
      return es ? `Dos amigos se miden: uno mide ${a} m y el otro ${b} m. ¿Cuántos metros más alto es el segundo?`
        : `Two friends measure their height: one is ${a} metres tall and the other is ${b} metres tall. How many metres taller (más alto) is the second one?`;
    default:
      return es ? `Dos paquetes pesan ${a} kg y ${b} kg. ¿Cuántos kilos pesan juntos?`
        : `Two parcels weigh (pesan) ${a} kilograms and ${b} kilograms. How many kilograms do they weigh together?`;
  }
}

/** La cuenta de las medidas, con las comas alineadas y la unidad. */
export function cuentaMedidas(item, idioma) {
  const t = item.datos;
  const unidad = ` ${unidadDe(item, idioma)}`;
  if (item.forma === 'resto2') return cl(cuentaAlineada(t, ['−', '−'], item.respuesta, idioma, unidad));
  if (item.forma === 'diferencia') return c(cuentaAlineada([t[1], t[0]], ['−'], item.respuesta, idioma, unidad));
  return c(cuentaAlineada(t, ['+'], item.respuesta, idioma, unidad));
}

/** La cuenta del súper: el total, y la vuelta si se pregunta. */
export function cuentaSuper(item, idioma) {
  const sufijo = idioma === 'en' ? ' euros' : ' €';
  const total = totalCentimos(item);
  const ts = item.importes.map(cts => ({ m: cts, k: 2 }));
  const suma = item.importes.length > 1 ? cuentaAlineada(ts, item.importes.slice(1).map(() => '+'), { m: total, k: 2 }, idioma, sufijo) : `${euros(total, idioma)}${sufijo}`;
  if (item.pregunta === 'total') return cl(suma);
  const resta = cuentaAlineada([{ m: item.billete * 100, k: 2 }, { m: total, k: 2 }], ['−'], respuestaSuper(item), idioma, sufijo);
  const total1 = item.importes.length > 1 ? `${idioma === 'es' ? 'Total' : 'Total'}: ${cl(suma)}. ` : '';
  return `${total1}${idioma === 'es' ? 'Vuelta' : 'Change'}: ${cl(resta)}`;
}

// ─── Ejercicio 1: alinea la coma ───────────────────────────────────────────────────────────────

/** El cálculo del ítem tal como se enseña: «2,5 + 1,25» o «15 + 0,7 − 4,25». */
export function calculoAlinea(item, idioma) {
  if (item.tipo === 'tres') {
    const t = item.terminos.map(x => n(x, idioma));
    return `${t[0]} ${item.ops[0]} ${t[1]} ${item.ops[1]} ${t[2]}`;
  }
  return `${n(item.a, idioma)} ${item.op} ${n(item.b, idioma)}`;
}
const terminosDe = item => (item.tipo === 'tres' ? item.terminos : [item.a, item.b]);
const opsDe = item => (item.tipo === 'tres' ? item.ops : [item.op]);
export const solucionAlinea = (item, idioma) => (item.tipo === 'tres' ? cl : c)(cuentaAlineada(terminosDe(item), opsDe(item), item.resultado, idioma));

const PARTES_Y_SUMAS = (item, idioma) => {
  const a = D(item.a), b = D(item.b);
  const dec = x => (x.k === 0 ? 0 : Math.abs(x.m) % 10 ** x.k);
  return { dA: dec(a), dB: dec(b), idioma };
};

// ─── Ejercicio 4: mueve la coma ────────────────────────────────────────────────────────────────

export const calculoMueve = (item, idioma) => `${n(item.d, idioma)} ${item.op === 'por' ? '·' : ':'} ${10 ** item.n}`;
const lugares = (k, es) => (es ? (k === 1 ? '1 lugar' : `${k} lugares`) : (k === 1 ? '1 place' : `${k} places`));

// ─── Los textos ────────────────────────────────────────────────────────────────────────────────

export const TX = {
  campos: {
    resultado: { es: 'Resultado', en: 'Result' },
    importe: { es: 'Importe en euros', en: 'Amount in euros' },
  },
  otra: bi((i, item, v) => (i === 'es' ? `${n(v, i)} no es la respuesta. ` : `${n(v, i)} is not the answer. `)),

  // ─── Ejercicio 1 ───────────────────────────────────────────────────────────────────────────
  ej1: {
    nombre: { es: 'Alinea la coma', en: 'Line up the points' },
    detalle: { es: 'Pon las comas una debajo de otra', en: 'Put the decimal points in a line' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p><strong>Alinea las comas</strong> una debajo de otra y rellena con ceros las cifras que falten. Después, suma o resta columna a columna, de derecha a izquierda.</p>
        <p>Ejemplo: ${c('6,5 + 2,35 = 6,50 + 2,35 = 8,85')}.</p>
        <p>Un número natural también tiene coma: ${c('9 − 0,6 = 9,0 − 0,6 = 8,4')}.</p>
        <p>Resuelve cada ejercicio y pulsa <strong>Comprobar</strong>.</p>`,
      en: `<h2>How it works</h2>
        <p><strong>Line up the decimal points</strong> one under the other and fill the gaps with zeros. Then add or subtract column by column, from right to left.</p>
        <p>Example: ${c('6.5 + 2.35 = 6.50 + 2.35 = 8.85')}.</p>
        <p>A whole number has a point too: ${c('9 − 0.6 = 9.0 − 0.6 = 8.4')}.</p>
        <p>Solve each exercise and press <strong>Check</strong>.</p>`,
    },
    instruccion: {
      escribir: { es: 'Calcula. Alinea las comas.', en: 'Work it out. Line up the decimal points.' },
      elegir: { es: '¿Cuál es el resultado?', en: 'Which is the answer?' },
      tres: { es: 'Calcula. Alinea las comas.', en: 'Work it out. Line up the decimal points.' },
    },
    correcto: bi((i, item) => `${solucionAlinea(item, i)}.`),
    solucion: bi((i, item) => (i === 'es'
      ? `Se alinean las comas y se rellena con ceros: ${solucionAlinea(item, i)}.`
      : `Line up the decimal points and fill the gaps with zeros: ${solucionAlinea(item, i)}.`)),
    por_que: {
      'alinea-a-la-derecha': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} sale de alinear los números a la derecha, sin mirar las comas. Las comas van una debajo de otra. `
        : `${n(v, i)} comes from lining the numbers up on the right, without looking at the decimal points. The points go one under the other. `)),
      'decimales-por-separado': bi((i, item, v) => {
        const { dA, dB } = PARTES_Y_SUMAS(item, i);
        return i === 'es'
          ? `${n(v, i)} sale de sumar aparte las partes enteras y las decimales (${dA} + ${dB} = ${dA + dB} detrás de la coma). Hay que colocar las cifras en columnas y llevar. `
          : `${n(v, i)} comes from adding the whole parts and the decimal parts separately (${dA} + ${dB} = ${dA + dB} after the point). Put the digits in columns and carry. `;
      }),
      'columnas-al-reves': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} sale de restar en cada columna la cifra pequeña de la grande. Se resta siempre la de abajo a la de arriba, pidiendo prestado si hace falta. `
        : `${n(v, i)} comes from taking the smaller digit from the bigger one in every column. Always take the bottom digit from the top one, borrowing when you need to. `)),
      'coma-olvidada': bi((i, item, v) => (i === 'es'
        ? `Falta la coma: ${n(v, i)} tiene las cifras bien, pero el resultado lleva ${D(item.resultado).normalizar().k} ${D(item.resultado).normalizar().k === 1 ? 'cifra decimal' : 'cifras decimales'}. `
        : `The decimal point is missing: ${n(v, i)} has the right digits, but the answer has ${D(item.resultado).normalizar().k} decimal ${D(item.resultado).normalizar().k === 1 ? 'place' : 'places'}. `)),
      'coma-corrida': bi((i, item, v) => (i === 'es'
        ? `En ${n(v, i)} las cifras están bien, pero la coma no está en su sitio. `
        : `In ${n(v, i)} the digits are right, but the decimal point is in the wrong place. `)),
      'otra-respuesta': bi((i, item, v) => (i === 'es' ? `${n(v, i)} no es la respuesta. ` : `${n(v, i)} is not the answer. `)),
    },
  },

  // ─── Ejercicio 2 ───────────────────────────────────────────────────────────────────────────
  ej2: {
    nombre: { es: 'En el súper', en: 'At the supermarket' },
    detalle: { es: 'El total y la vuelta', en: 'The total and the change' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Para el <strong>total</strong>, suma los importes alineando las comas. Para la <strong>vuelta</strong>, resta el total al billete: <strong>vuelta = billete − total</strong>.</p>
        <p>Ejemplo: peras 1,40 € y uvas 2,85 €; pagas con 10 €. Total: ${c('1,40 + 2,85 = 4,25 €')}. Vuelta: ${c('10,00 − 4,25 = 5,75 €')}.</p>
        <p>Escribe el importe con <strong>dos decimales</strong> (euros y céntimos): 3,50 (también vale 3,5).</p>`,
      en: `<h2>How it works</h2>
        <p>For the <strong>total</strong>, add the amounts lining up the decimal points. For the <strong>change</strong> (la vuelta), take the total away from the note: <strong>change = note − total</strong>.</p>
        <p>Example: pears €1.40 and grapes €2.85; you pay with a €10 note. Total: ${c('1.40 + 2.85 = 4.25 euros')}. Change: ${c('10.00 − 4.25 = 5.75 euros')}.</p>
        <p>Write the amount with <strong>two decimal places</strong> (euros and cents): 3.50 (3.5 is fine too).</p>`,
    },
    instruccion: { es: 'Escribe el importe en euros, con dos decimales.', en: 'Write the amount in euros, with two decimal places.' },
    correcto: bi((i, item) => `${cuentaSuper(item, i)}.`),
    solucion: bi((i, item) => `${cuentaSuper(item, i)}.`),
    por_que: {
      'centimos-sin-llevar': bi((i, item, v) => {
        const e = item.importes.reduce((s, x) => s + Math.floor(x / 100), 0), ce = item.importes.reduce((s, x) => s + (x % 100), 0);
        return i === 'es'
          ? `${n(v, i)} sale de sumar los euros (${e}) y los céntimos (${ce}) por separado. ${ce} céntimos son más de un euro: hay que llevarlos a los euros. `
          : `${n(v, i)} comes from adding the euros (${e}) and the cents (${ce}) separately. ${ce} cents are more than one euro: carry them to the euros. `;
      }),
      'resta-al-reves': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} sale de restar al revés: el billete (${item.billete} €) es mayor que el total (${euros(totalCentimos(item), i)} €), así que la vuelta es billete − total. `
        : `${n(v, i)} comes from subtracting the wrong way round: the note (€${item.billete}) is bigger than the total (€${euros(totalCentimos(item), i)}), so the change is note − total. `)),
      'da-el-total': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} € es lo que cuesta; la vuelta es lo que sobra del billete: ${item.billete} − ${euros(totalCentimos(item), i)}. `
        : `€${n(v, i)} is what it costs; the change is what is left of the note: ${item.billete} − ${euros(totalCentimos(item), i)}. `)),
      'otra-respuesta': bi((i, item, v) => (i === 'es' ? `${n(v, i)} no es la respuesta. ` : `${n(v, i)} is not the answer. `)),
    },
  },

  // ─── Ejercicio 3 ───────────────────────────────────────────────────────────────────────────
  ej3: {
    nombre: { es: 'Medidas', en: 'Measures' },
    detalle: { es: 'Metros, litros y kilos', en: 'Metres, litres and kilograms' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Lee con cuidado qué piden: ¿lo que <strong>queda</strong> (se resta), cuánto <strong>más</strong> (se resta) o lo que pesan <strong>juntos</strong> (se suma)? Después alinea las comas.</p>
        <p>Ejemplo: una cuerda de 3,5 m de la que se corta un trozo de 1,25 m. Queda ${c('3,50 − 1,25 = 2,25 m')}.</p>`,
      en: `<h2>How it works</h2>
        <p>Read carefully what they ask: what is <strong>left</strong> (subtract), how much <strong>more</strong> (subtract) or the weight <strong>together</strong> (add)? Then line up the decimal points.</p>
        <p>Example: a 3.5 m rope from which a 1.25 m piece is cut. What is left is ${c('3.50 − 1.25 = 2.25 m')}.</p>`,
    },
    instruccion: {
      escribir: { es: 'Escribe el resultado (solo el número).', en: 'Write the answer (the number only).' },
      elegir: { es: '¿Cuál es el resultado?', en: 'Which is the answer?' },
    },
    correcto: bi((i, item) => `${cuentaMedidas(item, i)}.`),
    solucion: bi((i, item) => `${cuentaMedidas(item, i)}.`),
    por_que: {
      'alinea-a-la-derecha': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} sale de alinear los números a la derecha, sin mirar las comas. `
        : `${n(v, i)} comes from lining the numbers up on the right, without looking at the decimal points. `)),
      'olvida-un-trozo': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} sale de quitar solo un trozo (${n(item.datos[1], i)}): hay que quitar también el otro (${n(item.datos[2], i)}). `
        : `${n(v, i)} comes from taking away only one piece (${n(item.datos[1], i)}): take away the other one (${n(item.datos[2], i)}) too. `)),
      'da-lo-cortado': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} es lo que se ha quitado (${n(item.datos[1], i)} + ${n(item.datos[2], i)}), y piden lo que queda. `
        : `${n(v, i)} is what was taken away (${n(item.datos[1], i)} + ${n(item.datos[2], i)}), and they ask for what is left. `)),
      'suma-en-vez-de-resta': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} sale de sumar. «Cuánto más» se calcula restando: ${n(item.datos[1], i)} ${MENOS} ${n(item.datos[0], i)}. `
        : `${n(v, i)} comes from adding. «How much more» is worked out by subtracting: ${n(item.datos[1], i)} ${MENOS} ${n(item.datos[0], i)}. `)),
      'coma-olvidada': bi((i, item, v) => (i === 'es'
        ? `Falta la coma: ${n(v, i)} tiene las cifras bien, pero el resultado lleva ${D(item.respuesta).normalizar().k} cifras decimales. `
        : `The decimal point is missing: ${n(v, i)} has the right digits, but the answer has ${D(item.respuesta).normalizar().k} decimal places. `)),
      'coma-corrida': bi((i, item, v) => (i === 'es'
        ? `En ${n(v, i)} las cifras están bien, pero la coma no está en su sitio. `
        : `In ${n(v, i)} the digits are right, but the decimal point is in the wrong place. `)),
      'otra-respuesta': bi((i, item, v) => (i === 'es' ? `${n(v, i)} no es la respuesta. ` : `${n(v, i)} is not the answer. `)),
    },
  },

  // ─── Ejercicio 4 ───────────────────────────────────────────────────────────────────────────
  ej4: {
    nombre: { es: 'Mueve la coma', en: 'Move the point' },
    detalle: { es: 'Por 10, 100 y 1000', en: 'Times and divided by 10, 100 and 1000' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p><strong>Multiplicar</strong> por 10, 100 o 1000: la coma se mueve a la <strong>derecha</strong> 1, 2 o 3 lugares (si faltan cifras, se añaden ceros).</p>
        <p><strong>Dividir</strong> entre 10, 100 o 1000: la coma se mueve a la <strong>izquierda</strong> 1, 2 o 3 lugares.</p>
        <p>Ejemplo: ${c('4,7 · 100 = 470')} y ${c('4,7 : 100 = 0,047')}.</p>
        <p><strong>Ojo:</strong> ${c('2,5 · 10 = 25')}, no 2,50: añadir un cero detrás no cambia el número.</p>`,
      en: `<h2>How it works</h2>
        <p><strong>Multiplying</strong> by 10, 100 or 1000: the point moves <strong>right</strong> 1, 2 or 3 places (if there are not enough digits, add zeros).</p>
        <p><strong>Dividing</strong> by 10, 100 or 1000: the point moves <strong>left</strong> 1, 2 or 3 places.</p>
        <p>Example: ${c('4.7 · 100 = 470')} and ${c('4.7 : 100 = 0.047')}.</p>
        <p><strong>Careful:</strong> ${c('2.5 · 10 = 25')}, not 2.50: adding a zero at the end does not change the number.</p>`,
    },
    instruccion: {
      escribir: { es: 'Mueve la coma y escribe el resultado.', en: 'Move the decimal point and write the answer.' },
      elegir: { es: 'Mueve la coma. ¿Cuál es el resultado?', en: 'Move the decimal point. Which is the answer?' },
    },
    correcto: bi((i, item) => `${c(`${calculoMueve(item, i)} = ${n(item.respuesta, i)}`)}.`),
    solucion: bi((i, item) => {
      const por = item.op === 'por';
      const lado = i === 'es' ? (por ? 'derecha' : 'izquierda') : (por ? 'right' : 'left');
      return i === 'es'
        ? `${c(`${calculoMueve(item, i)} = ${n(item.respuesta, i)}`)}: la coma se mueve ${lugares(item.n, true)} a la ${lado} (tantos como ceros tiene ${10 ** item.n}).`
        : `${c(`${calculoMueve(item, i)} = ${n(item.respuesta, i)}`)}: the point moves ${lugares(item.n, false)} to the ${lado} (as many as the zeros in ${10 ** item.n}).`;
    }),
    por_que: {
      'por-diez-anadiendo-cero': bi((i, item, v) => (i === 'es'
        ? `${aTexto(D(v), i)} sale de añadir ${item.n === 1 ? 'un cero' : `${item.n} ceros`} detrás, y eso no cambia el número: ${n(item.d, i)} sigue siendo ${n(item.d, i)}. `
        : `${aTexto(D(v), i)} comes from adding ${item.n === 1 ? 'a zero' : `${item.n} zeros`} at the end, and that does not change the number: ${n(item.d, i)} is still ${n(item.d, i)}. `)),
      'coma-al-reves': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} sale de mover la coma hacia el otro lado. ${item.op === 'por' ? 'Multiplicar' : 'Dividir'} ${item.op === 'por' ? 'hace el número mayor' : 'hace el número menor'}. `
        : `${n(v, i)} comes from moving the point the other way. ${item.op === 'por' ? 'Multiplying makes the number bigger' : 'Dividing makes the number smaller'}. `)),
      'coma-un-solo-lugar': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} sale de mover la coma un solo lugar. ${10 ** item.n} tiene ${item.n} ceros: son ${lugares(item.n, true)}. `
        : `${n(v, i)} comes from moving the point only one place. ${10 ** item.n} has ${item.n} zeros: that is ${lugares(item.n, false)}. `)),
      'coma-de-mas': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} sale de mover la coma un lugar de más. ${10 ** item.n} tiene ${item.n} ${item.n === 1 ? 'cero' : 'ceros'}: son ${lugares(item.n, true)}. `
        : `${n(v, i)} comes from moving the point one place too many. ${10 ** item.n} has ${item.n} ${item.n === 1 ? 'zero' : 'zeros'}: that is ${lugares(item.n, false)}. `)),
      'otra-respuesta': bi((i, item, v) => (i === 'es' ? `${n(v, i)} no es la respuesta. ` : `${n(v, i)} is not the answer. `)),
    },
  },
};
