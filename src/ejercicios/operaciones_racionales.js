// Fracciones y decimales: conversión entre las dos formas y operaciones
// combinadas que mezclan una fracción con un decimal.

import { construirOpciones, conReintentos, erroresDe, tex, texFraccion, claveFraccion, mcd, redondear } from './index.js';

export const errores = {
  invierte_numerador_denominador: { concepto: 'operaciones_racionales',
    es: 'Para pasar una fracción a decimal se divide el numerador entre el denominador, no al revés.', en: 'To turn a fraction into a decimal you divide the numerator by the denominator, not the other way round.' },
  lee_fraccion_como_decimal_literal: { concepto: 'operaciones_racionales',
    es: 'Una fracción no se convierte en decimal cambiando la barra por una coma: hay que dividir el numerador entre el denominador.', en: 'A fraction does not turn into a decimal by swapping the bar for a decimal point: you must divide the numerator by the denominator.' },
  coloca_mal_la_coma: { concepto: 'operaciones_racionales',
    es: 'Al dividir para pasar a decimal has colocado la coma en un sitio equivocado.', en: 'When dividing to get the decimal, you placed the decimal point in the wrong spot.' },
  denominador_potencia_equivocada: { concepto: 'operaciones_racionales',
    es: 'El denominador debe tener tantos ceros como cifras decimales tiene el número, ni más ni menos.', en: 'The denominator must have as many zeros as the number has decimal places, no more and no fewer.' },
  invierte_fraccion_generatriz: { concepto: 'operaciones_racionales',
    es: 'Has puesto el numerador y el denominador al revés.', en: 'You swapped the numerator and the denominator.' },
  toma_solo_primera_cifra: { concepto: 'operaciones_racionales',
    es: 'Hay que usar todas las cifras decimales en el numerador, no solo la primera.', en: 'You must use all the decimal digits in the numerator, not just the first one.' },
  usa_numerador_sin_convertir: { concepto: 'operaciones_racionales',
    es: 'Antes de operar hay que convertir la fracción a decimal (o el decimal a fracción); no se puede usar solo el numerador.', en: 'Before operating you must convert the fraction to a decimal (or the decimal to a fraction); you cannot just use the numerator.' },
  invierte_operador: { concepto: 'operaciones_racionales',
    es: 'Revisa si la operación es una suma o una resta: has hecho la contraria.', en: 'Check whether the operation is an addition or a subtraction: you did the opposite.' },
  orden_resta_racionales: { concepto: 'operaciones_racionales',
    es: 'Cuidado con el orden de la resta: se resta el segundo número al primero, no al revés.', en: 'Watch the order of the subtraction: the second number is subtracted from the first, not the other way round.' },
};
const E = erroresDe(errores);

export const preguntas = {
  a_decimal: { es: 'Escribe en forma decimal:', en: 'Write in decimal form:' },
  a_fraccion: { es: 'Escribe en forma de fracción irreducible:', en: 'Write as a fraction in lowest terms:' },
  calcula: { es: 'Calcula:', en: 'Work out:' },
};

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  fraccion_a_decimal_dividir: { es: 'Dividimos el numerador entre el denominador.', en: 'We divide the numerator by the denominator.' },
  fraccion_generatriz: { es: 'El decimal se escribe como fracción con sus cifras en el numerador y un 1 seguido de tantos ceros como cifras decimales en el denominador.', en: 'The decimal is written as a fraction with its digits as the numerator and a 1 followed by as many zeros as decimal places in the denominator.' },
  simplificar_racional: { es: 'Simplificamos dividiendo numerador y denominador por el mismo número.', en: 'We simplify by dividing numerator and denominator by the same number.' },
  convertir_fraccion: { es: 'Convertimos la fracción a decimal para poder operar.', en: 'We convert the fraction to a decimal so we can operate.' },
  sumar_racionales: { es: 'Sumamos los dos decimales.', en: 'We add the two decimals.' },
  restar_racionales: { es: 'Restamos los dos decimales.', en: 'We subtract the two decimals.' },
};

const T = tex;
const num = (v, error, pasos) => ({ tex: T(v), clave: redondear(v), error, pasos });
const fr = (n, d, error, pasos) => ({ tex: texFraccion(n, d), clave: claveFraccion(n, d), error, pasos });
const paso = (tex, nota = null, calculo = null) => ({ tex, nota, calculo });
const mal = (tex, calculo = null) => ({ tex, mal: true, calculo });

// Denominadores cuya fracción da siempre un decimal exacto.
const DENOMINADORES = [2, 4, 5, 8, 10, 20, 25, 50];

function fraccionADecimal(rng) {
  const d = rng.elegir(DENOMINADORES);
  const n = rng.entero(1, d - 1);
  const decimal = redondear(n / d);
  const enunciado = `\\frac{${n}}{${d}}`;
  // Redondeado a 2 decimales: la división invertida rara vez es exacta.
  const invertido = redondear(d / n, 2);
  const literal = Number(`${n}.${d}`);
  return {
    texto: { clave: 'a_decimal' },
    enunciado,
    correcta: num(decimal),
    solucion: [
      paso(`${enunciado} = ${n} \\div ${d} = ${T(decimal)}`, 'fraccion_a_decimal_dividir'),
    ],
    distractores: [
      num(invertido, E('invierte_numerador_denominador'), [
        mal(`${enunciado} = ${d} \\div ${n} = ${T(invertido)}`),
      ]),
      num(literal, E('lee_fraccion_como_decimal_literal'), [
        mal(`${enunciado} = ${T(literal)}`),
      ]),
      num(redondear(decimal * 10), E('coloca_mal_la_coma'), [
        mal(`${enunciado} = ${n} \\div ${d} = ${T(redondear(decimal * 10))}`),
      ]),
    ],
  };
}

function decimalAFraccion(rng) {
  const cifras = rng.entero(1, 2);
  const potencia = 10 ** cifras;
  const digitos = rng.entero(1, potencia - 1);
  const decimal = redondear(digitos / potencia);
  const divisor = mcd(digitos, potencia);
  const nR = digitos / divisor, dR = potencia / divisor;
  const enunciado = T(decimal);
  const primeraCifra = Math.floor(digitos / 10 ** (cifras - 1));
  return {
    texto: { clave: 'a_fraccion' },
    enunciado,
    correcta: fr(nR, dR),
    solucion: [
      paso(`${enunciado} = \\frac{${digitos}}{${potencia}}`, 'fraccion_generatriz'),
      ...(divisor > 1 ? [paso(`\\frac{${digitos}}{${potencia}} = ${texFraccion(nR, dR)}`, 'simplificar_racional', `\\text{mcd}(${digitos}, ${potencia}) = ${divisor}`)] : []),
    ],
    distractores: [
      fr(potencia, digitos, E('invierte_fraccion_generatriz'), [
        mal(`${enunciado} = ${texFraccion(potencia, digitos)}`),
      ]),
      fr(digitos, potencia * 10, E('denominador_potencia_equivocada'), [
        mal(`${enunciado} = ${texFraccion(digitos, potencia * 10)}`),
      ]),
      // Con una sola cifra decimal, "quedarse con la primera" da la fracción correcta: solo tiene sentido con dos.
      ...(cifras === 2 ? [fr(primeraCifra, 10, E('toma_solo_primera_cifra'), [
        mal(`${enunciado} = ${texFraccion(primeraCifra, 10)}`),
      ])] : []),
    ],
    genericos: [fr(nR + 1, dR), fr(Math.max(1, nR - 1), dR), fr(nR, dR + 1)],
  };
}

function combinada(rng) {
  const d = rng.elegir(DENOMINADORES);
  const n = rng.entero(1, d - 1);
  const fraccionDecimal = redondear(n / d);
  const cifrasDec = rng.entero(1, 2);
  const decimal = redondear(rng.entero(1, 9 * 10 ** (cifrasDec - 1)) / 10 ** cifrasDec + rng.entero(0, 4));
  const resta = rng.moneda(0.4);
  const enunciado = `\\frac{${n}}{${d}} ${resta ? '-' : '+'} ${T(decimal)}`;
  const correcta = resta ? redondear(fraccionDecimal - decimal) : redondear(fraccionDecimal + decimal);
  if (resta && correcta === 0) return null;
  const soloNumerador = resta ? redondear(n - decimal) : redondear(n + decimal);
  const invertida = resta ? redondear(decimal - fraccionDecimal) : correcta;
  return {
    texto: { clave: 'calcula' },
    enunciado,
    correcta: num(correcta),
    solucion: [
      paso(`\\frac{${n}}{${d}} = ${T(fraccionDecimal)}`, 'convertir_fraccion'),
      paso(`${T(fraccionDecimal)} ${resta ? '-' : '+'} ${T(decimal)} = ${T(correcta)}`, resta ? 'restar_racionales' : 'sumar_racionales'),
    ],
    distractores: [
      num(soloNumerador, E('usa_numerador_sin_convertir'), [
        mal(`${enunciado} = ${n} ${resta ? '-' : '+'} ${T(decimal)} = ${T(soloNumerador)}`),
      ]),
      num(resta ? redondear(fraccionDecimal + decimal) : redondear(fraccionDecimal - decimal), E('invierte_operador'), [
        paso(`\\frac{${n}}{${d}} = ${T(fraccionDecimal)}`),
        mal(`${T(fraccionDecimal)} ${resta ? '+' : '-'} ${T(decimal)} = ${T(resta ? redondear(fraccionDecimal + decimal) : redondear(fraccionDecimal - decimal))}`),
      ]),
      ...(resta ? [num(invertida, E('orden_resta_racionales'), [
        paso(`\\frac{${n}}{${d}} = ${T(fraccionDecimal)}`),
        mal(`${T(decimal)} - ${T(fraccionDecimal)} = ${T(invertida)}`),
      ])] : []),
    ],
    genericos: resta ? [] : [num(correcta + 1), num(Math.max(0, correcta - 1)), num(redondear(correcta + 0.1))],
  };
}

const FORMAS = [fraccionADecimal, fraccionADecimal, decimalAFraccion, decimalAFraccion, combinada, combinada];

export default {
  id: 'operaciones_racionales',
  nombre: { es: 'Fracciones y decimales', en: 'Fractions and decimals' },
  curso: 2,
  concepto: 'operaciones_racionales',
  preguntas,
  errores,
  notas,
  generar: conReintentos(rng => {
    const datos = rng.elegir(FORMAS)(rng);
    if (!datos) return null;
    const { texto, enunciado, correcta, solucion, distractores, genericos } = datos;
    const opciones = construirOpciones(rng, correcta, distractores, genericos);
    return opciones && { texto, enunciado, solucion, opciones };
  }),
};
