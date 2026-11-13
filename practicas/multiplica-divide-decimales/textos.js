// Práctica «Multiplica y divide decimales»: textos propios, siempre { es, en }. Los comunes (Comprobar,
// Siguiente, Sí, No…) llegan a `montar` en `api.t`.
//
// Reglas de contenido (reparto-practicas-u2/proyecto.md, unidad 5): la coma en español y el punto en
// inglés (todo número sale de `aTexto(d, idioma)`); producto con «·» y división con «:» también en
// inglés; sin porcentajes, letras, fracciones ni «×»; unidades en inglés británico; la palabra no
// matemática que decide la respuesta se aclara entre paréntesis; el feedback habla de LOS NÚMEROS DE ESE ÍTEM.

import { aTexto, decimal, sumar, multiplicar, porPotenciaDe10, dividir } from '../_comun/decimales.js';
import { D, pasosNatural, pasosDivision, pasosCombinada, textoExpresion, tienParentesis } from './logica.js';

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
// La regla delante, en una frase y con los números del ítem; después las cuentas, y al final la
// respuesta tal como la da por buena el ejercicio. No reutilizan las `solucion…` de arriba (el
// feedback): «1 cifras decimales» con un factor natural, «la coma debajo de la del dividendo» cuando el
// dividendo no tiene coma y «14,8 €» con un solo decimal (hallazgos de la revisión, tarea 190).

const respuesta = (idioma, txt) => ` ${idioma === 'es' ? 'La respuesta es' : 'The answer is'} <strong>${txt}</strong>.`;
const dos = (es, en, idioma) => (idioma === 'es' ? es : en);
/** «2 cifras decimales» / «1 decimal place». */
const cifrasDec = (k, idioma) => (idioma === 'es' ? `${k} ${k === 1 ? 'cifra decimal' : 'cifras decimales'}` : `${k} decimal ${k === 1 ? 'place' : 'places'}`);
/** Una opción del ejercicio entre comillas, como sale en el botón. */
const opcion = (txt, idioma) => (idioma === 'es' ? `«${txt}»` : `“${txt}”`);
const FALTAN_CEROS = { es: 'Si faltan cifras, se completan con ceros.', en: 'If there are not enough digits, fill the gaps with zeros.' };
/** Euros con sus dos decimales (14,80 €, €14.80), a partir de un decimal { m, k }. */
const eurD = (d, idioma) => { const t = aTexto(D(d).conCifras(2), idioma); return idioma === 'en' ? `€${t}` : `${t} €`; };

/** Ejercicio 1: colocar la coma. */
export function explicaComa(item, { idioma }) {
  const resultado = n(item.resultado, idioma);
  const cuenta = c(`${enunciadoComa(item, idioma).cuenta} = ${resultado}`);
  if (item.forma === 'potencia') {
    const por = item.op === 'por', u = unoPor(item.p, idioma), p10 = 10 ** item.p, lug = lugares(item.p, idioma === 'es');
    const regla = por
      ? dos(`Multiplicar por ${u} es como dividir entre ${p10}: la coma se mueve ${lug} a la izquierda.`,
        `Multiplying by ${u} is the same as dividing by ${p10}: the decimal point moves ${lug} to the left.`, idioma)
      : dos(`Dividir entre ${u} es como multiplicar por ${p10}: la coma se mueve ${lug} a la derecha.`,
        `Dividing by ${u} is the same as multiplying by ${p10}: the decimal point moves ${lug} to the right.`, idioma);
    // Faltan cifras: a la izquierda, si el número tiene menos cifras que lugares tiene que haber detrás de la coma; a la derecha, si tiene menos decimales que lugares.
    const d = D(item.d), faltan = por ? String(d.m).length < d.k + item.p : d.k < item.p;
    return `${regla} ${cuenta}.${faltan ? ` ${FALTAN_CEROS[idioma]}` : ''}${respuesta(idioma, resultado)}`;
  }
  const a = D(item.a), b = D(item.b), ka = a.k, kb = b.k, k = ka + kb;
  const regla = dos('Se multiplica sin comas y el resultado lleva tantas cifras decimales como los dos factores juntos.',
    'Multiply with no decimal points; the answer has as many decimal places as both factors together.', idioma);
  const tieneB = kb === 0 ? dos(`${n(b, idioma)} no tiene ninguna`, `${n(b, idioma)} has none`, idioma)
    : dos(`${n(b, idioma)} tiene ${kb}`, `${n(b, idioma)} has ${kb}`, idioma);
  const recuento = dos(`${n(a, idioma)} tiene ${cifrasDec(ka, idioma)} y ${tieneB}: en total, ${cifrasDec(k, idioma)}`,
    `${n(a, idioma)} has ${cifrasDec(ka, idioma)} and ${tieneB}: ${cifrasDec(k, idioma)} in total`, idioma);
  const faltan = String(item.enteros).length < k ? ` ${FALTAN_CEROS[idioma]}` : '';
  return `${regla} ${c(`${a.m} · ${b.m} = ${item.enteros}`)}; ${recuento}. ${cuenta}.${faltan}${respuesta(idioma, resultado)}`;
}

/** Un paso de la división larga: «Se baja el 7: 57 : 12 = 4, sobran 9.» */
function pasoDivision(p, divisor, idioma) {
  const es = idioma === 'es';
  const cuenta = `${c(`${p.parcial} : ${divisor} = ${p.cifra}`)}${p.resto ? (es ? `, sobran ${p.resto}` : `, ${p.resto} left over`) : ''}`;
  if (p.baja === null) return `${cuenta}.`;
  const que = p.cero ? (es ? 'se añade un 0' : 'add a 0') : (es ? `se baja el ${p.baja}` : `bring down the ${p.baja}`);
  const antes = p.coma ? (es ? `Se pone la coma en el cociente y ${que}` : `Put the decimal point in the quotient and ${que}`) : que[0].toUpperCase() + que.slice(1);
  return `${antes}: ${cuenta}.`;
}

/** Ejercicio 2: dividir entre un natural (la división larga, cifra a cifra). */
export function explicaEntre(item, { idioma }) {
  const regla = dos('Se divide como siempre; al pasar a los decimales, se pone la coma en el cociente.',
    'Divide as usual; when you reach the decimals, put the decimal point in the quotient.', idioma);
  const pasos = pasosDivision(item.dividendo, item.divisor).map(p => `<li>${pasoDivision(p, item.divisor, idioma)}</li>`).join('');
  return `${regla} <ol class="pasos-ayuda">${pasos}</ol>${c(`${cuentaEntre(item, idioma)} = ${n(item.cociente, idioma)}`)}.${respuesta(idioma, n(item.cociente, idioma))}`;
}

/** Ejercicio 3: dividir entre un decimal (escribir el cociente o elegir la división equivalente). */
export function explicaDecimal(item, { idioma }) {
  const s = D(item.divisor).k, lug = lugares(s, idioma === 'es');
  const regla = dos('Para dividir entre un decimal, la coma se mueve a la derecha los mismos lugares en los dos números, hasta que el divisor no tenga coma; el cociente no cambia.',
    'To divide by a decimal, move the decimal point to the right the same number of places in both numbers, until the divisor has no point; the quotient does not change.', idioma);
  const aqui = dos(`${n(item.divisor, idioma)} tiene ${cifrasDec(s, idioma)}: ${lug}.`,
    `${n(item.divisor, idioma)} has ${cifrasDec(s, idioma)}: ${lug}.`, idioma);
  const faltan = D(item.dividendo).normalizar().k < s ? ` ${FALTAN_CEROS[idioma]}` : '';
  const equivalente = divisionEquivalente(item, idioma);
  const cuenta = item.tipo === 'equivalente'
    ? c(`${cuentaDecimal(item, idioma)} = ${equivalente}`)
    : c(`${cuentaDecimal(item, idioma)} = ${equivalente} = ${n(item.cociente, idioma)}`);
  return `${regla} ${aqui}${faltan} ${cuenta}.${respuesta(idioma, item.tipo === 'equivalente' ? equivalente : n(item.cociente, idioma))}`;
}

/** Ejercicio 4: ¿está bien hecha la división? La prueba con lo que se ve y, si falla, por qué y la buena. */
export function explicaEstaBien(item, { idioma }) {
  const regla = dos('La prueba: divisor · cociente + resto tiene que dar el dividendo.',
    'The proof: divisor · quotient + remainder must give the dividend.', idioma);
  const buena = prueba(item, item.cociente, item.resto, idioma).texto;
  if (item.estaBien) {
    return `${regla} ${c(buena)}, ${dos('que es el dividendo', 'which is the dividend', idioma)}.${respuesta(idioma, opcion(TX.ej4.estaBien[idioma], idioma))}`;
  }
  const mala = prueba(item, item.mostrado.cociente, item.mostrado.resto, idioma).texto;
  const m = item.mostrado, k = D(item.b).k;
  const porque = {
    'resto-sin-deshacer': dos(`${n(m.resto, idioma)} es el resto de la división sin coma; el de la original es ${c(`${n(m.resto, idioma)} : ${10 ** k} = ${n(item.resto, idioma)}`)}.`,
      `${n(m.resto, idioma)} is the remainder of the division with no point; in the original it is ${c(`${n(m.resto, idioma)} : ${10 ** k} = ${n(item.resto, idioma)}`)}.`, idioma),
    'cociente-coma-corrida': dos(`El cociente tiene la coma mal puesta: es ${n2(item.cociente, idioma)}.`,
      `The quotient has the decimal point in the wrong place: it is ${n2(item.cociente, idioma)}.`, idioma),
    'cociente-redondeado': dos(`El cociente está redondeado, y hay que cortarlo: es ${n2(item.cociente, idioma)}.`,
      `The quotient is rounded, but it has to be cut off: it is ${n2(item.cociente, idioma)}.`, idioma),
  }[item.error];
  return `${regla} ${c(mala)}, ${dos(`que no es ${n(item.a, idioma)}`, `which is not ${n(item.a, idioma)}`, idioma)}. ${porque} ${dos('Bien hecha', 'Done right', idioma)}: ${c(buena)}.`
    + respuesta(idioma, opcion(TX.ej4.estaMal[idioma], idioma));
}

/** La división de un problema, con la coma ya fuera del divisor si la tiene: «10,81 : 2,3 = 108,1 : 23». */
function divisionSinComa(a, b, idioma) {
  const s = D(b).normalizar().k;
  const texto = `${aTexto(D(a), idioma)} : ${n(b, idioma)}`;
  return s === 0 ? texto : `${texto} = ${n(porPotenciaDe10(D(a), s), idioma)} : ${n(porPotenciaDe10(D(b), s), idioma)}`;
}

/** a : b redondeado: «Sale 29,05…; a la décima se mira la cifra siguiente, 5: como es 5 o más, se sube y queda 29,1 L.» */
function redondeoDe(a, b, cifras, redondeado, idioma) {
  const { cociente: corto, exacta } = dividir(a, b, cifras + 1);
  const sigue = !exacta;
  const siguiente = Math.abs(corto.m) % 10;
  const valor = `${aTexto(corto, idioma)}${sigue ? '…' : '.'}`;   // tras «…» no va punto
  const hasta = cifras === 1 ? dos('a la décima', 'to one decimal place', idioma) : dos('al céntimo', 'to the nearest cent', idioma);
  const sube = siguiente >= 5;
  return dos(`Sale ${valor} Para redondear ${hasta} se mira la cifra siguiente, ${siguiente}: ${sube ? 'como es 5 o más, se sube' : 'como es menor que 5, se deja'} y queda ${redondeado}.`,
    `You get ${valor} To round ${hasta}, look at the next digit, ${siguiente}: ${sube ? 'it is 5 or more, so round up' : 'it is less than 5, so leave it'}, and you get ${redondeado}.`, idioma);
}

/** Ejercicio 5: problemas (la regla, las cuentas con sus unidades y la respuesta en euros con dos decimales). */
export function explicaProblema(item, { idioma }) {
  const E = idioma === 'en' ? ' euros' : ' €';
  const precio = euros(item.precio, idioma);
  switch (item.tipo) {
    case 'importe':
      return `${dos('Lo que pagas = kilos · precio del kilo.', 'What you pay = kilograms · price per kilogram.', idioma)} ${c(`${n(item.peso, idioma)} · ${precio} = ${euros(item.importe, idioma)}${E}`)}.`
        + respuesta(idioma, eur(item.importe, idioma));
    case 'precio':
      return `${dos('Precio del kilo = lo que cuesta : kilos.', 'Price per kilogram = cost : kilograms.', idioma)} ${c(`${divisionSinComa(decimal(item.importe, 2), item.peso, idioma)} = ${precio}${E}`)}.`
        + respuesta(idioma, eur(item.precio, idioma));
    case 'litros': {
      const regla = dos('Litros = euros que echas : precio del litro.', 'Litres = euros you put in : price per litre.', idioma);
      const a = decimal(item.importe, 2), b = decimal(item.precio, 2), L = `${n(item.litros, idioma)} L`;
      if (!item.redondeo) return `${regla} ${c(`${divisionSinComa(a, b, idioma)} = ${L}`)}.${respuesta(idioma, L)}`;
      return `${regla} ${c(divisionSinComa(a, b, idioma))}. ${redondeoDe(a, b, 1, L, idioma)}${respuesta(idioma, L)}`;
    }
    default: {
      const regla = dos('Primero el gasto total (litros · precio del litro) y después se reparte entre las personas.',
        'First the total cost (litres · price per litre), then share it between the people.', idioma);
      const total = c(`${item.litros} · ${precio} = ${euros(item.total, idioma)}${E}`);
      const pp = eurD(item.porPersona, idioma);
      const reparto = `${euros(item.total, idioma)} : ${item.personas}`;
      if (!item.redondeo) return `${regla} ${total}; ${c(`${reparto} = ${aTexto(D(item.porPersona).conCifras(2), idioma)}${E}`)}.${respuesta(idioma, pp)}`;
      return `${regla} ${total}; ${c(reparto)}. ${redondeoDe(decimal(item.total, 2), item.personas, 2, pp, idioma)}${respuesta(idioma, pp)}`;
    }
  }
}

/** Ejercicio 6: combinadas. */
export function explicaCombinada(item, { idioma }) {
  const regla = tienParentesis(item.expresion)
    ? dos('Primero lo de dentro del paréntesis, luego · y :, y al final + y −.', 'First what is inside the brackets, then · and :, and last + and −.', idioma)
    : dos('Primero se hacen · y :, y al final + y −.', 'First do · and :, and last + and −.', idioma);
  return `${regla} ${pasosDe(item, idioma)}.${respuesta(idioma, n(item.resultado, idioma))}`;
}
