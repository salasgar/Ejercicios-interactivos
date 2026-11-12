// Práctica «Multiplica y divide decimales»: textos propios, siempre { es, en }. Los comunes (Comprobar,
// Siguiente, Sí, No…) llegan a `montar` en `api.t`.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md, unidad 5): la coma en español y el punto en
// inglés (todo número sale de `aTexto(d, idioma)`); producto con «·» y división con «:» también en
// inglés; sin porcentajes, letras, fracciones ni «×»; unidades en inglés británico; la palabra no
// matemática que decide la respuesta se aclara entre paréntesis; el feedback habla de LOS NÚMEROS DE ESE ÍTEM.

import { aTexto, decimal, sumar, multiplicar, porPotenciaDe10 } from '../_comun/decimales.js';
import { D, pasosNatural, pasosCombinada, textoExpresion } from './logica.js';

const n = (d, idioma) => aTexto(D(d).normalizar(), idioma);
const n2 = (d, idioma) => aTexto(D(d).conCifras(2), idioma);
const bi = f => ({ es: (...a) => f('es', ...a), en: (...a) => f('en', ...a) });
const c = t => `<span class="cuenta">${t}</span>`;
const cl = t => `<span class="cuenta-frac">${t}</span>`;
const euros = (cents, idioma) => aTexto(decimal(cents, 2), idioma);
const eur = (cents, idioma) => (idioma === 'en' ? `€${euros(cents, 'en')}` : `${euros(cents, 'es')} €`);
const lugares = (k, es) => (es ? (k === 1 ? '1 lugar' : `${k} lugares`) : (k === 1 ? '1 place' : `${k} places`));
const otra = bi((i, item, v) => `${vtxt(v, i)} ${i === 'es' ? 'no es la respuesta. ' : 'is not the answer. '}`);

/** Lo que eligió o escribió el alumno: un decimal, o una división { a, b }. */
function vtxt(v, idioma) {
  return v && v.a !== undefined ? `${n(v.a, idioma)} : ${n(v.b, idioma)}` : n(v, idioma);
}

const unoPor = (p, idioma) => aTexto(decimal(1, p), idioma);   // 0,1 / 0,01 / 0,001

// ─── Enunciados con cuenta (practica.js y el test) ─────────────────────────────────────────────

/** Ej. 1: «12 · 3 = 36» y «1,2 · 0,3», o «3,2 · 0,01». */
export function enunciadoComa(item, idioma) {
  if (item.forma === 'producto') {
    return { dato: c(`${item.a.m} · ${item.b.m} = ${item.enteros}`), cuenta: `${n(item.a, idioma)} · ${n(item.b, idioma)}` };
  }
  return { dato: null, cuenta: `${n(item.d, idioma)} ${item.op === 'por' ? '·' : ':'} ${unoPor(item.p, idioma)}` };
}

export const cuentaEntre = (item, idioma) => `${n(item.dividendo, idioma)} : ${item.divisor}`;
export const cuentaDecimal = (item, idioma) => `${n(item.dividendo, idioma)} : ${n(item.divisor, idioma)}`;

/** Ej. 3: la división sin coma en el divisor que da el mismo cociente. */
export function divisionEquivalente(item, idioma) {
  const s = D(item.divisor).k;
  return `${n(porPotenciaDe10(D(item.dividendo), s), idioma)} : ${n(porPotenciaDe10(D(item.divisor), s), idioma)}`;
}

/** Ej. 4: lo que dice la división hecha. */
export function divisionHecha(item, idioma) {
  const m = item.mostrado;
  return `${n(item.a, idioma)} : ${n(item.b, idioma)} = ${n2(m.cociente, idioma)}, ${idioma === 'es' ? 'resto' : 'remainder'} ${n(m.resto, idioma)}`;
}

/** Ej. 4: la prueba b · cociente + resto = a, con los números dados. */
function prueba(item, cociente, resto, idioma) {
  const total = sumar(multiplicar(D(item.b), D(cociente)), D(resto));
  return { texto: `${n(item.b, idioma)} · ${n2(cociente, idioma)} + ${n(resto, idioma)} = ${n(total, idioma)}`, total };
}

export function enunciadoProblema(item, idioma) {
  const es = idioma === 'es';
  const kg = n(item.peso ?? { m: 0, k: 0 }, idioma);
  switch (item.tipo) {
    case 'importe':
      return es ? `Compras ${kg} kg de ${item.nombre.es} a ${eur(item.precio, idioma)} el kilo. ¿Cuánto pagas?`
        : `You buy ${kg} kilograms of ${item.nombre.en} at ${eur(item.precio, idioma)} per kilogram (por kilo). How much do you pay?`;
    case 'precio':
      return es ? `${kg} kg de ${item.nombre.es} cuestan ${eur(item.importe, idioma)}. ¿Cuánto cuesta el kilo?`
        : `${kg} kilograms of ${item.nombre.en} cost ${eur(item.importe, idioma)}. What is the price of one kilogram (un kilo)?`;
    case 'litros':
      return es ? `La gasolina cuesta ${eur(item.precio, idioma)} el litro. Echas ${eur(item.importe, idioma)} de gasolina. ¿Cuántos litros echas?${item.redondeo ? ' Redondea a la décima.' : ''}`
        : `Petrol (gasolina) costs ${eur(item.precio, idioma)} per litre (por litro). You put in ${eur(item.importe, idioma)} of petrol. How many litres do you get?${item.redondeo ? ' Round to one decimal place (la décima).' : ''}`;
    default:
      return es ? `Un coche gasta ${item.litros} L de gasolina en un viaje, a ${eur(item.precio, idioma)} el litro. El gasto se reparte a partes iguales entre ${item.personas} personas. ¿Cuánto paga cada una?${item.redondeo ? ' Redondea al céntimo.' : ''}`
        : `A car uses ${item.litros} litres of petrol on a trip. Petrol costs ${eur(item.precio, idioma)} per litre. The cost is shared equally (a partes iguales) between ${item.personas} people. How much does each person pay?${item.redondeo ? ' Round to the nearest cent (el céntimo).' : ''}`;
  }
}

/** Ej. 5: la cuenta con la que se resuelve. */
export function cuentaProblema(item, idioma) {
  const sufijo = idioma === 'en' ? ' euros' : ' €';
  const peso = item.peso ? n(item.peso, idioma) : '';
  switch (item.tipo) {
    case 'importe': return c(`${peso} · ${euros(item.precio, idioma)} = ${euros(item.importe, idioma)}${sufijo}`);
    case 'precio': return c(`${euros(item.importe, idioma)} : ${peso} = ${euros(item.precio, idioma)}${sufijo}`);
    case 'litros': return c(`${euros(item.importe, idioma)} : ${euros(item.precio, idioma)} ${item.redondeo ? '≈' : '='} ${n(item.litros, idioma)} L`);
    default: {
      const total = `${item.litros} · ${euros(item.precio, idioma)} = ${euros(item.total, idioma)}${sufijo}`;
      const reparto = `${euros(item.total, idioma)} : ${item.personas} ${item.redondeo ? '≈' : '='} ${n(item.porPersona, idioma)}${sufijo}`;
      return `${c(total)} ${c(reparto)}`;
    }
  }
}

/** Ej. 6: los pasos, una operación por paso. */
export const pasosDe = (item, idioma) => cl(pasosCombinada(item.expresion).map(e => textoExpresion(e, idioma)).join(' = '));

// ─── Los textos ────────────────────────────────────────────────────────────────────────────────

const COMA_FALTA = (k, es) => (es ? `${k} ${k === 1 ? 'cifra decimal' : 'cifras decimales'}` : `${k} decimal ${k === 1 ? 'place' : 'places'}`);

export const TX = {
  campos: {
    resultado: { es: 'Resultado', en: 'Result' },
    cociente: { es: 'Cociente', en: 'Quotient' },
    importe: { es: 'Importe en euros', en: 'Amount in euros' },
    precio: { es: 'Precio en euros', en: 'Price in euros' },
    litros: { es: 'Litros', en: 'Litres' },
  },

  // ─── Ejercicio 1 ───────────────────────────────────────────────────────────────────────────
  ej1: {
    nombre: { es: 'Coloca la coma', en: 'Place the point' },
    detalle: { es: 'Producto y ×/: 0,1; 0,01; 0,001', en: 'Products, and times / divided by 0.1, 0.01, 0.001' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p><strong>Producto:</strong> multiplica los números como si no tuvieran coma y después pon en el resultado <strong>tantas cifras decimales como tienen los dos factores juntos</strong>.</p>
        <p>Ejemplo: ${c('12 · 3 = 36')}, y 1,2 tiene 1 cifra decimal y 0,3 tiene 1: en total 2. Entonces ${c('1,2 · 0,3 = 0,36')}.</p>
        <p><strong>Por 0,1; 0,01; 0,001:</strong> es como dividir entre 10, 100, 1000; la coma va a la <strong>izquierda</strong>. <strong>Entre 0,1; 0,01; 0,001:</strong> es como multiplicar por 10, 100, 1000; la coma va a la <strong>derecha</strong>.</p>
        <p>Ejemplo: ${c('3,2 · 0,01 = 0,032')} y ${c('0,56 : 0,1 = 5,6')}.</p>`,
      en: `<h2>How it works</h2>
        <p><strong>Products:</strong> multiply the numbers as if they had no point, then put in the answer <strong>as many decimal places as both factors have together</strong>.</p>
        <p>Example: ${c('12 · 3 = 36')}, and 1.2 has 1 decimal place and 0.3 has 1: that makes 2. So ${c('1.2 · 0.3 = 0.36')}.</p>
        <p><strong>Times 0.1, 0.01, 0.001:</strong> it is the same as dividing by 10, 100, 1000; the point moves <strong>left</strong>. <strong>Divided by 0.1, 0.01, 0.001:</strong> it is the same as multiplying by 10, 100, 1000; the point moves <strong>right</strong>.</p>
        <p>Example: ${c('3.2 · 0.01 = 0.032')} and ${c('0.56 : 0.1 = 5.6')}.</p>`,
    },
    instruccion: {
      escribir: { es: 'Calcula. Pon bien la coma.', en: 'Work it out. Put the decimal point in the right place.' },
      elegir: { es: '¿Cuál es el resultado? Mira dónde va la coma.', en: 'Which is the answer? Look at where the point goes.' },
    },
    correcto: bi((i, item) => `${solucionComa(item, i)}`),
    solucion: bi((i, item) => `${solucionComa(item, i)}`),
    por_que: {
      'coma-mal-puesta': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} sale de contar las cifras decimales de un solo factor. ${n(item.a, i)} tiene ${D(item.a).k} y ${n(item.b, i)} tiene ${D(item.b).k}: hay que contar las de los dos juntos. `
        : `${n(v, i)} comes from counting the decimal places of one factor only. ${n(item.a, i)} has ${D(item.a).k} and ${n(item.b, i)} has ${D(item.b).k}: count both together. `)),
      'coma-olvidada': bi((i, item, v) => (i === 'es'
        ? `Falta la coma: ${n(v, i)} tiene las cifras bien, pero el resultado lleva ${COMA_FALTA(D(item.resultado).normalizar().k, true)}. `
        : `The decimal point is missing: ${n(v, i)} has the right digits, but the answer has ${COMA_FALTA(D(item.resultado).normalizar().k, false)}. `)),
      'coma-de-menos': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} tiene una cifra decimal de menos: el resultado lleva ${COMA_FALTA(D(item.resultado).normalizar().k, true)}. `
        : `${n(v, i)} has one decimal place too few: the answer has ${COMA_FALTA(D(item.resultado).normalizar().k, false)}. `)),
      'coma-de-mas': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} tiene una cifra decimal de más. ${item.forma === 'potencia' ? `${unoPor(item.p, i)} mueve la coma ${lugares(item.p, true)}.` : `El resultado lleva ${COMA_FALTA(D(item.resultado).normalizar().k, true)}.`} `
        : `${n(v, i)} has one decimal place too many. ${item.forma === 'potencia' ? `${unoPor(item.p, i)} moves the point ${lugares(item.p, false)}.` : `The answer has ${COMA_FALTA(D(item.resultado).normalizar().k, false)}.`} `)),
      'coma-al-reves': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} sale de mover la coma hacia el lado contrario. ${item.op === 'por' ? 'Multiplicar por 0,1 hace el número menor' : 'Dividir entre 0,1 hace el número mayor'}. `.replace('0,1', unoPor(item.p, i))
        : `${n(v, i)} comes from moving the point the wrong way. ${item.op === 'por' ? 'Multiplying by 0.1 makes the number smaller' : 'Dividing by 0.1 makes the number bigger'}. `.replace('0.1', unoPor(item.p, i)))),
      'coma-un-solo-lugar': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} sale de mover la coma un solo lugar. ${unoPor(item.p, i)} tiene ${item.p} cifras decimales: son ${lugares(item.p, true)}. `
        : `${n(v, i)} comes from moving the point only one place. ${unoPor(item.p, i)} has ${item.p} decimal places: that is ${lugares(item.p, false)}. `)),
      'otra-respuesta': otra,
    },
  },

  // ─── Ejercicio 2 ───────────────────────────────────────────────────────────────────────────
  ej2: {
    nombre: { es: 'Divide entre un natural', en: 'Divide by a whole number' },
    detalle: { es: 'Cociente exacto con decimales', en: 'Exact quotients with decimals' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Si el dividendo tiene coma, <strong>la coma del cociente</strong> se pone al bajar la primera cifra decimal. Si el resto no es 0, <strong>pon una coma en el cociente, añade un cero al resto y sigue dividiendo</strong>.</p>
        <p>Ejemplo: ${c('9,6 : 8 = 1,2')}. Y ${c('7 : 4 = 1,75')}: 7 : 4 = 1 y sobran 3; 30 : 4 = 7 y sobran 2; 20 : 4 = 5.</p>`,
      en: `<h2>How it works</h2>
        <p>If the dividend has a decimal point, <strong>the point of the quotient</strong> goes in when you bring down the first decimal digit. If the remainder is not 0, <strong>put a point in the quotient, add a zero to the remainder and keep dividing</strong>.</p>
        <p>Example: ${c('9.6 : 8 = 1.2')}. And ${c('7 : 4 = 1.75')}: 7 : 4 = 1 and 3 left over; 30 : 4 = 7 and 2 left over; 20 : 4 = 5.</p>`,
    },
    instruccion: {
      escribir: { es: 'Calcula el cociente exacto.', en: 'Work out the exact quotient.' },
      elegir: { es: '¿Cuál es el cociente exacto?', en: 'Which is the exact quotient?' },
    },
    correcto: bi((i, item) => `${solucionEntre(item, i)}`),
    solucion: bi((i, item) => `${solucionEntre(item, i)}`),
    por_que: {
      'olvida-coma-cociente': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} tiene las cifras bien, pero se ha olvidado de la coma del cociente. `
        : `${n(v, i)} has the right digits, but the point of the quotient is missing. `)),
      'cociente-entero': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} es solo la parte entera. No hay que parar en el resto: se sigue dividiendo detrás de la coma. `
        : `${n(v, i)} is only the whole part. Do not stop at the remainder: keep dividing after the point. `)),
      'coma-corrida': bi((i, item, v) => (i === 'es'
        ? `En ${n(v, i)} las cifras están bien, pero la coma no está en su sitio. `
        : `In ${n(v, i)} the digits are right, but the decimal point is in the wrong place. `)),
      'otra-respuesta': otra,
    },
  },

  // ─── Ejercicio 3 ───────────────────────────────────────────────────────────────────────────
  ej3: {
    nombre: { es: 'Divide entre un decimal', en: 'Divide by a decimal' },
    detalle: { es: 'Mueve la coma en los dos', en: 'Move the point in both' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Para dividir entre un decimal, <strong>mueve la coma en el dividendo y en el divisor el mismo número de lugares</strong>, hasta que el divisor no tenga coma. El cociente no cambia.</p>
        <p>Ejemplo: ${c('7,5 : 0,25')}. El divisor tiene 2 cifras decimales: mueve la coma 2 lugares en los dos y queda ${c('750 : 25 = 30')}.</p>
        <p><strong>Ojo:</strong> si la mueves solo en uno, o un número distinto de lugares en cada uno, el cociente cambia.</p>`,
      en: `<h2>How it works</h2>
        <p>To divide by a decimal, <strong>move the point the same number of places in the dividend and in the divisor</strong>, until the divisor has no point. The quotient does not change.</p>
        <p>Example: ${c('7.5 : 0.25')}. The divisor has 2 decimal places: move the point 2 places in both and you get ${c('750 : 25 = 30')}.</p>
        <p><strong>Careful:</strong> if you move it in one only, or a different number of places in each, the quotient changes.</p>`,
    },
    instruccion: {
      equivalente: { es: '¿Qué división sin coma en el divisor tiene el mismo cociente?', en: 'Which division with no point in the divisor has the same quotient?' },
      escribir: { es: 'Calcula el cociente.', en: 'Work out the quotient.' },
    },
    correcto: bi((i, item) => `${solucionDecimal(item, i)}`),
    solucion: bi((i, item) => `${solucionDecimal(item, i)}`),
    por_que: {
      'coma-solo-en-divisor': bi((i, item, v) => (i === 'es'
        ? `${vtxt(v, i)} sale de mover la coma solo en el divisor. Hay que moverla ${lugares(D(item.divisor).k, true)} también en el dividendo. `
        : `${vtxt(v, i)} comes from moving the point in the divisor only. Move it ${lugares(D(item.divisor).k, false)} in the dividend too. `)),
      'coma-solo-en-dividendo': bi((i, item, v) => (i === 'es'
        ? `${vtxt(v, i)} sale de mover la coma solo en el dividendo. Hay que moverla ${lugares(D(item.divisor).k, true)} también en el divisor. `
        : `${vtxt(v, i)} comes from moving the point in the dividend only. Move it ${lugares(D(item.divisor).k, false)} in the divisor too. `)),
      'coma-distinto-numero-de-lugares': bi((i, item, v) => (i === 'es'
        ? `${vtxt(v, i)} sale de mover la coma un número distinto de lugares en cada número. En los dos son ${lugares(D(item.divisor).k, true)}. `
        : `${vtxt(v, i)} comes from moving the point a different number of places in each number. It is ${lugares(D(item.divisor).k, false)} in both. `)),
      'otra-respuesta': otra,
    },
  },

  // ─── Ejercicio 4 ───────────────────────────────────────────────────────────────────────────
  ej4: {
    nombre: { es: '¿Está bien?', en: 'Is it right?' },
    detalle: { es: 'Comprueba una división', en: 'Check a division' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>Una división está bien hecha si <strong>divisor · cociente + resto = dividendo</strong>. El cociente se saca con dos decimales, <strong>cortando</strong> (sin redondear). Y el resto es el de la <strong>división original</strong>, no el de la división sin coma.</p>
        <p>Ejemplo: ${c('6,384 : 0,49')} se hace como 638,4 : 49 = 13,02 y sobran 0,42. En la original el resto es 0,42 : 100 = 0,0042. Prueba: ${c('0,49 · 13,02 + 0,0042 = 6,384')}.</p>
        <p>Si la prueba da el dividendo, está bien. Si no, está mal.</p>`,
      en: `<h2>How it works</h2>
        <p>A division is right if <strong>divisor · quotient + remainder = dividend</strong>. The quotient is worked out with two decimal places, <strong>cutting it off</strong> (not rounding). And the remainder is the one of the <strong>original division</strong>, not the one of the division with no point.</p>
        <p>Example: ${c('6.384 : 0.49')} is done as 638.4 : 49 = 13.02 with 0.42 left over. In the original the remainder is 0.42 : 100 = 0.0042. Proof: ${c('0.49 · 13.02 + 0.0042 = 6.384')}.</p>
        <p>If the proof gives the dividend, it is right. If not, it is wrong.</p>`,
    },
    instruccion: { es: 'Esta división tiene el cociente con dos decimales. ¿Está bien hecha?', en: 'This division has a quotient with two decimal places. Is it right?' },
    estaBien: { es: 'Está bien', en: 'It is right' },
    estaMal: { es: 'Está mal', en: 'It is wrong' },
    correcto: bi((i, item) => `${solucionEstaBien(item, i)}`),
    solucion: bi((i, item) => `${solucionEstaBien(item, i)}`),
    por_que: {
      'da-por-mala-una-buena': bi((i, item) => (i === 'es' ? 'Está bien hecha. ' : 'It is right. ')),
      'resto-sin-deshacer': bi((i, item) => (i === 'es'
        ? `Está mal: ${n(item.mostrado.resto, i)} es el resto de la división sin coma. En la original hay que dividirlo entre ${10 ** D(item.b).k}, y da ${n(item.resto, i)}. `
        : `It is wrong: ${n(item.mostrado.resto, i)} is the remainder of the division with no point. In the original you have to divide it by ${10 ** D(item.b).k}, which gives ${n(item.resto, i)}. `)),
      'cociente-coma-corrida': bi((i, item) => (i === 'es'
        ? `Está mal: el cociente ${n2(item.mostrado.cociente, i)} tiene la coma mal puesta. `
        : `It is wrong: the quotient ${n2(item.mostrado.cociente, i)} has the decimal point in the wrong place. `)),
      'cociente-redondeado': bi((i, item) => (i === 'es'
        ? `Está mal: ${n2(item.mostrado.cociente, i)} está redondeado. Hay que cortar a dos decimales. `
        : `It is wrong: ${n2(item.mostrado.cociente, i)} is rounded. You have to cut it off at two decimal places. `)),
    },
  },

  // ─── Ejercicio 5 ───────────────────────────────────────────────────────────────────────────
  ej5: {
    nombre: { es: 'Problemas', en: 'Problems' },
    detalle: { es: 'Fruta al peso y gasolina', en: 'Fruit by weight and petrol' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p><strong>Importe = cantidad · precio.</strong> Para el precio de una unidad (un kilo, un litro) o para la cantidad, se divide: <strong>precio = importe : cantidad</strong>; <strong>cantidad = importe : precio</strong>. Si el gasto se reparte, se divide entre las personas.</p>
        <p>Ejemplo: 1,5 kg a 2,40 € el kilo: ${c('1,5 · 2,40 = 3,60 €')}. Si 2,5 kg cuestan 6,25 €, el kilo cuesta ${c('6,25 : 2,5 = 2,50 €')}.</p>
        <p>Escribe el resultado solo con el número. Si el enunciado dice que redondees, hazlo.</p>`,
      en: `<h2>How it works</h2>
        <p><strong>Amount = quantity · price.</strong> For the price of one unit (one kilogram, one litre) or for the quantity, you divide: <strong>price = amount : quantity</strong>; <strong>quantity = amount : price</strong>. If the cost is shared, divide by the number of people.</p>
        <p>Example: 1.5 kg at €2.40 per kilogram: ${c('1.5 · 2.40 = 3.60 euros')}. If 2.5 kg cost €6.25, one kilogram costs ${c('6.25 : 2.5 = 2.50 euros')}.</p>
        <p>Write the answer as a number only. If the question says to round, do it.</p>`,
    },
    instruccion: { es: 'Resuelve el problema.', en: 'Solve the problem.' },
    correcto: bi((i, item) => `${cuentaProblema(item, i)}`),
    solucion: bi((i, item) => `${cuentaProblema(item, i)}`),
    por_que: {
      'suma-en-vez-de-multiplica': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} sale de sumar el peso y el precio. Cada kilo cuesta ${euros(item.precio, i)} €: se multiplica. `
        : `${n(v, i)} comes from adding the weight and the price. Each kilogram costs €${euros(item.precio, i)}: you multiply. `)),
      'multiplica-en-vez-de-divide': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} sale de multiplicar. Aquí se busca una cantidad que cabe en el importe: se divide. `
        : `${n(v, i)} comes from multiplying. Here you look for the quantity that fits in the amount: you divide. `)),
      'coma-olvidada': bi((i, item, v) => (i === 'es'
        ? `Falta la coma: ${n(v, i)} tiene las cifras bien, pero en euros y céntimos son dos decimales. `
        : `The decimal point is missing: ${n(v, i)} has the right digits, but euros and cents have two decimal places. `)),
      'coma-solo-en-divisor': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} sale de mover la coma solo en el divisor. Hay que moverla en los dos. `
        : `${n(v, i)} comes from moving the point in the divisor only. Move it in both. `)),
      'redondea-truncando': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} sale de cortar el cociente. Hay que redondear: mira la cifra siguiente. `
        : `${n(v, i)} comes from cutting the quotient off. You have to round: look at the next digit. `)),
      'da-el-total': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} € es lo que cuesta el viaje entero; cada persona paga su parte: ${euros(item.total, i)} : ${item.personas}. `
        : `€${n(v, i)} is the cost of the whole trip; each person pays a share: ${euros(item.total, i)} : ${item.personas}. `)),
      'coma-corrida': bi((i, item, v) => (i === 'es'
        ? `En ${n(v, i)} las cifras están bien, pero la coma no está en su sitio. `
        : `In ${n(v, i)} the digits are right, but the decimal point is in the wrong place. `)),
      'otra-respuesta': otra,
    },
  },

  // ─── Ejercicio 6 ───────────────────────────────────────────────────────────────────────────
  ej6: {
    nombre: { es: 'Combinadas', en: 'Order of operations' },
    detalle: { es: 'Con decimales y paréntesis', en: 'With decimals and brackets' },
    introduccion: {
      es: `<h2>Cómo se hace</h2>
        <p>La jerarquía es la de siempre: primero lo que hay <strong>dentro del paréntesis</strong>, luego <strong>· y :</strong>, y al final <strong>+ y −</strong>. Un paso por línea.</p>
        <p>Ejemplo: ${c('2,5 + 1,2 · 3 = 2,5 + 3,6 = 6,1')}. Y con paréntesis: ${c('(2,5 + 1,5) · 0,3 = 4 · 0,3 = 1,2')}.</p>`,
      en: `<h2>How it works</h2>
        <p>The order is the usual one: first what is <strong>inside the brackets</strong>, then <strong>· and :</strong>, and last <strong>+ and −</strong>. One step per line.</p>
        <p>Example: ${c('2.5 + 1.2 · 3 = 2.5 + 3.6 = 6.1')}. And with brackets: ${c('(2.5 + 1.5) · 0.3 = 4 · 0.3 = 1.2')}.</p>`,
    },
    instruccion: {
      escribir: { es: 'Calcula. Respeta la jerarquía.', en: 'Work it out. Follow the order of operations.' },
      elegir: { es: '¿Cuál es el resultado? Respeta la jerarquía.', en: 'Which is the answer? Follow the order of operations.' },
    },
    correcto: bi((i, item) => `${pasosDe(item, i)}.`),
    solucion: bi((i, item) => `${pasosDe(item, i)}.`),
    por_que: {
      'izquierda-a-derecha': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} sale de operar de izquierda a derecha. Primero se hacen · y :, luego + y −. `
        : `${n(v, i)} comes from working from left to right. Do · and : first, then + and −. `)),
      'quita-el-parentesis': bi((i, item, v) => (i === 'es'
        ? `${n(v, i)} sale de calcular como si no hubiera paréntesis. Lo de dentro del paréntesis se hace primero. `
        : `${n(v, i)} comes from working it out as if there were no brackets. What is inside the brackets comes first. `)),
      'coma-corrida': bi((i, item, v) => (i === 'es'
        ? `En ${n(v, i)} las cifras están bien, pero la coma no está en su sitio. `
        : `In ${n(v, i)} the digits are right, but the decimal point is in the wrong place. `)),
      'otra-respuesta': otra,
    },
  },
};

// ─── Soluciones (después de TX: usan funciones de arriba) ──────────────────────────────────────

function solucionComa(item, idioma) {
  const es = idioma === 'es';
  const cuenta = `${enunciadoComa(item, idioma).cuenta} = ${n(item.resultado, idioma)}`;
  if (item.forma === 'potencia') {
    const por = item.op === 'por';
    const lado = es ? (por ? 'izquierda' : 'derecha') : (por ? 'left' : 'right');
    return es ? `${c(cuenta)}: ${por ? 'por' : 'entre'} ${unoPor(item.p, idioma)} la coma se mueve ${lugares(item.p, true)} a la ${lado}.`
      : `${c(cuenta)}: ${por ? 'times' : 'divided by'} ${unoPor(item.p, idioma)} the point moves ${lugares(item.p, false)} to the ${lado}.`;
  }
  const ka = D(item.a).k, kb = D(item.b).k;
  return es ? `${c(cuenta)}: ${n(item.a, idioma)} tiene ${ka} y ${n(item.b, idioma)} tiene ${kb}; ${ka + kb} cifras decimales en total.`
    : `${c(cuenta)}: ${n(item.a, idioma)} has ${ka} and ${n(item.b, idioma)} has ${kb}; ${ka + kb} decimal places in total.`;
}

function solucionEntre(item, idioma) {
  const es = idioma === 'es';
  const cuenta = c(`${cuentaEntre(item, idioma)} = ${n(item.cociente, idioma)}`);
  if (item.forma === 'natural') {
    const pasos = pasosNatural(item.dividendo.m, item.divisor)
      .map(p => `${p.parcial} : ${p.divisor} = ${p.cifra}${p.resto ? (es ? ` (sobran ${p.resto})` : ` (${p.resto} left over)`) : ''}`).join('; ');
    return `${cuenta}. ${pasos}.`;
  }
  return es ? `${cuenta}: la coma del cociente va debajo de la del dividendo.` : `${cuenta}: the point of the quotient goes under the one of the dividend.`;
}

function solucionDecimal(item, idioma) {
  const es = idioma === 'es';
  const s = D(item.divisor).k;
  return `${c(`${cuentaDecimal(item, idioma)} = ${divisionEquivalente(item, idioma)} = ${n(item.cociente, idioma)}`)} ${es ? `(la coma, ${lugares(s, true)} en los dos)` : `(the point, ${lugares(s, false)} in both)`}.`;
}

function solucionEstaBien(item, idioma) {
  const es = idioma === 'es';
  const buena = prueba(item, item.cociente, item.resto, idioma).texto;
  if (item.estaBien) return es ? `Bien: ${c(buena)}.` : `Right: ${c(buena)}.`;
  const mala = prueba(item, item.mostrado.cociente, item.mostrado.resto, idioma);
  return es ? `La prueba no cuadra: ${c(mala.texto)}, y ese no es ${n(item.a, idioma)}. Bien hecha: cociente ${n2(item.cociente, idioma)}, resto ${n(item.resto, idioma)}, ${c(buena)}.`
    : `The proof does not work: ${c(mala.texto)}, and that is not ${n(item.a, idioma)}. Done right: quotient ${n2(item.cociente, idioma)}, remainder ${n(item.resto, idioma)}, ${c(buena)}.`;
}


// ─── «No lo sé»: la explicación de cada ejercicio (la regla y la cuenta del ítem) ──────────────
// Reutilizan las `solucion…` de arriba (la cuenta con los números del ítem) y les ponen delante la
// regla en una frase y detrás la respuesta, tal como la da por buena el ejercicio.

const respuesta = (idioma, txt) => ` ${idioma === 'es' ? 'La respuesta es' : 'The answer is'} <strong>${txt}</strong>.`;
const dos = (es, en, idioma) => (idioma === 'es' ? es : en);

/** Ejercicio 1: colocar la coma. */
export function explicaComa(item, { idioma }) {
  const regla = item.forma === 'potencia'
    ? dos(`Multiplicar por 0,1; 0,01 o 0,001 es dividir entre 10, 100 o 1000 (la coma va a la izquierda); dividir entre ellos es multiplicar (la coma va a la derecha).`,
      `Times 0.1, 0.01 or 0.001 is dividing by 10, 100 or 1000 (the point moves left); dividing by them is multiplying (the point moves right).`, idioma)
    : dos('Se multiplica sin coma y en el resultado se ponen tantas cifras decimales como tienen los dos factores juntos.',
      'Multiply with no point, then put in the answer as many decimal places as both factors have together.', idioma);
  const cifras = (k) => (idioma === 'es' ? `${k} ${k === 1 ? 'cifra decimal' : 'cifras decimales'}` : `${k} decimal ${k === 1 ? 'place' : 'places'}`);
  const cuenta = item.forma === 'producto'
    ? (() => {
      const ka = D(item.a).k, kb = D(item.b).k, cta = `${enunciadoComa(item, idioma).cuenta} = ${n(item.resultado, idioma)}`;
      return dos(`${c(cta)}: ${n(item.a, idioma)} tiene ${cifras(ka)} y ${n(item.b, idioma)} tiene ${cifras(kb)}; en total, ${cifras(ka + kb)}.`,
        `${c(cta)}: ${n(item.a, idioma)} has ${cifras(ka)} and ${n(item.b, idioma)} has ${cifras(kb)}; in total, ${cifras(ka + kb)}.`, idioma);
    })()
    : solucionComa(item, idioma);
  return `${regla} ${cuenta}${respuesta(idioma, n(item.resultado, idioma))}`;
}

/** Ejercicio 2: dividir entre un natural. */
export function explicaEntre(item, { idioma }) {
  const regla = dos('Se divide como siempre; la coma del cociente se pone al bajar la primera cifra decimal, y si sobra resto se añade un cero y se sigue.',
    'Divide as usual; the point of the quotient goes in when you bring down the first decimal digit, and if there is a remainder you add a zero and keep going.', idioma);
  return `${regla} ${solucionEntre(item, idioma)}${respuesta(idioma, n(item.cociente, idioma))}`;
}

/** Ejercicio 3: dividir entre un decimal (escribir el cociente o elegir la división equivalente). */
export function explicaDecimal(item, { idioma }) {
  const regla = dos('Se mueve la coma el mismo número de lugares en el dividendo y en el divisor, hasta que el divisor no tenga coma; el cociente no cambia.',
    'Move the point the same number of places in the dividend and in the divisor, until the divisor has no point; the quotient does not change.', idioma);
  const fin = item.tipo === 'equivalente' ? divisionEquivalente(item, idioma) : n(item.cociente, idioma);
  return `${regla} ${solucionDecimal(item, idioma)}${respuesta(idioma, fin)}`;
}

/** Ejercicio 4: ¿está bien hecha la división? */
export function explicaEstaBien(item, { idioma }) {
  const regla = dos('Una división está bien si divisor · cociente + resto = dividendo.', 'A division is right if divisor · quotient + remainder = dividend.', idioma);
  const fin = item.estaBien ? dos('que está bien hecha', 'that it is right', idioma) : dos('que está mal hecha', 'that it is wrong', idioma);
  return `${regla} ${solucionEstaBien(item, idioma)}${respuesta(idioma, fin)}`;
}

/** Ejercicio 5: problemas. */
export function explicaProblema(item, { idioma }) {
  const regla = {
    importe: dos('Importe = cantidad · precio.', 'Amount = quantity · price.', idioma),
    precio: dos('Precio de un kilo = importe : cantidad.', 'Price of one kilogram = amount : quantity.', idioma),
    litros: dos('Litros = importe : precio del litro.', 'Litres = amount : price per litre.', idioma),
    viaje: dos('Primero el gasto total (litros · precio) y después se reparte entre las personas.', 'First the total cost (litres · price), then share it between the people.', idioma),
  }[item.tipo];
  const resp = item.tipo === 'importe' ? eur(item.importe, idioma)
    : item.tipo === 'precio' ? eur(item.precio, idioma)
      : item.tipo === 'litros' ? `${n(item.litros, idioma)} L`
        : (idioma === 'en' ? `€${n(item.porPersona, idioma)}` : `${n(item.porPersona, idioma)} €`);
  const redondeo = item.redondeo ? ` ${dos('Se redondea como pide el enunciado.', 'Round as the question says.', idioma)}` : '';
  const cuentas = cuentaProblema(item, idioma).replace('</span> <span', '</span>; <span');
  return `${regla}${redondeo} ${cuentas}.${respuesta(idioma, resp)}`;
}

/** Ejercicio 6: combinadas. */
export function explicaCombinada(item, { idioma }) {
  const regla = dos('Primero lo de dentro del paréntesis, luego · y :, y al final + y −; un paso por línea.',
    'First what is inside the brackets, then · and :, and last + and −; one step per line.', idioma);
  return `${regla} ${pasosDe(item, idioma)}.${respuesta(idioma, n(item.resultado, idioma))}`;
}
