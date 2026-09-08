// Números decimales: suma, resta, producto y multiplicar o dividir por 10, 100, 1000.

import { construirOpciones, conReintentos, erroresDe, tex, redondear } from './index.js';

export const errores = {
  no_alinear_coma: { concepto: 'decimales',
    es: 'Para sumar o restar decimales hay que alinear las comas: décimas con décimas, centésimas con centésimas.', en: 'To add or subtract decimals, you must line up the decimal points: tenths with tenths, hundredths with hundredths.' },
  parte_decimal_como_entero: { concepto: 'decimales',
    es: 'La parte decimal no se suma como si fuera un número entero: 0,5 + 0,75 = 1,25, no 0,80.', en: 'The decimal part is not added as if it were a whole number: 0.5 + 0.75 = 1.25, not 0.80.' },
  contar_decimales_producto: { concepto: 'decimales',
    es: 'El producto tiene tantas cifras decimales como los dos factores juntos: 0,2 · 0,3 = 0,06.', en: 'The product has as many decimal places as both factors put together: 0.2 × 0.3 = 0.06.' },
  olvidar_coma: { concepto: 'decimales',
    es: 'Te has olvidado de la coma: multiplica como enteros y luego coloca los decimales.', en: 'You forgot the decimal point: multiply as whole numbers and then place the decimal point.' },
  sumar_en_vez_de_multiplicar: { concepto: 'decimales',
    es: 'Es un producto, no una suma.', en: 'It is a product, not a sum.' },
  mover_coma_lado_contrario: { concepto: 'decimales',
    es: 'Multiplicar por 10, 100, 1000 mueve la coma a la derecha; dividir, a la izquierda.', en: 'Multiplying by 10, 100 or 1000 moves the decimal point to the right; dividing moves it to the left.' },
  contar_posiciones: { concepto: 'decimales',
    es: 'La coma se mueve tantas posiciones como ceros tiene el 10, 100 o 1000.', en: 'The decimal point moves as many places as there are zeros in 10, 100 or 1000.' },
};
const E = erroresDe(errores);

// Notas de los pasos de la solución (sin números: los números van en el paso).
export const notas = {
  alinear_comas: { es: 'Alinea las comas y completa con ceros.', en: 'Line up the decimal points and fill in with zeros.' },
  decimales_producto: { es: 'Tantas cifras decimales como los dos factores juntos.', en: 'As many decimal places as both factors together.' },
  mover_coma_derecha: { es: 'Multiplica: la coma se mueve a la derecha.', en: 'Multiply: the decimal point moves to the right.' },
  mover_coma_izquierda: { es: 'Divide: la coma se mueve a la izquierda.', en: 'Divide: the decimal point moves to the left.' },
};

const num = (v, error, pasos) => ({ tex: tex(v), clave: redondear(v), error, pasos });
const r = v => redondear(v);
const paso = (tex, nota = null, calculo = null) => ({ tex, nota, calculo });
const mal = (tex, calculo = null) => ({ tex, mal: true, calculo });
const T = tex;

function decimal(rng, enteroMax, decimales) {
  return r(rng.entero(0, enteroMax) + rng.entero(1, 10 ** decimales - 1) / 10 ** decimales);
}

function partes(x, decimales) {
  const entera = Math.floor(x);
  const dec = Math.round((x - entera) * 10 ** decimales);
  return [entera, dec];
}

/** Escribe x con exactamente `decimales` cifras decimales, en TeX neutro. */
function texPad(x, decimales) {
  return x.toFixed(decimales).replace('.', '{,}');
}

function zeroPad(n, longitud) {
  return String(n).padStart(longitud, '0');
}

function suma(rng) {
  // Con distinto número de decimales, los dos errores típicos dan resultados
  // distintos del correcto (con el mismo número, "sumar como enteros" acierta).
  const da = rng.moneda() ? 1 : 2, db = 3 - da;
  const a = decimal(rng, 9, da), b = decimal(rng, 9, db);
  const [ea, fa] = partes(a, da), [eb, fb] = partes(b, db);
  const maxDec = Math.max(da, db);
  // Error: sumar las partes decimales como enteros.
  const malDecimal = r(ea + eb + (fa + fb) / 10 ** maxDec);
  // Error: sumar como enteros sin alinear (25 + 75 → 100) y poner la coma según el mayor.
  const strA = String(a).replace('.', ''), strB = String(b).replace('.', '');
  const sumaDigitos = Number(strA) + Number(strB);
  const sinAlinear = r(sumaDigitos / 10 ** maxDec);
  return {
    enunciado: `${tex(a)} + ${tex(b)}`,
    correcta: num(a + b),
    solucion: [
      paso(`${texPad(a, maxDec)} + ${texPad(b, maxDec)} = ${T(r(a + b))}`, 'alinear_comas'),
    ],
    distractores: [
      num(malDecimal, E('parte_decimal_como_entero'), [
        mal(`${T(a)} + ${T(b)} = ${T(malDecimal)}`, `${fa} + ${fb} = ${fa + fb}`),
      ]),
      num(sinAlinear, E('no_alinear_coma'), [
        mal(`${strA} + ${strB} = ${sumaDigitos}`),
        paso(`${sumaDigitos} \\div ${10 ** maxDec} = ${T(sinAlinear)}`),
      ]),
    ],
    genericos: [num(a + b + 0.1), num(a + b - 0.1), num(a + b + 1)],
  };
}

function resta(rng) {
  const db = 2;
  const b = decimal(rng, 5, db);
  const a = r(Math.floor(b) + rng.entero(1, 5) + rng.entero(1, 9) / 10);
  const [ea] = partes(a, 1), [eb, fb] = partes(b, db);
  const restarEnteras = r(ea - eb + fb / 10 ** db);
  const strA = String(a).replace('.', ''), strB = String(b).replace('.', '');
  const shiftedA = Number(strA) * 10 ** (db - 1);
  const diffDigitos = shiftedA - Number(strB);
  const sinAlinear = r(diffDigitos / 10 ** db);
  return {
    enunciado: `${tex(a)} - ${tex(b)}`,
    correcta: num(a - b),
    solucion: [
      paso(`${texPad(a, db)} - ${texPad(b, db)} = ${T(r(a - b))}`, 'alinear_comas'),
    ],
    distractores: [
      num(restarEnteras, E('parte_decimal_como_entero'), [
        mal(`${ea} - ${eb} = ${ea - eb}`),
        paso(`${ea - eb}{,}${zeroPad(fb, db)} = ${T(restarEnteras)}`),
      ]),
      num(sinAlinear, E('no_alinear_coma'), [
        mal(`${shiftedA} - ${strB} = ${diffDigitos}`, `${strA} \\cdot ${10 ** (db - 1)} = ${shiftedA}`),
        paso(`${diffDigitos} \\div ${10 ** db} = ${T(sinAlinear)}`),
      ]),
    ],
    genericos: [num(a - b + 0.1), num(a - b - 0.1), num(a - b + 1)],
  };
}

function producto(rng) {
  const a = r(rng.entero(1, 9) / 10), b = r(rng.entero(2, 9) / 10);
  const ab = r(a * b);
  const ia = Math.round(a * 10), ib = Math.round(b * 10);
  return {
    enunciado: `${tex(a)} \\cdot ${tex(b)}`,
    correcta: num(ab),
    solucion: [
      paso(`${T(a)} \\cdot ${T(b)} = ${T(ab)}`, 'decimales_producto', `${ia} \\cdot ${ib} = ${ia * ib}`),
    ],
    distractores: [
      num(ab * 10, E('contar_decimales_producto'), [
        mal(`${T(a)} \\cdot ${T(b)} = ${T(ab * 10)}`, `${ia} \\cdot ${ib} = ${ia * ib}`),
      ]),
      num(ab * 100, E('olvidar_coma'), [
        mal(`${T(a)} \\cdot ${T(b)} = ${ia * ib}`),
      ]),
      num(r(a + b), E('sumar_en_vez_de_multiplicar'), [
        mal(`${T(a)} + ${T(b)} = ${T(r(a + b))}`),
      ]),
    ],
    genericos: [num(ab / 10)],
  };
}

function porPotenciaDeDiez(rng) {
  const x = decimal(rng, 9, rng.entero(1, 3));
  const n = rng.entero(1, 3), p = 10 ** n;
  const multiplicar = rng.moneda();
  const correcta = multiplicar ? r(x * p) : r(x / p);
  const pWrong1 = p / 10, pWrong2 = p * 10;
  const opuesto = multiplicar ? r(x / p) : r(x * p);
  const contarMenos = multiplicar ? r(x * pWrong1) : r(x / pWrong1);
  const contarMas = multiplicar ? r(x * pWrong2) : r(x / pWrong2);
  return {
    enunciado: `${tex(x)} ${multiplicar ? '\\cdot' : '\\div'} ${p}`,
    correcta: num(correcta),
    solucion: [
      paso(`${T(x)} ${multiplicar ? '\\cdot' : '\\div'} ${p} = ${T(correcta)}`, multiplicar ? 'mover_coma_derecha' : 'mover_coma_izquierda'),
    ],
    distractores: [
      num(opuesto, E('mover_coma_lado_contrario'), [
        mal(`${T(x)} ${multiplicar ? '\\div' : '\\cdot'} ${p} = ${T(opuesto)}`),
      ]),
      num(contarMenos, E('contar_posiciones'), [
        mal(`${T(x)} ${multiplicar ? '\\cdot' : '\\div'} ${pWrong1} = ${T(contarMenos)}`),
      ]),
      num(contarMas, E('contar_posiciones'), [
        mal(`${T(x)} ${multiplicar ? '\\cdot' : '\\div'} ${pWrong2} = ${T(contarMas)}`),
      ]),
    ],
  };
}

const FORMAS = [suma, resta, producto, porPotenciaDeDiez, porPotenciaDeDiez];

export default {
  id: 'decimales',
  nombre: { es: 'Números decimales', en: 'Decimals' },
  curso: 1,
  concepto: 'decimales',
  preguntas: {},
  errores,
  notas,
  generar: conReintentos(rng => {
    const { enunciado, correcta, solucion, distractores, genericos } = rng.elegir(FORMAS)(rng);
    const opciones = construirOpciones(rng, correcta, distractores, genericos);
    return opciones && { texto: { clave: 'calcula' }, enunciado, solucion, opciones };
  }),
};
