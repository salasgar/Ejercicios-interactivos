// Números decimales (unidad 5): leer fracciones decimales, redondear, sumar y
// restar, multiplicar y dividir por la unidad seguida de ceros y por 0,1, 0,01
// y 0,001, multiplicar, dividir, fracción ↔ decimal, cuadrado y cubo,
// combinadas y negativos.
//
// Cada forma es un subtipo con las destrezas del inventario de la unidad 5 que
// cubre (`items`, como en enteros.js y en los de fracciones). Lo que manda el
// acta del 3-11: los negativos nunca en las nucleares (subtipos propios), sin
// periódicos ni raíces, sin cambios de unidad, sin porcentajes y sin el 9 que
// arrastra al redondear (U5-1C-11, mejor en papel).
//
// La aritmética es exacta: un decimal es `{ m, k }` = m / 10^k, con m entero
// y sin ceros finales. Nunca se suma ni se compara con coma flotante. La clave
// de cada opción es su valor como fracción reducida, así que dos escrituras del
// mismo número (0,5, 0,50, 1/2) nunca salen como opciones distintas.

import { construirOpciones, conReintentos, erroresDe, texFraccion, claveFraccion, reducir, mcd } from './index.js';

export const errores = {
  alinear_a_la_derecha: { concepto: 'decimales',
    es: 'Para sumar o restar decimales hay que colocar las comas en columna: décimas con décimas y centésimas con centésimas, no las últimas cifras juntas.', en: 'To add or subtract decimals, line up the decimal points: tenths with tenths and hundredths with hundredths, not the last digits together.' },
  decimales_a_la_derecha: { concepto: 'decimales',
    es: 'La parte decimal no se opera como si fuera un número natural: 0,5 son 50 centésimas, no 5. Rellena con ceros: 0,50 + 0,25 = 0,75.', en: 'The decimal part is not worked out as if it were a whole number: 0.5 is 50 hundredths, not 5. Fill in with zeros: 0.50 + 0.25 = 0.75.' },
  sin_llevar: { concepto: 'decimales',
    es: 'Te has olvidado de las llevadas: cuando una columna pasa de 9 (o no llega en la resta), la siguiente columna lo nota.', en: 'You forgot to carry: when a column goes over 9 (or is too small in a subtraction), the next column changes too.' },
  pequena_de_la_grande: { concepto: 'decimales',
    es: 'En cada columna has restado la cifra pequeña de la grande. Hay que restar siempre la de abajo de la de arriba, pidiendo prestado si hace falta (7,30 - 2,85).', en: 'In each column you took the smaller digit from the larger one. Always take the bottom digit from the top one, borrowing when you need to (7.30 - 2.85).' },
  natural_como_cifra_decimal: { concepto: 'decimales',
    es: 'Un natural no va debajo de la última cifra decimal: 5 es 5,00. Escribe el natural con coma y ceros antes de colocarlo.', en: 'A whole number does not go under the last decimal digit: 5 is 5.00. Write it with a decimal point and zeros before you line it up.' },
  anadir_ceros: { concepto: 'decimales',
    es: 'Multiplicar por 10, 100 o 1000 no es añadir ceros al final de un decimal (2,50 vale lo mismo que 2,5): es mover la coma a la derecha.', en: 'Multiplying by 10, 100 or 1000 is not adding zeros at the end of a decimal (2.50 is the same as 2.5): you move the decimal point to the right.' },
  mover_coma_al_reves: { concepto: 'decimales',
    es: 'Has movido la coma hacia el otro lado. Multiplicar por 10, 100 o 1000 (o dividir entre 0,1, 0,01 o 0,001) la mueve a la derecha; dividir (o multiplicar por 0,1…), a la izquierda.', en: 'You moved the decimal point the wrong way. Multiplying by 10, 100 or 1000 (or dividing by 0.1, 0.01 or 0.001) moves it to the right; dividing (or multiplying by 0.1…) moves it to the left.' },
  contar_posiciones: { concepto: 'decimales',
    es: 'La coma se mueve tantos lugares como ceros tiene el 10, el 100 o el 1000 (o como cifras decimales tiene el 0,1, el 0,01 o el 0,001), añadiendo ceros si faltan cifras.', en: 'The decimal point moves as many places as there are zeros in 10, 100 or 1000 (or decimal places in 0.1, 0.01 or 0.001), adding zeros if you run out of digits.' },
  contar_ceros: { concepto: 'decimales',
    es: 'Cuenta los ceros: 10 es una cifra decimal (décimas), 100 son dos (centésimas) y 1000 son tres (milésimas). 9/100 = 0,09.', en: 'Count the zeros: 10 means one decimal place (tenths), 100 two (hundredths) and 1000 three (thousandths). 9/100 = 0.09.' },
  olvidar_parte_entera: { concepto: 'decimales',
    es: 'Te has dejado la parte entera: 2,35 son 235 centésimas, 235/100.', en: 'You left out the whole-number part: 2.35 is 235 hundredths, 235/100.' },
  contar_decimales_producto: { concepto: 'decimales',
    es: 'Se multiplica como con naturales y el producto lleva tantas cifras decimales como los dos factores juntos: 1,2 · 0,3 = 0,36.', en: 'Multiply as with whole numbers; the product has as many decimal places as both factors together: 1.2 · 0.3 = 0.36.' },
  olvidar_coma: { concepto: 'decimales',
    es: 'Te has olvidado de la coma: opera como con naturales y después colócala.', en: 'You forgot the decimal point: work it out as with whole numbers and then put the point in.' },
  sumar_en_vez_de_multiplicar: { concepto: 'decimales',
    es: 'Es un producto, no una suma.', en: 'It is a multiplication, not an addition.' },
  multiplica_en_vez_de_dividir: { concepto: 'decimales',
    es: 'Es una división, no un producto.', en: 'It is a division, not a multiplication.' },
  division_coma_derecha: { concepto: 'decimales',
    es: 'Has puesto la coma del cociente un lugar más a la derecha de la que toca: colócala justo al bajar la primera cifra decimal del dividendo.', en: 'You put the decimal point in the quotient one place too far to the right: it goes in as you bring down the first decimal digit of the dividend.' },
  division_coma_izquierda: { concepto: 'decimales',
    es: 'Has puesto la coma del cociente un lugar más a la izquierda de la que toca (se ha perdido un cero o sobra uno).', en: 'You put the decimal point in the quotient one place too far to the left (a zero has been lost or added).' },
  resto_como_decimales: { concepto: 'decimales',
    es: 'El resto no son las cifras decimales: hay que seguir dividiendo, añadiendo un cero detrás de la coma (7 : 4 = 1,75, no 1,3).', en: 'The remainder is not the decimal part: keep dividing by adding a zero after the decimal point (7 : 4 = 1.75, not 1.3).' },
  division_escala_solo_divisor: { concepto: 'decimales',
    es: 'Para quitar la coma del divisor hay que mover la coma el mismo número de lugares en el dividendo, no solo en el divisor.', en: 'To clear the decimal point from the divisor, you must move the point the same number of places in the dividend too, not only in the divisor.' },
  coma_de_mas_en_el_dividendo: { concepto: 'decimales',
    es: 'Has movido la coma del dividendo un lugar más que la del divisor: hay que moverlas los mismos lugares.', en: 'You moved the point in the dividend one place more than in the divisor: move both the same number of places.' },
  dividir_al_reves: { concepto: 'decimales',
    es: 'Una fracción es el numerador entre el denominador: 3/4 = 3 : 4 = 0,75, no 4 : 3.', en: 'A fraction is the numerator divided by the denominator: 3/4 = 3 : 4 = 0.75, not 4 : 3.' },
  numerador_coma_denominador: { concepto: 'decimales',
    es: 'La raya de la fracción no es una coma: 3/4 no es 3,4. Divide el numerador entre el denominador.', en: 'The fraction bar is not a decimal point: 3/4 is not 3.4. Divide the numerator by the denominator.' },
  denominador_como_decimales: { concepto: 'decimales',
    es: 'El denominador no son las cifras decimales: 1/4 no es 0,4. Divide: 1 : 4 = 0,25.', en: 'The denominator is not the decimal part: 1/4 is not 0.4. Divide: 1 : 4 = 0.25.' },
  confundir_pares: { concepto: 'decimales',
    es: 'Ese decimal es el de otra fracción. Repásalos: 1/2 = 0,5; 1/4 = 0,25; 3/4 = 0,75; 1/5 = 0,2; 1/10 = 0,1; 1/100 = 0,01.', en: 'That decimal belongs to another fraction. Go over them again: 1/2 = 0.5; 1/4 = 0.25; 3/4 = 0.75; 1/5 = 0.2; 1/10 = 0.1; 1/100 = 0.01.' },
  simplificar_a_medias: { concepto: 'decimales',
    es: 'Vale lo mismo, pero no es la fracción irreducible: sigue simplificando hasta que el m.c.d. del numerador y el denominador sea 1.', en: 'It has the same value, but it is not in its simplest form: keep simplifying until the GCD of the numerator and the denominator is 1.' },
  truncar: { concepto: 'decimales',
    es: 'Has cortado sin redondear. Mira la cifra siguiente: si es 5 o más, la última que te quedas sube uno.', en: 'You cut the number off without rounding. Look at the next digit: if it is 5 or more, the last digit you keep goes up by one.' },
  redondeo_en_cadena: { concepto: 'decimales',
    es: 'Se redondea de una vez, mirando solo la cifra siguiente a la que te quedas; no se redondea primero a otro orden.', en: 'Round in one go, looking only at the digit just after the last one you keep; do not round to another place first.' },
  redondear_a_otro_orden: { concepto: 'decimales',
    es: 'Has redondeado a otro orden. Fíjate en a qué te piden redondear: a la unidad (sin decimales), a la décima (una cifra decimal) o a la centésima (dos).', en: 'You rounded to the wrong place. Check what you are asked: to the nearest whole number (no decimals), to one decimal place or to two decimal places.' },
  potencia_sin_contar_decimales: { concepto: 'decimales',
    es: 'Una potencia es un producto: 0,3² = 0,3 · 0,3 = 0,09, con tantas cifras decimales como todos los factores juntos.', en: 'A power is a product: 0.3² = 0.3 · 0.3 = 0.09, with as many decimal places as all the factors together.' },
  multiplicar_por_exponente: { concepto: 'decimales',
    es: 'Elevar al cuadrado no es multiplicar por 2: es multiplicar el número por sí mismo (0,3² = 0,3 · 0,3).', en: 'Squaring is not multiplying by 2: it is multiplying the number by itself (0.3² = 0.3 · 0.3).' },
  izquierda_a_derecha: { concepto: 'jerarquia',
    es: 'Primero se multiplica y después se suma o se resta: no se opera de izquierda a derecha.', en: 'Multiply first and then add or subtract: you do not work from left to right.' },
  perder_signo: { concepto: 'enteros',
    es: 'Comprueba el signo del resultado, con la regla de los signos de los enteros.', en: 'Check the sign of the answer, using the sign rules for integers.' },
  regla_de_signos: { concepto: 'enteros',
    es: 'Con el mismo signo, se suman y se deja el signo; con signos distintos, se restan y se pone el signo del que está más lejos del 0.', en: 'With the same sign, add them and keep the sign; with different signs, subtract them and use the sign of the one further from 0.' },
};
const E = erroresDe(errores);

export const preguntas = {
  como_decimal: { es: 'Escribe como número decimal:', en: 'Write as a decimal:' },
  como_fraccion_decimal: { es: 'Escribe como fracción decimal (denominador 10, 100 o 1000):', en: 'Write as a decimal fraction (denominator 10, 100 or 1000):' },
  como_fraccion_irreducible: { es: 'Escribe como fracción irreducible:', en: 'Write as a fraction in its simplest form:' },
  redondea_unidad: { es: 'Redondea a la unidad:', en: 'Round to the nearest whole number:' },
  redondea_decima: { es: 'Redondea a la décima:', en: 'Round to one decimal place:' },
  redondea_centesima: { es: 'Redondea a la centésima:', en: 'Round to two decimal places:' },
};

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  alinear_comas: { es: 'Coloca las comas en columna y completa con ceros.', en: 'Line up the decimal points and fill in with zeros.' },
  natural_con_coma: { es: 'El natural se escribe con coma y ceros.', en: 'Write the whole number with a decimal point and zeros.' },
  decimales_producto: { es: 'Tantas cifras decimales como los dos factores juntos.', en: 'As many decimal places as both factors together.' },
  mover_coma_derecha: { es: 'La coma se mueve a la derecha tantos lugares como ceros.', en: 'The decimal point moves to the right as many places as there are zeros.' },
  mover_coma_izquierda: { es: 'La coma se mueve a la izquierda tantos lugares como ceros.', en: 'The decimal point moves to the left as many places as there are zeros.' },
  por_decima: { es: 'Multiplicar por 0,1, 0,01 o 0,001 es dividir entre 10, 100 o 1000.', en: 'Multiplying by 0.1, 0.01 or 0.001 is dividing by 10, 100 or 1000.' },
  entre_decima: { es: 'Dividir entre 0,1, 0,01 o 0,001 es multiplicar por 10, 100 o 1000.', en: 'Dividing by 0.1, 0.01 or 0.001 is multiplying by 10, 100 or 1000.' },
  coma_en_cociente: { es: 'La coma del cociente se coloca al bajar la primera cifra decimal del dividendo.', en: 'The decimal point in the quotient goes in as you bring down the first decimal digit of the dividend.' },
  seguir_dividiendo: { es: 'Si sobra resto, se pone la coma en el cociente y se sigue dividiendo añadiendo un cero.', en: 'If there is a remainder, put the decimal point in the quotient and keep dividing by adding a zero.' },
  quitar_coma_divisor: { es: 'Movemos la coma los mismos lugares en el dividendo y en el divisor hasta que el divisor no tenga: el cociente no cambia.', en: 'Move the decimal point the same number of places in the dividend and the divisor until the divisor has none: the quotient does not change.' },
  dividir_enteros: { es: 'Ahora dividimos como con naturales.', en: 'Now we divide as with whole numbers.' },
  fraccion_es_division: { es: 'Una fracción es el numerador dividido entre el denominador.', en: 'A fraction is the numerator divided by the denominator.' },
  de_memoria: { es: 'Es uno de los que hay que saber de memoria.', en: 'This is one of the ones to know by heart.' },
  contar_ceros: { es: 'Tantas cifras decimales como ceros tiene el denominador.', en: 'As many decimal places as there are zeros in the denominator.' },
  fraccion_decimal: { es: 'Tantos ceros en el denominador como cifras decimales.', en: 'As many zeros in the denominator as decimal places.' },
  simplificar: { es: 'Simplificamos dividiendo numerador y denominador por su m.c.d.', en: 'We simplify by dividing the numerator and the denominator by their GCD.' },
  mirar_siguiente: { es: 'Se mira la cifra siguiente: si es 5 o más, se sube uno.', en: 'Look at the next digit: if it is 5 or more, go up by one.' },
  potencia_es_producto: { es: 'La potencia es un producto del número por sí mismo.', en: 'The power is the number multiplied by itself.' },
  jerarquia: { es: 'Primero el producto; después, la suma o la resta.', en: 'First the multiplication; then the addition or subtraction.' },
  mismo_signo: { es: 'Mismo signo: se suman y se deja el signo.', en: 'Same sign: add them and keep the sign.' },
  signos_distintos: { es: 'Signos distintos: se restan y se pone el signo del que está más lejos del 0.', en: 'Different signs: subtract them and use the sign of the one further from 0.' },
  signos_producto: { es: 'Regla de los signos: signos distintos dan negativo.', en: 'Rule of signs: different signs give a negative.' },
};

// ---------------------------------------------------------------------------
// Decimales exactos: { m, k } = m / 10^k, sin ceros finales.

const P = k => 10 ** k;

/** El decimal m / 10^k, sin ceros finales (k negativo: m · 10^-k). */
function D(m, k = 0) {
  if (k < 0) return D(m * P(-k), 0);
  if (m === 0) return { m: 0, k: 0 };
  while (k > 0 && m % 10 === 0) { m /= 10; k--; }
  return { m, k };
}
/** La mantisa de a con k cifras decimales (k ≥ a.k). */
const conK = (a, k) => a.m * P(k - a.k);
const mas = (a, b) => { const k = Math.max(a.k, b.k); return D(conK(a, k) + conK(b, k), k); };
const opuesto = a => D(-a.m, a.k);
const menos = (a, b) => mas(a, opuesto(b));
const por = (a, b) => D(a.m * b.m, a.k + b.k);
/** a · 10^n (n negativo: a : 10^-n). */
const escala = (a, n) => D(a.m, a.k - n);
const igual = (a, b) => a.m === b.m && a.k === b.k;
const entera = a => Math.trunc(a.m / P(a.k));
const parteDecimal = a => Math.abs(a.m) % P(a.k); // las cifras decimales escritas, como natural
const cifrasEnteras = a => String(Math.abs(entera(a))).length;

/** Redondeo de un decimal positivo a c cifras decimales. */
function redondeo(a, c) {
  if (a.k <= c) return a;
  const f = P(a.k - c), q = Math.floor(a.m / f), r = a.m % f;
  return D(q + (2 * r >= f ? 1 : 0), c);
}
const truncado = (a, c) => (a.k <= c ? a : D(Math.floor(a.m / P(a.k - c)), c));

/** En TeX neutro, con `cifras` cifras decimales (por defecto, las suyas). */
function texD(a, cifras = a.k) {
  const s = String(Math.abs(a.m) * P(cifras - a.k)).padStart(cifras + 1, '0');
  const ent = s.slice(0, s.length - cifras), dec = s.slice(s.length - cifras);
  return (a.m < 0 ? '-' : '') + ent + (cifras ? `{,}${dec}` : '');
}
const T = a => texD(a);
const clave = a => claveFraccion(a.m, P(a.k));

/** Decimal positivo con exactamente k cifras decimales (la última, distinta de 0). */
function conCifras(rng, eMin, eMax, k) {
  let f;
  do { f = rng.entero(1, P(k) - 1); } while (f % 10 === 0);
  return D(rng.entero(eMin, eMax) * P(k) + f, k);
}

/** Opera cifra a cifra con las comas en columna y sin llevadas (a, b ≥ 0). */
function porColumnas(a, b, f) {
  const k = Math.max(a.k, b.k);
  let x = conK(a, k), y = conK(b, k), r = 0, p = 1;
  while (x > 0 || y > 0) {
    r += f(x % 10, y % 10) * p;
    x = Math.floor(x / 10); y = Math.floor(y / 10); p *= 10;
  }
  return D(r, k);
}

// ---------------------------------------------------------------------------
// Opciones y pasos.

const op = (v, error, pasos, tex) => (v ? { tex: tex ?? T(v), clave: clave(v), error, ...(pasos ? { pasos } : {}) } : null);
const fr = (n, d, error, pasos) => ({ tex: texFraccion(n, d), clave: claveFraccion(n, d), error, ...(pasos ? { pasos } : {}) });
const frac = (n, d) => `\\frac{${n}}{${d}}`;
const paso = (tex, nota = null, calculo = null) => ({ tex, nota, calculo });
const mal = (tex, calculo = null) => ({ tex, mal: true, calculo });
const conSigno = a => (a.m < 0 ? `\\left(${T(a)}\\right)` : T(a));

/** Los distractores, barajados (el motor se planta en tres). Un distractor que no aplica es null. */
const pool = (rng, lista) => rng.barajar(lista.filter(Boolean));

/** Un distractor solo vale si su valor es otro (null si coincide con la correcta o es negativo sin querer). */
const distinto = (v, correcta, { negativo = false } = {}) => (v && !igual(v, correcta) && (negativo || v.m >= 0) ? v : null);

// ---------------------------------------------------------------------------
// Semana 1 · U5-1C-04 · fracción decimal ↔ decimal, sin simplificar.

function fraccionDecimal(rng) {
  const k = rng.entero(1, 3);
  const x = conCifras(rng, rng.moneda(0.3) ? 0 : 1, 9, k);
  const n = x.m, den = P(k);
  const otros = [1, 2, 3, 4].filter(j => j !== k);
  if (rng.moneda()) {
    // 375/100 → 3,75
    return {
      texto: { clave: 'como_decimal' },
      enunciado: frac(n, den),
      correcta: op(x),
      solucion: [paso(`${frac(n, den)} = ${T(x)}`, 'contar_ceros')],
      distractores: pool(rng, otros.map(j => {
        const v = D(n, j);
        return op(v, E('contar_ceros'), [mal(`${frac(n, den)} = ${T(v)}`)]);
      })),
    };
  }
  // 3,75 → 375/100
  return {
    texto: { clave: 'como_fraccion_decimal' },
    enunciado: T(x),
    correcta: fr(n, den),
    solucion: [paso(`${T(x)} = ${frac(n, den)}`, 'fraccion_decimal')],
    distractores: pool(rng, [
      ...otros.map(j => fr(n, P(j), E('contar_ceros'), [mal(`${T(x)} = ${frac(n, P(j))}`)])),
      entera(x) > 0 && fr(parteDecimal(x), den, E('olvidar_parte_entera'), [mal(`${T(x)} = ${frac(parteDecimal(x), den)}`)]),
    ]),
  };
}

// U5-1C-10 · redondear a la unidad, a la décima o a la centésima. Las cifras
// van del 1 al 8 para que nunca arrastre un 9 (U5-1C-11) ni salga un cero final.

const ORDENES = [
  { c: 0, clave: 'redondea_unidad' },
  { c: 1, clave: 'redondea_decima' },
  { c: 2, clave: 'redondea_centesima' },
];

function redondear(rng) {
  const { c, clave: pregunta } = rng.elegir(ORDENES);
  let e;
  do { e = rng.entero(0, 48); } while (e % 10 === 9);
  const d = [rng.entero(1, 8), rng.entero(1, 8), rng.entero(1, 9)];
  // A veces, la trampa del redondeo en cadena: 3,649 a la décima (3,6), no 3,65 → 3,7.
  if (c < 2 && rng.moneda(0.35)) { d[c] = 4; d[c + 1] = rng.entero(5, 8); }
  const x = D(e * 1000 + d[0] * 100 + d[1] * 10 + d[2], 3);
  const correcta = redondeo(x, c);
  let cadena = x;
  for (let j = 2; j >= c; j--) cadena = redondeo(cadena, j);
  const pasosCadena = [];
  for (let j = 2, v = x; j >= c; j--) { const w = redondeo(v, j); pasosCadena.push((j === 2 ? mal : paso)(`${T(v)} \\approx ${T(w)}`)); v = w; }
  return {
    texto: { clave: pregunta },
    enunciado: T(x),
    correcta: op(correcta),
    solucion: [paso(`${T(x)} \\approx ${T(correcta)}`, 'mirar_siguiente')],
    distractores: pool(rng, [
      op(distinto(truncado(x, c), correcta), E('truncar'), [mal(`${T(x)} \\approx ${T(truncado(x, c))}`)]),
      c < 2 && op(distinto(cadena, correcta), E('redondeo_en_cadena'), pasosCadena),
      ...ORDENES.filter(o => o.c !== c).map(o => op(redondeo(x, o.c), E('redondear_a_otro_orden'), [mal(`${T(x)} \\approx ${T(redondeo(x, o.c))}`)])),
    ]),
  };
}

// U5-1C-13 · sumar y restar decimales con distinto número de cifras decimales.

function suma(rng) {
  const ka = rng.entero(1, 2), kb = ka === 1 ? 2 : rng.elegir([1, 3]);
  const a = conCifras(rng, 0, 30, ka), b = conCifras(rng, 0, 30, kb);
  const correcta = mas(a, b), K = Math.max(ka, kb);
  const derecha = D(a.m + b.m, K);
  const decimales = D((entera(a) + entera(b)) * P(K) + parteDecimal(a) + parteDecimal(b), K);
  const sinLlevar = porColumnas(a, b, (u, v) => (u + v) % 10);
  const enunciado = `${T(a)} + ${T(b)}`;
  return {
    enunciado,
    correcta: op(correcta),
    solucion: [paso(`${texD(a, K)} + ${texD(b, K)} = ${T(correcta)}`, 'alinear_comas')],
    distractores: pool(rng, [
      op(distinto(derecha, correcta), E('alinear_a_la_derecha'), [mal(`${a.m} + ${b.m} = ${a.m + b.m}`), paso(`${enunciado} = ${T(derecha)}`)]),
      op(distinto(decimales, correcta), E('decimales_a_la_derecha'), [mal(`${enunciado} = ${T(decimales)}`, `${parteDecimal(a)} + ${parteDecimal(b)} = ${parteDecimal(a) + parteDecimal(b)}`)]),
      op(distinto(sinLlevar, correcta), E('sin_llevar'), [mal(`${texD(a, K)} + ${texD(b, K)} = ${T(sinLlevar)}`)]),
    ]),
  };
}

function resta(rng) {
  const ka = rng.entero(1, 2), kb = ka === 1 ? 2 : 1;
  const b = conCifras(rng, 0, 20, kb);
  const a = mas(b, conCifras(rng, 0, 15, rng.entero(1, 2)));
  if (a.k !== ka) return null;
  const correcta = menos(a, b), K = Math.max(a.k, b.k);
  const enunciado = `${T(a)} - ${T(b)}`;
  const derecha = a.m > b.m ? D(a.m - b.m, K) : null;
  const decimales = parteDecimal(a) > parteDecimal(b) ? D((entera(a) - entera(b)) * P(K) + parteDecimal(a) - parteDecimal(b), K) : null;
  return {
    enunciado,
    correcta: op(correcta),
    solucion: [paso(`${texD(a, K)} - ${texD(b, K)} = ${T(correcta)}`, 'alinear_comas')],
    distractores: pool(rng, [
      op(distinto(porColumnas(a, b, (u, v) => Math.abs(u - v)), correcta), E('pequena_de_la_grande'), [mal(`${texD(a, K)} - ${texD(b, K)} = ${T(porColumnas(a, b, (u, v) => Math.abs(u - v)))}`)]),
      op(distinto(porColumnas(a, b, (u, v) => (u - v + 10) % 10), correcta), E('sin_llevar'), [mal(`${texD(a, K)} - ${texD(b, K)} = ${T(porColumnas(a, b, (u, v) => (u - v + 10) % 10))}`)]),
      derecha && op(distinto(derecha, correcta), E('alinear_a_la_derecha'), [mal(`${a.m} - ${b.m} = ${a.m - b.m}`), paso(`${enunciado} = ${T(derecha)}`)]),
      decimales && op(distinto(decimales, correcta), E('decimales_a_la_derecha'), [mal(`${enunciado} = ${T(decimales)}`, `${parteDecimal(a)} - ${parteDecimal(b)} = ${parteDecimal(a) - parteDecimal(b)}`)]),
    ]),
  };
}

// U5-1C-14 · decimales y naturales, también con tres términos: 5 - 0,37; 12 + 0,8 + 3,05.

function conNaturales(rng) {
  if (rng.moneda()) {
    const n = D(rng.entero(2, 20));
    const k = rng.entero(1, 2);
    const a = conCifras(rng, 0, n.m - 1, k);
    const correcta = menos(n, a);
    const enunciado = `${T(n)} - ${T(a)}`;
    const comoCifra = D(Math.abs(n.m - a.m), k);
    const columnas = f => porColumnas(n, a, f);
    return {
      enunciado,
      correcta: op(correcta),
      solucion: [paso(`${texD(n, k)} - ${T(a)} = ${T(correcta)}`, 'natural_con_coma')],
      distractores: pool(rng, [
        op(distinto(comoCifra, correcta), E('natural_como_cifra_decimal'), [mal(`${texD(D(n.m, k), k)} - ${T(a)} \\to ${T(comoCifra)}`), paso(`${enunciado} = ${T(comoCifra)}`)]),
        op(distinto(columnas((u, v) => Math.abs(u - v)), correcta), E('pequena_de_la_grande'), [mal(`${texD(n, k)} - ${T(a)} = ${T(columnas((u, v) => Math.abs(u - v)))}`)]),
        op(distinto(columnas((u, v) => (u - v + 10) % 10), correcta), E('sin_llevar'), [mal(`${texD(n, k)} - ${T(a)} = ${T(columnas((u, v) => (u - v + 10) % 10))}`)]),
      ]),
    };
  }
  const n = D(rng.entero(2, 30));
  const a = conCifras(rng, 0, 9, 1), b = conCifras(rng, 0, 9, 2);
  const [x, y, z] = rng.barajar([n, a, b]);
  const correcta = mas(mas(x, y), z), K = 2;
  const enunciado = `${T(x)} + ${T(y)} + ${T(z)}`;
  const comoCifra = mas(mas(a, b), D(n.m, K));
  const derecha = D(n.m + a.m + b.m, K);
  const decimales = D((entera(a) + entera(b) + n.m) * P(K) + parteDecimal(a) + parteDecimal(b), K);
  return {
    enunciado,
    correcta: op(correcta),
    solucion: [paso(`${[x, y, z].map(v => texD(v, K)).join(' + ')} = ${T(correcta)}`, 'natural_con_coma')],
    distractores: pool(rng, [
      op(distinto(comoCifra, correcta), E('natural_como_cifra_decimal'), [mal(`${[x, y, z].map(v => (v === n ? texD(D(n.m, K), K) : T(v))).join(' + ')} = ${T(comoCifra)}`)]),
      op(distinto(derecha, correcta), E('alinear_a_la_derecha'), [mal(`${x.m} + ${y.m} + ${z.m} = ${x.m + y.m + z.m}`), paso(`${enunciado} = ${T(derecha)}`)]),
      op(distinto(decimales, correcta), E('decimales_a_la_derecha'), [mal(`${enunciado} = ${T(decimales)}`, `${parteDecimal(a)} + ${parteDecimal(b)} = ${parteDecimal(a) + parteDecimal(b)}`)]),
    ]),
  };
}

// U5-1C-15 y U5-1C-16 · multiplicar y dividir por 10, 100 o 1000.

function porPotenciaDeDiez(rng) {
  const n = rng.entero(1, 3), p = P(n);
  const x = conCifras(rng, 0, n === 3 ? 9 : 99, rng.entero(1, 3));
  const correcta = escala(x, n);
  const enunciado = `${T(x)} \\cdot ${p}`;
  return {
    enunciado,
    correcta: op(correcta),
    solucion: [paso(`${enunciado} = ${T(correcta)}`, 'mover_coma_derecha')],
    distractores: pool(rng, [
      op(x, E('anadir_ceros'), [mal(`${enunciado} = ${texD(x, x.k + n)}`)], texD(x, x.k + n)),
      op(escala(x, -n), E('mover_coma_al_reves'), [mal(`${enunciado} = ${T(escala(x, -n))}`)]),
      n >= 2 && op(escala(x, n - 1), E('contar_posiciones'), [mal(`${enunciado} = ${T(escala(x, n - 1))}`)]),
      n <= 2 && op(escala(x, n + 1), E('contar_posiciones'), [mal(`${enunciado} = ${T(escala(x, n + 1))}`)]),
    ]),
  };
}

function entrePotenciaDeDiez(rng) {
  const n = rng.entero(1, 3), p = P(n);
  const x = rng.moneda(0.4) ? D(rng.entero(1, n === 3 ? 9 : 99)) : conCifras(rng, 0, n === 3 ? 9 : 99, rng.entero(1, 2));
  if (x.k === 0 && x.m % 10 === 0) return null;
  const correcta = escala(x, -n);
  const enunciado = `${T(x)} \\div ${p}`;
  const posiciones = [n - 1, n + 1, n + 2].filter(j => j >= 1).slice(0, 2);
  return {
    enunciado,
    correcta: op(correcta),
    solucion: [paso(`${enunciado} = ${T(correcta)}`, 'mover_coma_izquierda')],
    distractores: pool(rng, [
      op(escala(x, n), E('mover_coma_al_reves'), [mal(`${enunciado} = ${T(escala(x, n))}`)]),
      ...posiciones.map(j => op(escala(x, -j), E('contar_posiciones'), [mal(`${enunciado} = ${T(escala(x, -j))}`)])),
    ]),
  };
}

// ---------------------------------------------------------------------------
// Semana 2 · U5-2C-01 · un decimal por un natural.

function productoPorNatural(rng) {
  const a = conCifras(rng, 0, 20, rng.entero(1, 2));
  const n = D(rng.moneda(0.7) ? rng.entero(2, 9) : rng.entero(11, 25));
  const correcta = por(a, n);
  const [x, y] = rng.moneda(0.8) ? [a, n] : [n, a];
  const enunciado = `${T(x)} \\cdot ${T(y)}`;
  const digitos = a.m * n.m;
  return {
    enunciado,
    correcta: op(correcta),
    solucion: [paso(`${enunciado} = ${T(correcta)}`, 'decimales_producto', `${a.m} \\cdot ${n.m} = ${digitos}`)],
    distractores: pool(rng, [
      op(distinto(D(digitos, a.k - 1), correcta), E('contar_decimales_producto'), [mal(`${enunciado} = ${T(D(digitos, a.k - 1))}`, `${a.m} \\cdot ${n.m} = ${digitos}`)]),
      op(distinto(D(digitos, a.k + 1), correcta), E('contar_decimales_producto'), [mal(`${enunciado} = ${T(D(digitos, a.k + 1))}`, `${a.m} \\cdot ${n.m} = ${digitos}`)]),
      op(distinto(D(digitos), correcta), E('olvidar_coma'), [mal(`${enunciado} = ${digitos}`)]),
      op(distinto(mas(a, n), correcta), E('sumar_en_vez_de_multiplicar'), [mal(`${T(x)} + ${T(y)} = ${T(mas(a, n))}`)]),
    ]),
  };
}

// U5-2C-02 · dos decimales.

function producto(rng) {
  const a = conCifras(rng, 0, 9, rng.entero(1, 2));
  const b = conCifras(rng, 0, 3, a.k === 2 ? 1 : rng.entero(1, 2));
  const correcta = por(a, b), K = a.k + b.k, digitos = a.m * b.m;
  const enunciado = `${T(a)} \\cdot ${T(b)}`;
  const calculo = `${a.m} \\cdot ${b.m} = ${digitos}`;
  const variante = (k, id) => op(distinto(D(digitos, k), correcta), E(id), [mal(`${enunciado} = ${T(D(digitos, k))}`, calculo)]);
  return {
    enunciado,
    correcta: op(correcta),
    solucion: [paso(`${enunciado} = ${T(correcta)}`, 'decimales_producto', calculo)],
    distractores: pool(rng, [
      variante(K - 1, 'contar_decimales_producto'),
      variante(K + 1, 'contar_decimales_producto'),
      op(distinto(D(digitos), correcta), E('olvidar_coma'), [mal(`${enunciado} = ${digitos}`)]),
      op(distinto(mas(a, b), correcta), E('sumar_en_vez_de_multiplicar'), [mal(`${T(a)} + ${T(b)} = ${T(mas(a, b))}`)]),
    ]),
  };
}

// U5-2C-03 · por y entre 0,1, 0,01 y 0,001.

function porDecima(rng) {
  const n = rng.entero(1, 3), unidad = D(1, n);
  const multiplicar = rng.moneda();
  const x = conCifras(rng, 0, !multiplicar && n === 3 ? 9 : 99, rng.entero(1, 2));
  const sentido = multiplicar ? -1 : 1; // por 0,01 la coma va a la izquierda; entre 0,01, a la derecha
  const correcta = escala(x, sentido * n);
  const enunciado = `${T(x)} ${multiplicar ? '\\cdot' : '\\div'} ${T(unidad)}`;
  const posiciones = [n - 1, n + 1, n + 2].filter(j => j >= 1 && cifrasEnteras(escala(x, sentido * j)) <= 4);
  return {
    enunciado,
    correcta: op(correcta),
    solucion: [paso(`${enunciado} = ${T(correcta)}`, multiplicar ? 'por_decima' : 'entre_decima')],
    distractores: pool(rng, [
      (sentido > 0 || cifrasEnteras(escala(x, n)) <= 4) && op(escala(x, -sentido * n), E('mover_coma_al_reves'), [mal(`${enunciado} = ${T(escala(x, -sentido * n))}`)]),
      ...posiciones.map(j => op(escala(x, sentido * j), E('contar_posiciones'), [mal(`${enunciado} = ${T(escala(x, sentido * j))}`)])),
    ]),
  };
}

// U5-2C-04 · un decimal entre un natural (exacta): 8,4 : 4 = 2,1.

function divisionEntreNatural(rng) {
  const b = rng.entero(2, 9);
  const q = conCifras(rng, 0, 9, rng.entero(1, 3));
  const a = por(q, D(b));
  if (a.k !== q.k) return null; // 1,25 · 2 = 2,5: eso es seguir dividiendo, otra destreza
  const enunciado = `${T(a)} \\div ${b}`;
  const calculo = `${a.m} \\div ${b} = ${q.m}`;
  return {
    enunciado,
    correcta: op(q),
    solucion: [paso(`${enunciado} = ${T(q)}`, 'coma_en_cociente', calculo)],
    distractores: pool(rng, [
      op(distinto(D(q.m), q), E('olvidar_coma'), [mal(calculo), paso(`${enunciado} = ${q.m}`)]),
      op(escala(q, 1), E('division_coma_derecha'), [mal(`${enunciado} = ${T(escala(q, 1))}`)]),
      op(escala(q, -1), E('division_coma_izquierda'), [mal(`${enunciado} = ${T(escala(q, -1))}`)]),
      op(por(a, D(b)), E('multiplica_en_vez_de_dividir'), [mal(`${T(a)} \\cdot ${b} = ${T(por(a, D(b)))}`)]),
    ]),
  };
}

// U5-2C-05 · dos naturales con cociente decimal exacto hasta las milésimas: 7 : 4 = 1,75.

function divisionNaturales(rng) {
  const d = rng.elegir([2, 4, 5, 8, 20, 25, 40, 50]);
  const n = rng.entero(d + 1, Math.min(99, 12 * d));
  if (n % d === 0) return null;
  let k = 0;
  while ((n * P(k)) % d !== 0) k++;
  if (k > 3) return null;
  const q = D((n * P(k)) / d, k);
  const c = Math.floor(n / d), r = n % d;
  const restoMal = D(c * P(String(r).length) + r, String(r).length);
  const enunciado = `${n} \\div ${d}`;
  return {
    enunciado,
    correcta: op(q),
    solucion: [paso(`${enunciado} = ${T(q)}`, 'seguir_dividiendo', `${n} = ${d} \\cdot ${c} + ${r}`)],
    distractores: pool(rng, [
      op(distinto(restoMal, q), E('resto_como_decimales'), [mal(`${n} = ${d} \\cdot ${c} + ${r}`), paso(`${enunciado} = ${T(restoMal)}`)]),
      op(distinto(D(q.m), q), E('olvidar_coma'), [mal(`${enunciado} = ${q.m}`)]),
      op(escala(q, 1), E('division_coma_derecha'), [mal(`${enunciado} = ${T(escala(q, 1))}`)]),
      op(escala(q, -1), E('division_coma_izquierda'), [mal(`${enunciado} = ${T(escala(q, -1))}`)]),
    ]),
  };
}

// U5-2C-06 · entre un decimal, moviendo la coma en los dos: 8,4 : 0,16 = 840 : 16 = 52,5.

function divisionEntreDecimal(rng) {
  const kb = rng.entero(1, 2);
  const b = conCifras(rng, 0, kb === 1 ? 2 : 1, kb);
  const q = rng.moneda(0.6) ? D(rng.entero(2, 40)) : conCifras(rng, 1, 20, 1);
  const a = por(q, b);
  if (a.k > 3 || cifrasEnteras(a) > 3 || q.m % 10 === 0) return null;
  const enunciado = `${T(a)} \\div ${T(b)}`;
  const a2 = escala(a, kb), b2 = escala(b, kb);
  return {
    enunciado,
    correcta: op(q),
    solucion: [
      paso(`${enunciado} = ${T(a2)} \\div ${T(b2)}`, 'quitar_coma_divisor'),
      paso(`${T(a2)} \\div ${T(b2)} = ${T(q)}`, 'dividir_enteros'),
    ],
    distractores: pool(rng, [
      op(escala(q, -kb), E('division_escala_solo_divisor'), [mal(`${enunciado} = ${T(a)} \\div ${T(b2)}`), paso(`${T(a)} \\div ${T(b2)} = ${T(escala(q, -kb))}`)]),
      op(escala(q, 1), E('coma_de_mas_en_el_dividendo'), [mal(`${enunciado} = ${T(escala(a, kb + 1))} \\div ${T(b2)}`), paso(`${T(escala(a, kb + 1))} \\div ${T(b2)} = ${T(escala(q, 1))}`)]),
      op(distinto(por(a, b), q), E('multiplica_en_vez_de_dividir'), [mal(`${T(a)} \\cdot ${T(b)} = ${T(por(a, b))}`)]),
    ]),
  };
}

// U5-2C-08 · de fracción a decimal dividiendo (exacto hasta las milésimas): 7/20 = 0,35.

function decimalDe(n, d, cifras = 3) {
  // n : d cortando a `cifras` cifras decimales, y si es exacto.
  const m = Math.floor((n * P(cifras)) / d);
  return { v: D(m, cifras), exacto: (n * P(cifras)) % d === 0 };
}

function fraccionADecimal(rng) {
  const d = rng.elegir([2, 4, 5, 8, 20, 25, 40, 50]);
  const n = rng.entero(1, Math.min(4 * d, 99));
  if (mcd(n, d) !== 1) return null;
  const { v: correcta, exacto } = decimalDe(n, d);
  if (!exacto) return null;
  const alReves = decimalDe(d, n, 2);
  const cifrasD = String(d).length;
  const enunciado = frac(n, d);
  return {
    texto: { clave: 'como_decimal' },
    enunciado,
    correcta: op(correcta),
    solucion: [paso(`${enunciado} = ${n} \\div ${d} = ${T(correcta)}`, 'fraccion_es_division')],
    distractores: pool(rng, [
      op(distinto(alReves.v, correcta), E('dividir_al_reves'), [mal(`${enunciado} = ${d} \\div ${n} ${alReves.exacto ? '=' : '\\approx'} ${T(alReves.v)}`)]),
      op(distinto(D(n * P(cifrasD) + d, cifrasD), correcta), E('numerador_coma_denominador'), [mal(`${enunciado} = ${T(D(n * P(cifrasD) + d, cifrasD))}`)]),
      n === 1 && op(distinto(D(d, cifrasD), correcta), E('denominador_como_decimales'), [mal(`${enunciado} = ${T(D(d, cifrasD))}`)]),
      op(escala(correcta, 1), E('division_coma_derecha'), [mal(`${n} \\div ${d} = ${T(escala(correcta, 1))}`)]),
    ]),
  };
}

// U5-2C-09 · los de memoria: 1/2, 1/4, 3/4, 1/5, 1/10 y 1/100.

const DE_MEMORIA = [[1, 2], [1, 4], [3, 4], [1, 5], [1, 10], [1, 100]];

function deMemoria(rng) {
  const [n, d] = rng.elegir(DE_MEMORIA);
  const correcta = decimalDe(n, d).v;
  const enunciado = frac(n, d);
  const cifrasD = String(d).length;
  return {
    texto: { clave: 'como_decimal' },
    enunciado,
    correcta: op(correcta),
    solucion: [paso(`${enunciado} = ${T(correcta)}`, 'de_memoria')],
    distractores: pool(rng, [
      op(distinto(D(d, cifrasD), correcta), E('denominador_como_decimales'), [mal(`${enunciado} = ${T(D(d, cifrasD))}`)]),
      op(distinto(D(n * P(cifrasD) + d, cifrasD), correcta), E('numerador_coma_denominador'), [mal(`${enunciado} = ${T(D(n * P(cifrasD) + d, cifrasD))}`)]),
      ...DE_MEMORIA.filter(([x, y]) => x * d !== n * y).map(([x, y]) => {
        const v = decimalDe(x, y).v;
        return op(v, E('confundir_pares'), [mal(`${enunciado} = ${T(v)}`)]);
      }),
    ]),
  };
}

// U5-2C-10 · de decimal exacto a fracción irreducible; las impropias, impropias.
// La única excepción a «ninguna opción vale lo mismo» (acta, punto k): la
// fracción a medio simplificar, porque el enunciado pide la irreducible.

function decimalAFraccion(rng) {
  const k = rng.entero(2, 3);
  const x = conCifras(rng, 0, rng.moneda(0.7) ? 0 : 3, k);
  const den = P(k);
  const g = mcd(x.m, den);
  if (g === 1) return null; // 0,7 = 7/10 ya es irreducible: no hay nada que simplificar
  const [nR, dR] = reducir(x.m, den);
  // A medias: dividir solo por un divisor propio del m.c.d. (o no dividir).
  const divisores = [1, 2, 5, 4, 25, 8, 125].filter(p => p < g && g % p === 0);
  const p = rng.elegir(divisores);
  const [nM, dM] = [x.m / p, den / p];
  const conCeros = j => {
    const [a, b] = reducir(x.m, P(j));
    return fr(a, b, E('contar_ceros'), [mal(`${T(x)} = ${frac(x.m, P(j))}`), ...(mcd(x.m, P(j)) > 1 ? [paso(`${frac(x.m, P(j))} = ${texFraccion(a, b)}`, 'simplificar')] : [])]);
  };
  return {
    texto: { clave: 'como_fraccion_irreducible' },
    enunciado: T(x),
    correcta: fr(nR, dR),
    solucion: [
      paso(`${T(x)} = ${frac(x.m, den)}`, 'fraccion_decimal'),
      paso(`${frac(x.m, den)} = ${texFraccion(nR, dR)}`, 'simplificar', `\\text{mcd}(${x.m}, ${den}) = ${g}`),
    ],
    distractores: pool(rng, [
      { tex: frac(nM, dM), clave: `${nM}/${dM} a medias`, error: E('simplificar_a_medias'), pasos: [paso(`${T(x)} = ${frac(x.m, den)}`), mal(`${frac(x.m, den)} = ${frac(nM, dM)}`)] },
      conCeros(k - 1),
      conCeros(k + 1),
    ]),
  };
}

// U5-2C-13 · cuadrado y cubo de un decimal (dentro de las combinadas, en el papel; aquí, sueltos).

function potencia(rng) {
  const e = rng.moneda(0.65) ? 2 : 3;
  const b = conCifras(rng, 0, e === 2 ? 1 : 0, 1);
  const correcta = D(b.m ** e, b.k * e);
  const enunciado = `${T(b)}^{${e}}`;
  const producto = Array(e).fill(T(b)).join(' \\cdot ');
  const variante = k => op(distinto(D(b.m ** e, k), correcta), E('potencia_sin_contar_decimales'), [mal(`${enunciado} = ${T(D(b.m ** e, k))}`, `${b.m}^{${e}} = ${b.m ** e}`)]);
  return {
    enunciado,
    correcta: op(correcta),
    solucion: [paso(`${enunciado} = ${producto} = ${T(correcta)}`, 'potencia_es_producto')],
    distractores: pool(rng, [
      variante(b.k),
      e === 3 && variante(b.k * e - 1),
      variante(b.k * e + 1),
      op(distinto(por(b, D(e)), correcta), E('multiplicar_por_exponente'), [mal(`${enunciado} = ${T(b)} \\cdot ${e} = ${T(por(b, D(e)))}`)]),
    ]),
  };
}

// U5-2C-14 · combinada sin paréntesis: 5,02 + 200 · 0,087; 4,5 - 1,2 · 3.

function combinada(rng) {
  const b = rng.moneda() ? D(rng.entero(2, 9)) : conCifras(rng, 0, 4, 1);
  const c = conCifras(rng, 0, 5, rng.entero(1, 2));
  const bc = por(b, c);
  const sumar = rng.moneda();
  const a = sumar ? conCifras(rng, 0, 20, rng.entero(1, 2)) : mas(bc, conCifras(rng, 0, 10, rng.entero(1, 2)));
  if (cifrasEnteras(a) > 2) return null;
  const opera = (x, y) => (sumar ? mas(x, y) : menos(x, y));
  const s = sumar ? '+' : '-';
  const correcta = opera(a, bc);
  const enunciado = `${T(a)} ${s} ${T(b)} \\cdot ${T(c)}`;
  const izquierda = por(opera(a, b), c);
  const coma = j => {
    const mal1 = escala(bc, j), v = opera(a, mal1);
    return op(distinto(v, correcta), E('contar_decimales_producto'), [mal(`${enunciado} = ${T(a)} ${s} ${T(mal1)}`), paso(`${T(a)} ${s} ${T(mal1)} = ${T(v)}`)]);
  };
  return {
    enunciado,
    correcta: op(correcta),
    solucion: [
      paso(`${enunciado} = ${T(a)} ${s} ${T(bc)}`, 'jerarquia'),
      paso(`${T(a)} ${s} ${T(bc)} = ${T(correcta)}`),
    ],
    distractores: pool(rng, [
      op(distinto(izquierda, correcta), E('izquierda_a_derecha'), [mal(`${T(a)} ${s} ${T(b)} = ${T(opera(a, b))}`), paso(`${T(opera(a, b))} \\cdot ${T(c)} = ${T(izquierda)}`)]),
      coma(1),
      coma(-1),
    ]),
  };
}

// ---------------------------------------------------------------------------
// Negativos (acta, punto c): nunca nucleares, sin paréntesis al empezar.

// U5-1C-18 · sumar y restar: 2,5 - 4,25; -1,2 - 0,35; -3,5 + 1,25.

function negativosSuma(rng) {
  const ka = rng.entero(1, 2), kb = ka === 1 ? 2 : 1;
  const a = conCifras(rng, 0, 9, ka), b = conCifras(rng, 0, 9, kb);
  if (igual(a, b)) return null;
  const K = Math.max(ka, kb);
  const forma = rng.entero(0, 2);
  let enunciado, correcta, regla, derecha, nota;
  if (forma === 0) {
    // a - b con a < b
    if (a.m * P(K - a.k) >= b.m * P(K - b.k)) return null;
    enunciado = `${T(a)} - ${T(b)}`;
    correcta = menos(a, b);
    regla = opuesto(mas(a, b));
    derecha = D(-Math.abs(b.m - a.m), K);
    nota = 'signos_distintos';
  } else if (forma === 1) {
    // -a - b
    enunciado = `-${T(a)} - ${T(b)}`;
    correcta = opuesto(mas(a, b));
    regla = opuesto(D(Math.abs(menos(a, b).m), menos(a, b).k));
    derecha = D(-(a.m + b.m), K);
    nota = 'mismo_signo';
  } else {
    // -a + b
    enunciado = `-${T(a)} + ${T(b)}`;
    correcta = menos(b, a);
    regla = opuesto(mas(a, b));
    const sig = correcta.m < 0 ? -1 : 1;
    derecha = D(sig * Math.abs(a.m - b.m), K);
    nota = 'signos_distintos';
  }
  const sinSigno = opuesto(correcta);
  const mira = v => distinto(v, correcta, { negativo: true });
  return {
    enunciado,
    correcta: op(correcta),
    solucion: [paso(`${enunciado} = ${T(correcta)}`, nota)],
    distractores: pool(rng, [
      op(mira(sinSigno), E('perder_signo'), [mal(`${enunciado} = ${T(sinSigno)}`)]),
      op(mira(regla), E('regla_de_signos'), [mal(`${enunciado} = ${T(regla)}`)]),
      op(mira(derecha), E('alinear_a_la_derecha'), [mal(`${enunciado} = ${T(derecha)}`)]),
    ]),
  };
}

// U5-2C-16 · multiplicar y dividir con un negativo: -1,2 · 0,3; 2,5 · (-4); -8,4 : 4.

function negativosProducto(rng) {
  const dividir = rng.moneda(0.4);
  if (dividir) {
    const b = rng.entero(2, 9);
    const q = conCifras(rng, 0, 9, rng.entero(1, 2));
    const a = por(q, D(b));
    if (a.k !== q.k) return null;
    const correcta = opuesto(q);
    const enunciado = `-${T(a)} \\div ${b}`;
    const mira = v => distinto(v, correcta, { negativo: true });
    return {
      enunciado,
      correcta: op(correcta),
      solucion: [paso(`${enunciado} = ${T(correcta)}`, 'signos_producto', `${a.m} \\div ${b} = ${q.m}`)],
      distractores: pool(rng, [
        op(mira(q), E('perder_signo'), [mal(`${enunciado} = ${T(q)}`)]),
        op(mira(escala(correcta, 1)), E('division_coma_derecha'), [mal(`${enunciado} = ${T(escala(correcta, 1))}`)]),
        op(mira(escala(correcta, -1)), E('division_coma_izquierda'), [mal(`${enunciado} = ${T(escala(correcta, -1))}`)]),
      ]),
    };
  }
  const a = conCifras(rng, 0, 9, rng.entero(1, 2));
  const b = rng.moneda() ? D(rng.entero(2, 9)) : conCifras(rng, 0, 3, 1);
  const primeroNegativo = rng.moneda();
  const x = primeroNegativo ? opuesto(a) : a, y = primeroNegativo ? b : opuesto(b);
  const correcta = por(x, y), digitos = a.m * b.m, K = a.k + b.k;
  const enunciado = `${T(x)} \\cdot ${conSigno(y)}`;
  const mira = v => distinto(v, correcta, { negativo: true });
  return {
    enunciado,
    correcta: op(correcta),
    solucion: [paso(`${enunciado} = ${T(correcta)}`, 'signos_producto', `${a.m} \\cdot ${b.m} = ${digitos}`)],
    distractores: pool(rng, [
      op(mira(opuesto(correcta)), E('perder_signo'), [mal(`${enunciado} = ${T(opuesto(correcta))}`)]),
      op(mira(D(-digitos, K - 1)), E('contar_decimales_producto'), [mal(`${enunciado} = ${T(D(-digitos, K - 1))}`)]),
      op(mira(D(-digitos, K + 1)), E('contar_decimales_producto'), [mal(`${enunciado} = ${T(D(-digitos, K + 1))}`)]),
    ]),
  };
}

// ---------------------------------------------------------------------------

const subtipo = (id, items, forma) => ({
  id,
  items,
  generar: conReintentos(rng => {
    const datos = forma(rng);
    if (!datos) return null;
    const opciones = construirOpciones(rng, datos.correcta, datos.distractores);
    return opciones && { texto: datos.texto ?? { clave: 'calcula' }, enunciado: datos.enunciado, solucion: datos.solucion, opciones };
  }),
});

export const SUBTIPOS = [
  subtipo('fraccion_decimal', ['U5-1C-04'], fraccionDecimal),
  subtipo('redondear', ['U5-1C-10'], redondear),
  subtipo('suma', ['U5-1C-13'], suma),
  subtipo('resta', ['U5-1C-13'], resta),
  subtipo('con_naturales', ['U5-1C-14'], conNaturales),
  subtipo('por_potencia_de_diez', ['U5-1C-15'], porPotenciaDeDiez),
  subtipo('entre_potencia_de_diez', ['U5-1C-16'], entrePotenciaDeDiez),
  subtipo('negativos_suma', ['U5-1C-18'], negativosSuma),
  subtipo('producto_por_natural', ['U5-2C-01'], productoPorNatural),
  subtipo('producto', ['U5-2C-02'], producto),
  subtipo('por_decima', ['U5-2C-03'], porDecima),
  subtipo('division_entre_natural', ['U5-2C-04'], divisionEntreNatural),
  subtipo('division_naturales', ['U5-2C-05'], divisionNaturales),
  subtipo('division_entre_decimal', ['U5-2C-06'], divisionEntreDecimal),
  subtipo('fraccion_a_decimal', ['U5-2C-08'], fraccionADecimal),
  subtipo('de_memoria', ['U5-2C-09'], deMemoria),
  subtipo('decimal_a_fraccion', ['U5-2C-10'], decimalAFraccion),
  subtipo('potencia', ['U5-2C-13'], potencia),
  subtipo('combinada', ['U5-2C-14'], combinada),
  subtipo('negativos_producto', ['U5-2C-16'], negativosProducto),
];

export default {
  id: 'decimales',
  nombre: { es: 'Números decimales', en: 'Decimals' },
  curso: 1,
  concepto: 'decimales',
  // Los pasos del redondeo son aproximaciones («3,678 ≈ 3,7»): basta con que citen el valor.
  pasosLibres: true,
  items: [...new Set(SUBTIPOS.flatMap(s => s.items))].sort(),
  subtipos: SUBTIPOS.map(({ id, items }) => ({ id, items })),
  preguntas,
  errores,
  notas,
  generar: rng => rng.elegir(SUBTIPOS).generar(rng),
};
